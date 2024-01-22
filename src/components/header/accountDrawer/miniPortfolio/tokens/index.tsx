import { Token } from "@uniswap/sdk-core";
import { EllipsisStyle } from "components/header/styles";
import { Typography } from "components/ui/Typography";
import { ethers } from "ethers";
import { nativeOnChain } from "lib/constants/tokens";
import { formatNumber, NumberType } from "lib/utils/formatNumbers";
import { useChainId } from "lib/utils/hooks/connection/connection";
import { useTokenBalances } from "lib/utils/hooks/defaultTokenList/useTokenBalances";
import styled from "styled-components";

import { PortfolioLogo } from "../PortfolioLogo";
import PortfolioRow, {
  PortfolioSkeleton,
  PortfolioTabWrapper
} from "../PortfolioRow";
import { EmptyWalletModule } from "./EmptyWalletContent";

export default function Tokens({ account }: { account: string }) {
  const chainId = useChainId();
  const { data: tokenBalances, isLoading } = useTokenBalances({
    address: account,
    chainId
  });

  if (!chainId || isLoading) {
    return <PortfolioSkeleton />;
  }

  if (!tokenBalances || tokenBalances?.length === 0) {
    // TODO: consider launching moonpay here instead of just closing the drawer
    return <EmptyWalletModule type="token" />;
  }

  return (
    <PortfolioTabWrapper>
      {tokenBalances.map(
        (tokenBalance) =>
          tokenBalance.address && (
            <TokenRow
              key={tokenBalance.address}
              {...tokenBalance}
              chainId={chainId}
            />
          )
      )}
    </PortfolioTabWrapper>
  );
}

const TokenBalanceText = styled(Typography)`
  ${EllipsisStyle}
`;
const TokenNameText = styled(Typography)`
  ${EllipsisStyle}
`;

function TokenRow({
  formattedBalance,
  symbol,
  name,
  address,
  decimals,
  chainId
}: {
  formattedBalance: string;
  symbol: string;
  name: string;
  address: string;
  decimals: string;
  chainId: number;
}) {
  const currency =
    address === ethers.constants.AddressZero
      ? nativeOnChain(chainId)
      : new Token(chainId, address, Number(decimals), symbol, name);
  return (
    <PortfolioRow
      left={
        <PortfolioLogo chainId={chainId} size="40px" currencies={[currency]} />
      }
      title={<TokenNameText>{name}</TokenNameText>}
      descriptor={
        <TokenBalanceText>
          {formatNumber(Number(formattedBalance), NumberType.TokenNonTx)}{" "}
          {symbol}
        </TokenBalanceText>
      }
    />
  );
}
