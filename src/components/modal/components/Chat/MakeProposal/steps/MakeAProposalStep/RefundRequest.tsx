import { BigNumber, utils } from "ethers";
import { useFormikContext } from "formik";
import styled from "styled-components";
import { useAccount } from "wagmi";

import { Exchange } from "../../../../../../../lib/utils/hooks/useExchanges";
import { useSellers } from "../../../../../../../lib/utils/hooks/useSellers";
import useFunds from "../../../../../../../pages/account/funds/useFunds";
import { Input } from "../../../../../../form";
import Price from "../../../../../../price";
import Grid from "../../../../../../ui/Grid";
import Typography from "../../../../../../ui/Typography";
import { MAX_PERCENTAGE_DECIMALS } from "../../../const";
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
  const { data: sellers } = useSellers({ admin: address });
  const accountId = sellers?.[0]?.id || "";
  const { funds } = useFunds(accountId);
  const { offer } = exchange;
  const currencyInDeposit = funds?.find(
    (fund) => fund.token.address === offer.exchangeToken.address
  );
  const decimals = Number(offer.exchangeToken.decimals);
  const formatIntValueToDecimals = (value: string | BigNumber) => {
    return utils.formatUnits(BigNumber.from(value), decimals);
  };
  const inEscrow: string = BigNumber.from(offer.price)
    .add(BigNumber.from(currencyInDeposit?.availableAmount || "0"))
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
      <Grid gap="1rem" alignItems="flex-start">
        <Grid flexDirection="column">
          <Typography $fontSize="1rem" fontWeight="600">
            In escrow
          </Typography>
          <Typography $fontSize="0.75rem" fontWeight="400">
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
        <Grid flexDirection="column">
          <Typography $fontSize="1rem" fontWeight="600">
            Requested refund
          </Typography>
          <Typography $fontSize="0.75rem" fontWeight="400">
            Request a specific amount as a refund
          </Typography>
          <RequestedRefundInput
            address={address || ""}
            exchangeToken={offer.exchangeToken}
            inEscrow={inEscrow}
            inEscrowWithDecimals={inEscrowWithDecimals}
          />
        </Grid>
        <Grid flexDirection="column">
          <Typography $fontSize="1rem" fontWeight="600">
            Percentage
          </Typography>
          <Typography $fontSize="0.75rem" fontWeight="400">
            Edit as %
          </Typography>
          <Input
            step={10 ** -MAX_PERCENTAGE_DECIMALS}
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
