import { useCachedPortfolioBalancesQuery } from "components/header/accountDrawer/PrefetchBalancesWrapper";
import { EllipsisStyle } from "components/header/styles";
import Grid from "components/ui/Grid";
import Typography from "components/ui/Typography";
import { TokenBalance } from "graphql/data/__generated__/types-and-hooks";
import {
  gqlToCurrency,
  logSentryErrorForUnsupportedChain
} from "graphql/data/util";
import { formatDelta } from "lib/utils/formatDelta";
import { formatNumber, NumberType } from "lib/utils/formatNumbers";
import { splitHiddenTokens } from "lib/utils/splitHiddenTokens";
import { useMemo, useState } from "react";
import styled from "styled-components";

import { PortfolioArrow } from "../../AuthenticatedHeader";
import { ExpandoRow } from "../ExpandoRow";
import { PortfolioLogo } from "../PortfolioLogo";
import PortfolioRow, {
  PortfolioSkeleton,
  PortfolioTabWrapper
} from "../PortfolioRow";
import { EmptyWalletModule } from "./EmptyWalletContent";

export default function Tokens({ account }: { account: string }) {
  const [showHiddenTokens, setShowHiddenTokens] = useState(false);

  const { data } = useCachedPortfolioBalancesQuery({ account });

  const tokenBalances = data?.portfolios?.[0].tokenBalances as
    | TokenBalance[]
    | undefined;

  const { visibleTokens, hiddenTokens } = useMemo(
    () => splitHiddenTokens(tokenBalances ?? []),
    [tokenBalances]
  );

  if (!data) {
    return <PortfolioSkeleton />;
  }

  if (tokenBalances?.length === 0) {
    // TODO: consider launching moonpay here instead of just closing the drawer
    return <EmptyWalletModule type="token" />;
  }

  const toggleHiddenTokens = () =>
    setShowHiddenTokens((showHiddenTokens) => !showHiddenTokens);

  return (
    <PortfolioTabWrapper>
      {visibleTokens.map(
        (tokenBalance) =>
          tokenBalance.token && (
            <TokenRow
              key={tokenBalance.id}
              {...tokenBalance}
              token={tokenBalance.token}
            />
          )
      )}
      <ExpandoRow
        isExpanded={showHiddenTokens}
        toggle={toggleHiddenTokens}
        numItems={hiddenTokens.length}
      >
        {hiddenTokens.map(
          (tokenBalance) =>
            tokenBalance.token && (
              <TokenRow
                key={tokenBalance.id}
                {...tokenBalance}
                token={tokenBalance.token}
              />
            )
        )}
      </ExpandoRow>
    </PortfolioTabWrapper>
  );
}

const TokenBalanceText = styled(Typography)`
  ${EllipsisStyle}
`;
const TokenNameText = styled(Typography)`
  ${EllipsisStyle}
`;

type PortfolioToken = NonNullable<TokenBalance["token"]>;

function TokenRow({
  token,
  quantity,
  denominatedValue,
  tokenProjectMarket
}: TokenBalance & { token: PortfolioToken }) {
  const percentChange = tokenProjectMarket?.pricePercentChange?.value ?? 0;

  const currency = gqlToCurrency(token);
  if (!currency) {
    logSentryErrorForUnsupportedChain({
      extras: { token },
      errorMessage:
        "Token from unsupported chain received from Mini Portfolio Token Balance Query"
    });
    return null;
  }
  return (
    <PortfolioRow
      left={
        <PortfolioLogo
          chainId={currency.chainId}
          currencies={[currency]}
          size="40px"
        />
      }
      title={<TokenNameText>{token?.name}</TokenNameText>}
      descriptor={
        <TokenBalanceText>
          {formatNumber(quantity, NumberType.TokenNonTx)} {token?.symbol}
        </TokenBalanceText>
      }
      right={
        denominatedValue && (
          <>
            <Typography>
              {formatNumber(
                denominatedValue?.value,
                NumberType.PortfolioBalance
              )}
            </Typography>
            <Grid justifyContent="flex-end">
              <PortfolioArrow
                change={percentChange}
                size={20}
                strokeWidth={1.75}
              />
              <Typography>{formatDelta(percentChange)}</Typography>
            </Grid>
          </>
        )
      }
    />
  );
}
