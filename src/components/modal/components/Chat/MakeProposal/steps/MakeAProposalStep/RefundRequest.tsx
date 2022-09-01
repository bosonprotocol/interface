import { BigNumber, utils } from "ethers";
import { useFormikContext } from "formik";
import styled from "styled-components";
import { useAccount } from "wagmi";

import { useBreakpoints } from "../../../../../../../lib/utils/hooks/useBreakpoints";
import { Exchange } from "../../../../../../../lib/utils/hooks/useExchanges";
import { Input } from "../../../../../../form";
import Price from "../../../../../../price";
import Grid from "../../../../../../ui/Grid";
import Typography from "../../../../../../ui/Typography";
import { MIN_VALUE } from "../../../const";
import { FormModel } from "../../MakeProposalFormModel";
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

const StyledPrice = styled(Price)`
  position: absolute;
  top: 0;
  right: 1rem;
  left: 0.5rem;
  bottom: 0;

  > div {
    align-items: flex-end;
  }

  small {
    margin: 0 !important;
    > * {
      font-size: 0.75rem;
    }
  }

  svg {
    transform: translate(0, -50%) scale(1);
  }
`;

interface Props {
  exchange: Exchange;
}

export default function RefundRequest({ exchange }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { setFieldValue, handleChange } = useFormikContext<any>();

  const { address } = useAccount();
  const { offer } = exchange;
  const { isLteS } = useBreakpoints();
  const decimals = Number(offer.exchangeToken.decimals);
  const formatIntValueToDecimals = (value: string | BigNumber) => {
    return utils.formatUnits(BigNumber.from(value), decimals);
  };
  const inEscrow: string = BigNumber.from(offer.price)
    .add(BigNumber.from(offer.sellerDeposit || "0"))
    .toString();
  const inEscrowWithDecimals: string = formatIntValueToDecimals(inEscrow);
  const currencySymbol = offer.exchangeToken.symbol;
  return (
    <>
      <Typography $fontSize="1.5rem" fontWeight="600">
        Refund request
      </Typography>
      <Typography $fontSize="1rem">
        You will keep your purchased product and get a partial refund.
      </Typography>
      <Grid
        gap="1rem"
        alignItems="flex-start"
        flexDirection={isLteS ? "column" : "row"}
      >
        <Grid flexDirection="column" flexBasis="30%">
          <Typography
            $fontSize="1rem"
            fontWeight="600"
            margin={isLteS ? "1.5625rem auto 0 0" : "0"}
          >
            In escrow
          </Typography>
          <Typography
            $fontSize="0.75rem"
            fontWeight="400"
            margin={isLteS ? "0.625rem auto 0.625rem 0" : "0"}
          >
            Item price + seller diposit
          </Typography>
          <InEscrowPriceWrapper>
            <Input
              name={FormModel.formFields.escrow.name}
              type="number"
              readOnly
            />
            <StyledPrice
              address={offer.exchangeToken.address}
              currencySymbol={currencySymbol}
              value={inEscrow}
              decimals={offer.exchangeToken.decimals}
              isExchange
              convert
            />
          </InEscrowPriceWrapper>
        </Grid>
        <Grid flexDirection="column" flexBasis="40%">
          <Typography
            $fontSize="1rem"
            fontWeight="600"
            margin={isLteS ? "1.5625rem auto 0 0" : "0"}
          >
            Requested refund
          </Typography>
          <Typography
            $fontSize="0.75rem"
            fontWeight="400"
            margin={isLteS ? "0.625rem auto 0.625rem 0" : "0"}
          >
            Request a specific amount as a refund
          </Typography>
          <RequestedRefundInput
            address={address || ""}
            exchangeToken={offer.exchangeToken}
            inEscrow={inEscrow}
            inEscrowWithDecimals={inEscrowWithDecimals}
          />
        </Grid>
        <Grid flexDirection="column" flexBasis="30%">
          <Typography
            $fontSize="1rem"
            fontWeight="600"
            margin={isLteS ? "1.5625rem auto 0 0" : "0"}
          >
            Percentage
          </Typography>
          <Typography
            $fontSize="0.75rem"
            fontWeight="400"
            margin={isLteS ? "0.625rem auto 0.625rem 0" : "0"}
          >
            Edit as %
          </Typography>
          <Input
            step={MIN_VALUE}
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
              const valueInDecimals: string = formatIntValueToDecimals(
                BigNumber.from(inEscrow)
                  .mul(valueAsNumber * 1000)
                  .div(100 * 1000)
              );
              setFieldValue(
                FormModel.formFields.refundAmount.name,
                valueInDecimals,
                true
              );
            }}
          />
        </Grid>
      </Grid>
    </>
  );
}
