import {
  ButtonSize,
  Currencies,
  CurrencyDisplay,
  subgraph
} from "@bosonprotocol/react-kit";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { colors } from "../../../lib/styles/colors";
import { ProgressStatus } from "../../../lib/types/progressStatus";
import { calcPrice } from "../../../lib/utils/calcPrice";
import useFunds from "../../../pages/account/funds/useFunds";
import { useConvertionRate } from "../../convertion-rate/useConvertionRate";
import { Spinner } from "../../loading/Spinner";
import Tooltip from "../../tooltip/Tooltip";
import BosonButton from "../../ui/BosonButton";
import Grid from "../../ui/Grid";
import Typography from "../../ui/Typography";
import { useModal } from "../useModal";

const WithdrawButton = styled(BosonButton)`
  padding: 0.25rem 1rem;
  background: transparent;
  color: ${colors.green};
  border: 2px solid ${colors.green};
  :hover:not(:disabled) {
    background: ${colors.green};
    border: 2px solid ${colors.green};
  }
`;

const TokenWrapper = styled(Grid)`
  flex-basis: 33%;
  text-align: left;
  justify-content: flex-start;
`;
const WithdrawableWrapper = styled(Grid)`
  flex-basis: 67%;
  text-align: left;
`;
const AmountWrapper = styled.div`
  padding: 1rem;
  margin-left: 1rem;
`;
const SpinnerContainer = styled.div`
  padding: 1rem;
  text-align: center;
`;

interface Props {
  id: string;
}
export default function ManageFunds({ id }: Props) {
  const {
    store: { tokens }
  } = useConvertionRate();
  const { funds, reload, fundStatus } = useFunds(id, tokens);
  const [uiFunds, setUiFunds] =
    useState<subgraph.FundsEntityFieldsFragment[]>(funds);
  const { showModal, modalTypes } = useModal();

  useEffect(() => {
    setUiFunds((prevFunds) => [
      ...Array.from(
        new Map(
          [...funds, ...prevFunds].map((v) => [v.token.address, v])
        ).values()
      )
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [funds, id]);

  if (fundStatus === ProgressStatus.ERROR) {
    // TODO: NO FIGMA REPRESENTATIONS
    return <Typography tag="h2">There has been an error...</Typography>;
  }

  if (
    fundStatus === ProgressStatus.LOADING ||
    fundStatus === ProgressStatus.IDLE
  ) {
    return (
      <SpinnerContainer>
        <Spinner size={32} />
      </SpinnerContainer>
    );
  }

  return (
    <>
      <Grid justifyContent="flex-start">
        <TokenWrapper>
          <Typography tag="p" $fontSize="0.75rem" fontWeight="600">
            Token
          </Typography>
        </TokenWrapper>
        <WithdrawableWrapper>
          <Typography tag="p" $fontSize="0.75rem" fontWeight="600">
            Withdrawable
          </Typography>
        </WithdrawableWrapper>
      </Grid>
      {uiFunds?.map((fund) => {
        const withdrawable = calcPrice(
          fund.availableAmount,
          fund.token.decimals
        );
        return (
          <Grid justifyContent="flex-start" key={fund.id}>
            <TokenWrapper>
              {fund.token.symbol}
              <Tooltip content={fund.token.symbol} wrap={false}>
                <CurrencyDisplay
                  currency={fund.token.symbol as Currencies}
                  height={18}
                />
              </Tooltip>
            </TokenWrapper>
            <WithdrawableWrapper>
              <AmountWrapper>{withdrawable}</AmountWrapper>
              <WithdrawButton
                variant="primaryFill"
                size={ButtonSize.Small}
                onClick={() => {
                  showModal(
                    modalTypes.FINANCE_WITHDRAW_MODAL,
                    {
                      title: `Withdraw ${fund.token.symbol}`,
                      protocolBalance: withdrawable,
                      symbol: fund.token.symbol,
                      accountId: id,
                      tokenDecimals: fund.token.decimals,
                      exchangeToken: fund.token.address,
                      availableAmount: fund.availableAmount,
                      reload: reload
                    },
                    "auto",
                    "dark"
                  );
                }}
              >
                Withdraw
              </WithdrawButton>
            </WithdrawableWrapper>
          </Grid>
        );
      })}
    </>
  );
}
