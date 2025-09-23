import { BigNumber } from "ethers";
import { useFormikContext } from "formik";
import styled from "styled-components";

import { MIN_VALUE } from "../../../../../../../lib/constants/percentages";
import { colors } from "../../../../../../../lib/styles/colors";
import { calcPrice } from "../../../../../../../lib/utils/calcPrice";
import { useBreakpoints } from "../../../../../../../lib/utils/hooks/useBreakpoints";
import { Exchange } from "../../../../../../../lib/utils/hooks/useExchanges";
import { Input } from "../../../../../../form";
import { InputError } from "../../../../../../form/Input";
import { Grid } from "../../../../../../ui/Grid";
import { Typography } from "../../../../../../ui/Typography";
import { FormModel } from "../../MakeProposalFormModel";
import InEscrowInput from "./InEscrowInput";
import RequestedRefundInput from "./RequestedRefundInput";

const InEscrowPriceWrapper = styled.div`
  position: relative;
  width: 100%;
  [data-icon-price] {
    justify-content: space-between;
    [data-currency] {
      all: unset;
      transform: scale(0.75);
    }
  }
  [data-icon-price][data-with-symbol] {
    /* change once :has is supported */
    padding: 0;
    width: 100%;
  }
`;

interface Props {
  exchange: Exchange;
  iAmTheBuyer: boolean;
}

export default function RefundRequest({ exchange, iAmTheBuyer }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { setFieldValue, handleChange } = useFormikContext<any>();

  const { offer } = exchange;
  const { isLteS } = useBreakpoints();
  const decimals = Number(offer.exchangeToken.decimals);
  const formatIntValueToDecimals = (value: string) => {
    return calcPrice(value, decimals.toString());
  };
  const inEscrow: string = BigNumber.from(offer.price)
    .add(BigNumber.from(offer.sellerDeposit || "0"))
    .toString();

  const inEscrowWithDecimals: string = formatIntValueToDecimals(inEscrow);
  return (
    <>
      <Typography fontSize="1.5rem" fontWeight="600">
        Refund request
      </Typography>
      <Typography fontSize="1rem">
        {iAmTheBuyer
          ? "You will keep your purchased product and get a partial refund."
          : "The buyer will keep the purchased product and also get a partial refund."}
      </Typography>
      <Grid gap="1rem" alignItems="flex-start" flexDirection="column">
        <Grid flexDirection="column" flexBasis="40%" alignItems="flex-start">
          <Typography
            fontSize="1rem"
            fontWeight="600"
            margin={isLteS ? "1.5625rem auto 0 0" : "0"}
          >
            In escrow
          </Typography>
          <Typography
            fontSize="0.75rem"
            fontWeight="400"
            margin={isLteS ? "0.625rem auto 0.625rem 0" : "0"}
          >
            Item price + seller deposit
          </Typography>
          <InEscrowPriceWrapper>
            <InEscrowInput
              exchangeToken={offer.exchangeToken}
              inEscrow={inEscrow}
            />
          </InEscrowPriceWrapper>
        </Grid>
        <Grid flexDirection="column" flexBasis="40%" alignItems="flex-start">
          <Typography
            fontSize="1rem"
            fontWeight="600"
            margin={isLteS ? "1.5625rem auto 0 0" : "0"}
          >
            Requested refund
          </Typography>
          <Typography
            fontSize="0.75rem"
            fontWeight="400"
            margin={isLteS ? "0.625rem auto 0.625rem 0" : "0"}
          >
            Request a specific amount as a refund
          </Typography>
          <RequestedRefundInput
            exchangeToken={offer.exchangeToken}
            inEscrow={inEscrow}
            inEscrowWithDecimals={inEscrowWithDecimals}
          />
        </Grid>
        <Grid flexDirection="column" flexBasis="20%" alignItems="flex-start">
          <Typography
            fontSize="1rem"
            fontWeight="600"
            margin={isLteS ? "1.5625rem auto 0 0" : "0"}
          >
            Percentage
          </Typography>
          <Typography
            fontSize="0.75rem"
            fontWeight="400"
            margin={isLteS ? "0.625rem auto 0.625rem 0" : "0"}
          >
            Edit as %
          </Typography>
          <div
            style={{
              width: "100%",
              background: colors.greyLight,
              paddingRight: "1rem",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              border: `1px solid ${colors.border}`
            }}
          >
            <Input
              style={{ textAlign: "right", border: "none", paddingRight: "0" }}
              step={MIN_VALUE}
              hideError
              name={FormModel.formFields.refundPercentage.name}
              type="number"
              onChange={(e) => {
                handleChange(e);
                const {
                  target: { valueAsNumber }
                } = e;
                if (isNaN(valueAsNumber)) {
                  return;
                }
                const valueAsString = BigNumber.from(inEscrow)
                  .mul(valueAsNumber * 1000)
                  .div(100 * 1000)
                  .toString();
                const valueInDecimals: string =
                  formatIntValueToDecimals(valueAsString);
                setFieldValue(
                  FormModel.formFields.refundAmount.name,
                  valueInDecimals,
                  true
                );
              }}
            />
            <span>%</span>
          </div>
          <InputError name={FormModel.formFields.refundPercentage.name} />
        </Grid>
      </Grid>
    </>
  );
}
