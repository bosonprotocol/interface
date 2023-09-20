import { useWeb3React } from "@web3-react/core";
import { CopyButton } from "components/form/Field.styles";
import { useUser } from "components/magicLink/UserContext";
import { useWeb3 } from "components/magicLink/Web3Context";
import { colors } from "lib/styles/colors";
import { getColor1OverColor2WithContrast } from "lib/styles/contrast";
import copyToClipboard from "lib/utils/copyToClipboard";
import { useCSSVariable } from "lib/utils/hooks/useCSSVariable";
import useENSName from "lib/utils/hooks/useENSName";
import { getMagicLogout } from "lib/utils/magicLink/logout";
import { useMagic } from "lib/utils/magicLink/magic";
import {
  ArrowDownRight,
  ArrowUpRight,
  Copy,
  CreditCard,
  IconProps,
  Info,
  SignOut
} from "phosphor-react";
import { useCallback, useState } from "react";
import { useAppDispatch } from "state/hooks";
import { updateSelectedWallet } from "state/user/reducer";
import styled from "styled-components";

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
import StatusIcon from "../identicon/StatusIcon";
import { FiatLink } from "./fiatOnrampModal/FiatLink";
// import FiatOnrampModal from "./fiatOnrampModal";
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

const HeaderButton = styled.button<{ $color: string }>`
  color: ${({ $color }) => $color};
  background-color: var(--buttonBgColor);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  border-color: transparent;
  border-radius: 12px;
  border-style: solid;
  border-width: 1px;
  height: 40px;
  margin-top: 8px;

  position: relative;
  z-index: 1;
  letter-spacing: 0.5px;
  font-style: normal;
  font-size: 1rem;
  font-weight: 500;
  line-height: 24px;

  :hover {
    background-color: color-mix(in srgb, var(--buttonBgColor) 90%, black);
    transition: 125ms background-color ease-in;
  }
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
  const { ENSName } = useENSName(account);
  const dispatch = useAppDispatch();
  const magic = useMagic();
  const { setWeb3 } = useWeb3();
  const { setUser } = useUser();
  const magicLogout = getMagicLogout(magic);
  const connection = getConnection(connector);

  const disconnect = useCallback(() => {
    if (connector && connector.deactivate) {
      connector.deactivate();
    }
    connector.resetState();
    magicLogout(setWeb3, setUser);
    dispatch(updateSelectedWallet({ wallet: undefined }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connector, dispatch]);

  // const toggleWalletDrawer = useToggleAccountDrawer();

  // const openFiatOnrampModal = useOpenModal(ApplicationModal.FIAT_ONRAMP);
  // const openFoRModal = useCallback(() => {
  //   toggleWalletDrawer();
  //   openFiatOnrampModal();

  // }, [toggleWalletDrawer, openFiatOnrampModal]);

  // const [shouldCheck, setShouldCheck] = useState(false);
  // const {
  //   available: fiatOnrampAvailable,
  //   availabilityChecked: fiatOnrampAvailabilityChecked,
  //   error,
  //   loading: fiatOnrampAvailabilityLoading
  // } = useFiatOnrampAvailability(shouldCheck, openFoRModal);

  // const handleBuyCryptoClick = useCallback(() => {
  //   if (!fiatOnrampAvailabilityChecked) {
  //     setShouldCheck(true);
  //   } else if (fiatOnrampAvailable) {
  //     openFoRModal();
  //   }
  // }, [fiatOnrampAvailabilityChecked, fiatOnrampAvailable, openFoRModal]);
  // const disableBuyCryptoButton = Boolean(
  //   error ||
  //     (!fiatOnrampAvailable && fiatOnrampAvailabilityChecked) ||
  //     fiatOnrampAvailabilityLoading
  // );
  const error = false;
  const fiatOnrampAvailabilityLoading = false;
  const fiatOnrampAvailable = true;
  const fiatOnrampAvailabilityChecked = false;
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
  const color = getColor1OverColor2WithContrast({
    color2: useCSSVariable("--buttonBgColor") || colors.primary,
    color1: useCSSVariable("--textColor") || colors.black
  });
  return (
    <AuthenticatedHeaderWrapper>
      {/* 
       TODO: uncomment when we create a moonpay account
      <FiatOnrampModal /> */}
      <HeaderWrapper>
        <StatusWrapper>
          <StatusIcon account={account} connection={connection} size={40} />
          {account && (
            <AccountNamesWrapper>
              <Typography gap="0.5rem">
                {ENSName ?? formatAddress(account)}
                <CopyButton
                  onClick={async () => {
                    await copyToClipboard(ENSName ?? account);
                  }}
                >
                  <Copy size={14} />
                </CopyButton>
              </Typography>
              {/* Displays smaller view of account if ENS name was rendered above */}
              {ENSName && (
                <Typography>
                  {formatAddress(account)}
                  <CopyButton
                    onClick={async () => {
                      await copyToClipboard(account);
                    }}
                  >
                    <Copy size={14} />
                  </CopyButton>
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
            <Typography
              fontWeight={500}
              $fontSize="36px"
              data-testid="portfolio-total-balance"
            >
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
            <LoadingBubble height="16px" width="100px" margin="4px 0 20px 0" />
          </Column>
        )}
        <FiatLink>
          <HeaderButton
            $color={color}
            // onClick={handleBuyCryptoClick}
            // disabled={disableBuyCryptoButton}
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
        </FiatLink>
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
