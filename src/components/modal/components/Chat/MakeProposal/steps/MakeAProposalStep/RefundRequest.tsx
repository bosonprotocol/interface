import { BigNumber, constants, utils } from "ethers";
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

const PriceWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledPrice = styled(Price)`
  position: absolute;
  top: 0;
  right: 1rem;

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
  const { setFieldValue, handleChange } = useFormikContext<any>();

  const { address } = useAccount();
  const { data: sellers } = useSellers({ admin: address });
  const accountId = sellers?.[0]?.id || "";
  const { funds } = useFunds(accountId);
  const nativeCoinInDeposit = funds?.find(
    (fund) => fund.token.address === constants.AddressZero
  );
  const { offer } = exchange;
  const inEscrow: string = BigNumber.from(offer.price)
    .add(BigNumber.from(nativeCoinInDeposit?.availableAmount || "0"))
    .toString();
  const inEscrowDecimals = nativeCoinInDeposit
    ? utils.formatUnits(
        BigNumber.from(inEscrow),
        Number(nativeCoinInDeposit.token.decimals)
      )
    : "0";
  return (
    <>
      <Typography fontSize="1.5rem" fontWeight="600">
        Refund request
      </Typography>
      <Typography fontSize="1rem">
        You will keep your purchased product and get a partial refund.
      </Typography>
      <Grid gap="1rem" alignItems="flex-start">
        <Grid flexDirection="column">
          <Typography fontSize="1rem" fontWeight="600">
            In escrow
          </Typography>
          <Typography fontSize="0.75rem" fontWeight="400">
            Item price + seller diposit
          </Typography>
          <PriceWrapper>
            <Input name="escrow" type="number" readOnly />
            <StyledPrice
              address={offer.exchangeToken.address}
              currencySymbol={offer.exchangeToken.symbol}
              value={inEscrow}
              decimals={offer.exchangeToken.decimals}
              isExchange
              convert
            />
          </PriceWrapper>
        </Grid>
        <Grid flexDirection="column">
          <Typography fontSize="1rem" fontWeight="600">
            Requested refund
          </Typography>
          <Typography fontSize="0.75rem" fontWeight="400">
            Request a specific amount as a refund
          </Typography>
          <Input
            name="refundAmount"
            type="number"
            onChange={(e) => {
              handleChange(e);
              const {
                target: { valueAsNumber }
              } = e;
              setFieldValue(
                "refundPercentage",
                ((valueAsNumber / Number(inEscrowDecimals)) * 100).toFixed(2),
                true
              );
            }}
          />
        </Grid>
        <Grid flexDirection="column">
          <Typography fontSize="1rem" fontWeight="600">
            Percentage
          </Typography>
          <Typography fontSize="0.75rem" fontWeight="400">
            Edit as %
          </Typography>
          <Input
            name="refundPercentage"
            type="number"
            onChange={(e) => {
              handleChange(e);
              const {
                target: { valueAsNumber }
              } = e;
              setFieldValue(
                "refundAmount",
                (Number(inEscrowDecimals) * valueAsNumber) / 100,
                true
              );
            }}
          />
        </Grid>
      </Grid>
    </>
  );
}
