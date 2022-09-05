import { BigNumber, utils } from "ethers";
import styled from "styled-components";

import { colors } from "../../../lib/styles/colors";
import useFunds from "../../../pages/account/funds/useFunds";
import { Spinner } from "../../loading/Spinner";
import Button from "../../ui/Button";
import Grid from "../../ui/Grid";
import Typography from "../../ui/Typography";
import { useModal } from "../useModal";

const processValue = (value: string, decimals: string) => {
  try {
    return utils.formatUnits(BigNumber.from(value), Number(decimals));
  } catch (e) {
    console.error(e);
    return "";
  }
};

const WithdrawButton = styled(Button)`
  padding: 0.25rem 1rem;
  background: transparent;
  color: ${colors.green};
  :hover:not(:disabled) {
    background: ${colors.green};
    border: 2px solid ${colors.green};
  }
`;

const TokenWrapper = styled.div`
  flex-basis: 33%;
  text-align: left;
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
  const { funds, reload, fundStatus } = useFunds(id);
  const { showModal, modalTypes } = useModal();

  if (fundStatus === "error") {
    // TODO: NO FIGMA REPRESENTATIONS
    return <Typography tag="h2">There has been an error...</Typography>;
  }

  if (fundStatus === "loading" || fundStatus === "idle") {
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
          <Typography tag="p" $fontSize="0.75rem" fontWeight="bold">
            Token
          </Typography>
        </TokenWrapper>
        <WithdrawableWrapper>
          <Typography tag="p" $fontSize="0.75rem" fontWeight="bold">
            Withdrawable
          </Typography>
        </WithdrawableWrapper>
      </Grid>
      {funds?.length < 1 && (
        <Typography tag="p" $fontSize="1" fontWeight="bold" textAlign="center">
          No founds
        </Typography>
      )}
      {funds?.map((fund) => {
        const withdrawable = processValue(
          fund.availableAmount,
          fund.token.decimals
        );
        return (
          <Grid justifyContent="flex-start" key={fund.id}>
            <TokenWrapper>{fund.token.symbol}</TokenWrapper>
            <WithdrawableWrapper>
              <AmountWrapper>{withdrawable}</AmountWrapper>
              <WithdrawButton
                theme="secondary"
                size="small"
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
