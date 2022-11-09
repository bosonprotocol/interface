import { Currencies, CurrencyDisplay } from "@bosonprotocol/react-kit";
import { Lock } from "phosphor-react";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { CONFIG } from "../../../lib/config";
import { colors } from "../../../lib/styles/colors";
import { Offer } from "../../../lib/types/offer";
import { IPrice } from "../../../lib/utils/convertPrice";
import { useCoreSDK } from "../../../lib/utils/useCoreSdk";
import { useConvertedPrice } from "../../price/useConvertedPrice";
import Grid from "../../ui/Grid";
// import { useConvertedPriceFunction } from "../../price/useConvertedPriceFunction";

interface Props {
  offer: Offer;
}

interface Condition {
  __typename?: "ConditionEntity" | undefined;
  id: string;
  method: number;
  tokenType: number;
  tokenAddress: string;
  tokenId: string;
  threshold?: string;
  maxCommits: string;
  minBalance?: string;
}

/**
 * tokenType 0 - 20
 * tokenType 1 - 721
 * tokenType 2 - 1155
 * method 1 - Threshold
 * method 2 - specific token
 */

interface TokenInfo {
  convertedValue: IPrice;
  symbol: string;
}

const buildMessage = (condition: Condition, tokenInfo: TokenInfo) => {
  const { method, tokenType, tokenId, tokenAddress, threshold } = condition;

  if (tokenType === 0) {
    return (
      <>
        {tokenInfo.convertedValue.price} {tokenInfo.symbol} tokens (
        <a href={CONFIG.getTxExplorerUrl?.(tokenAddress)} target="_blank">
          {tokenAddress.slice(0, 10)}...
        </a>
        )
      </>
    );
  }
  if (tokenType === 1) {
    if (method === 1) {
      return (
        <>
          Token ID: {tokenId} from{" "}
          <a href={CONFIG.getTxExplorerUrl?.(tokenAddress)} target="_blank">
            {tokenAddress.slice(0, 15)}...
          </a>
        </>
      );
    }
    if (method === 2) {
      return (
        <>
          {threshold} tokens from{" "}
          <a href={CONFIG.getTxExplorerUrl?.(tokenAddress)} target="_blank">
            {tokenAddress.slice(0, 10)}...
          </a>
        </>
      );
    }
  }
  if (tokenType === 2) {
    return (
      <>
        {threshold} x Token ID: {tokenId} tokens from{" "}
        <a href={CONFIG.getTxExplorerUrl?.(tokenAddress)} target="_blank">
          {tokenAddress.slice(0, 10)}...
        </a>
      </>
    );
  }
  return "";
};

const TokenGated = ({ offer }: Props) => {
  const { condition } = offer;
  const core = useCoreSDK();
  const [tokenInfo, setTokenInfo] = useState({
    name: "",
    decimals: "",
    symbol: ""
  });

  useEffect(() => {
    (async () => {
      const { name, decimals, symbol } = await core.getExchangeTokenInfo(
        offer.condition?.tokenAddress || ""
      );
      setTokenInfo({ name, decimals: decimals.toString(), symbol });
    })();
  }, [offer, core]);

  const convertedValue = useConvertedPrice({
    value: condition?.threshold || "",
    decimals: tokenInfo?.decimals || "",
    symbol: tokenInfo?.symbol || ""
  });

  if (!condition) {
    return null;
  }
  const displayMessage = buildMessage(condition, {
    convertedValue: convertedValue,
    symbol: tokenInfo.symbol
  });

  return (
    <Grid as="section" padding="0 0">
      <TokenGatedInfo>
        <TokenIconWrapper>
          <TokenIcon>
            <CurrencyDisplay
              currency={tokenInfo.symbol as Currencies}
              height={18}
            />
          </TokenIcon>
          <LockIcon>
            <Lock size={25} color={colors.grey} />
          </LockIcon>
        </TokenIconWrapper>

        <LockInfo>
          <LockInfoTitle>Token Gated Offer</LockInfoTitle>
          <LockInfoDesc>
            You need to own the following token(s) to Commit:
          </LockInfoDesc>
          <LockInfoDesc>{displayMessage}</LockInfoDesc>
        </LockInfo>
      </TokenGatedInfo>
    </Grid>
  );
};

export default TokenGated;

const TokenGatedInfo = styled.div`
  padding: 1rem;
  background: ${colors.black};
  display: inline-flex;
  width: 100%;
  align-items: center;
`;

const TokenIconWrapper = styled.div`
  margin-right: 1.5rem;
  padding-left: 0;
  display: flex;
`;

const LockIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  z-index: 5;
  border: 0.125rem solid ${colors.black};
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: ${colors.white};
`;

const TokenIcon = styled.div`
  background-color: ${colors.white};
  padding: 0.5rem;
  z-index: 3;
  position: relative;
  left: 22px;
  border: 0.125rem solid ${colors.black};
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: ${colors.white};
`;

const LockInfo = styled.div`
  display: grid;
  width: 100%;
`;

const LockInfoTitle = styled.span`
  font-weight: 600;
  font-size: 1rem;
  color: ${colors.white};
`;

const LockInfoDesc = styled.div`
  font-size: 0.75rem;
  color: ${colors.grey2};
  a {
    font-size: 0.75rem;
    color: ${colors.grey2};
  }
  div {
    display: unset;
    vertical-align: middle;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }
`;
