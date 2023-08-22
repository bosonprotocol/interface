import { ThemedButton } from "@bosonprotocol/react-kit";
import { useWeb3React } from "@web3-react/core";
import { colors } from "lib/styles/colors";
import {
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  IconProps,
  Info,
  SignOut
} from "phosphor-react";
import { useCallback, useState } from "react";
import {
  useFiatOnrampAvailability,
  useOpenModal,
  useToggleModal
} from "state/application/hooks";
import { ApplicationModal } from "state/application/reducer";
import { useAppDispatch } from "state/hooks";
import { updateSelectedWallet } from "state/user/reducer";
import styled from "styled-components";
import { useEnsName } from "wagmi";

import { getConnection } from "../../../lib/connection";
import { formatAddress } from "../../../lib/utils/address";
import { formatDelta } from "../../../lib/utils/formatDelta";
import { formatNumber, NumberType } from "../../../lib/utils/formatNumbers";
import { Spinner } from "../../loading/Spinner";
import Tooltip from "../../tooltip/Tooltip";
import Column from "../../ui/column";
import Grid from "../../ui/Grid";
import { LoadingBubble } from "../../ui/LoadingBubble";
import Typography from "../../ui/Typography";
import { useToggleAccountDrawer } from ".";
import { IconWithConfirmTextButton } from "./IconButton";
import MiniPortfolio from "./miniPortfolio";
import { portfolioFadeInAnimation } from "./miniPortfolio/PortfolioRow";
import { useCachedPortfolioBalancesQuery } from "./PrefetchBalancesWrapper";

const AuthenticatedHeaderWrapper = styled.div`
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const HeaderButton = styled(ThemedButton)`
  border-color: transparent;
  border-radius: 12px;
  border-style: solid;
  border-width: 1px;
  height: 40px;
  margin-top: 8px;
`;
const IconHoverText = styled.span`
  color: ${colors.white};
  position: absolute;
  top: 28px;
  border-radius: 8px;
  transform: translateX(-50%);
  opacity: 0;
  font-size: 12px;
  padding: 5px;
  left: 10px;
`;
const IconContainer = styled.div`
  display: flex;
  align-items: center;
  & > a,
  & > button {
    margin-right: 8px;
  }

  & > button:last-child {
    margin-right: 0px;
    ${IconHoverText}:last-child {
      left: 0px;
    }
  }
`;
const FiatOnrampNotAvailableText = styled(Typography)`
  align-items: center;
  color: ${({ theme }) => theme.textSecondary};
  display: flex;
  justify-content: center;
`;
const FiatOnrampAvailabilityExternalLink = styled.a`
  align-items: center;
  display: flex;
  height: 14px;
  justify-content: center;
  margin-left: 6px;
  width: 14px;
`;

const StatusWrapper = styled.div`
  display: inline-block;
  width: 70%;
  max-width: 70%;
  padding-right: 8px;
  display: inline-flex;
`;

const AccountNamesWrapper = styled.div`
  overflow: hidden;
  white-space: nowrap;
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
`;

const StyledInfoIcon = styled(Info)`
  height: 12px;
  width: 12px;
  flex: 1 1 auto;
`;

const HeaderWrapper = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;
// TODO:
const CopyText = styled.div.attrs({
  iconSize: 14,
  iconPosition: "right"
})``;

const FadeInColumn = styled(Column)`
  ${portfolioFadeInAnimation}
`;

const PortfolioDrawerContainer = styled(Column)`
  flex: 1;
`;

export function PortfolioArrow({
  change,
  ...rest
}: { change: number } & IconProps) {
  return change < 0 ? (
    <ArrowDownRight size={20} {...rest} />
  ) : (
    <ArrowUpRight size={20} {...rest} />
  );
}

export default function AuthenticatedHeader({ account }: { account: string }) {
  const { connector } = useWeb3React();
  const { data: ENSName } = useEnsName({ address: account as `0x${string}` });
  const dispatch = useAppDispatch();
  // const navigate = useNavigate();
  // const closeModal = useCloseModal();

  const connection = getConnection(connector);
  const openClaimModal = useToggleModal(ApplicationModal.ADDRESS_CLAIM);

  const disconnect = useCallback(() => {
    if (connector && connector.deactivate) {
      connector.deactivate();
    }
    connector.resetState();
    dispatch(updateSelectedWallet({ wallet: undefined }));
  }, [connector, dispatch]);

  const toggleWalletDrawer = useToggleAccountDrawer();

  const openFiatOnrampModal = useOpenModal(ApplicationModal.FIAT_ONRAMP);
  const openFoRModalWithAnalytics = useCallback(() => {
    toggleWalletDrawer();
    openFiatOnrampModal();
  }, [openFiatOnrampModal, toggleWalletDrawer]);

  const [shouldCheck, setShouldCheck] = useState(false);
  const {
    available: fiatOnrampAvailable,
    availabilityChecked: fiatOnrampAvailabilityChecked,
    error,
    loading: fiatOnrampAvailabilityLoading
  } = useFiatOnrampAvailability(shouldCheck, openFoRModalWithAnalytics);

  const handleBuyCryptoClick = useCallback(() => {
    if (!fiatOnrampAvailabilityChecked) {
      setShouldCheck(true);
    } else if (fiatOnrampAvailable) {
      openFoRModalWithAnalytics();
    }
  }, [
    fiatOnrampAvailabilityChecked,
    fiatOnrampAvailable,
    openFoRModalWithAnalytics
  ]);
  const disableBuyCryptoButton = Boolean(
    error ||
      (!fiatOnrampAvailable && fiatOnrampAvailabilityChecked) ||
      fiatOnrampAvailabilityLoading
  );
  const [showFiatOnrampUnavailableTooltip, setShow] = useState<boolean>(false);
  const openFiatOnrampUnavailableTooltip = useCallback(
    () => setShow(true),
    [setShow]
  );
  const closeFiatOnrampUnavailableTooltip = useCallback(
    () => setShow(false),
    [setShow]
  );

  const { data: portfolioBalances } = useCachedPortfolioBalancesQuery({
    account
  });
  const portfolio = portfolioBalances?.portfolios?.[0];
  const totalBalance = portfolio?.tokensTotalDenominatedValue?.value;
  const absoluteChange =
    portfolio?.tokensTotalDenominatedValueChange?.absolute?.value;
  const percentChange =
    portfolio?.tokensTotalDenominatedValueChange?.percentage?.value;

  return (
    <AuthenticatedHeaderWrapper>
      <HeaderWrapper>
        <StatusWrapper>
          {/* TODO: <StatusIcon account={account} connection={connection} size={40} /> */}
          {account && (
            <AccountNamesWrapper>
              <Typography>
                <CopyText /*TODO:toCopy={ENSName ?? account}*/>
                  {ENSName ?? formatAddress(account)}
                </CopyText>
              </Typography>
              {/* Displays smaller view of account if ENS name was rendered above */}
              {ENSName && (
                <Typography color="textTertiary">
                  <CopyText /*TODO:toCopy={account}*/>
                    {formatAddress(account)}
                  </CopyText>
                </Typography>
              )}
            </AccountNamesWrapper>
          )}
        </StatusWrapper>
        <IconContainer>
          <IconWithConfirmTextButton
            data-testid="wallet-disconnect"
            onConfirm={disconnect}
            Icon={SignOut}
            text="Disconnect"
            dismissOnHoverOut
          />
        </IconContainer>
      </HeaderWrapper>
      <PortfolioDrawerContainer>
        {totalBalance !== undefined ? (
          <FadeInColumn gap="xs">
            <Typography fontWeight={500} data-testid="portfolio-total-balance">
              {formatNumber(totalBalance, NumberType.PortfolioBalance)}
            </Typography>
            <Grid marginBottom="20px">
              {absoluteChange !== 0 && percentChange && (
                <>
                  <PortfolioArrow change={absoluteChange as number} />
                  <Typography>
                    {`${formatNumber(
                      Math.abs(absoluteChange as number),
                      NumberType.PortfolioBalance
                    )} (${formatDelta(percentChange)})`}
                  </Typography>
                </>
              )}
            </Grid>
          </FadeInColumn>
        ) : (
          <Column gap="xs">
            <LoadingBubble height="44px" width="170px" />
            <LoadingBubble height="16px" width="100px" margin="4px 0 20px 0" />
          </Column>
        )}
        <HeaderButton
          // TODO: size={ButtonSize.medium}
          // TODO: emphasis={ButtonEmphasis.medium}
          onClick={handleBuyCryptoClick}
          disabled={disableBuyCryptoButton}
          data-testid="wallet-buy-crypto"
        >
          {error ? (
            <Typography>{error}</Typography>
          ) : (
            <>
              {fiatOnrampAvailabilityLoading ? (
                <Spinner />
              ) : (
                <CreditCard height="20px" width="20px" />
              )}{" "}
              Buy crypto
            </>
          )}
        </HeaderButton>
        {Boolean(!fiatOnrampAvailable && fiatOnrampAvailabilityChecked) && (
          <FiatOnrampNotAvailableText marginTop="8px">
            Not available in your region
            <Tooltip
              disabled={!showFiatOnrampUnavailableTooltip}
              content={
                "Moonpay is not available in some regions. Click to learn more."
              }
            >
              <FiatOnrampAvailabilityExternalLink
                onMouseEnter={openFiatOnrampUnavailableTooltip}
                onMouseLeave={closeFiatOnrampUnavailableTooltip}
                style={{ color: "inherit" }}
                href="https://support.uniswap.org/hc/en-us/articles/11306664890381-Why-isn-t-MoonPay-available-in-my-region-"
              >
                <StyledInfoIcon />
              </FiatOnrampAvailabilityExternalLink>
            </Tooltip>
          </FiatOnrampNotAvailableText>
        )}
        <MiniPortfolio account={account} />
      </PortfolioDrawerContainer>
    </AuthenticatedHeaderWrapper>
  );
}
