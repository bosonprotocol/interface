import { EvaluationMethod, TokenType } from "@bosonprotocol/common";
import { Check, X } from "phosphor-react";
import { CSSProperties, useEffect, useState } from "react";
import styled from "styled-components";

import { CONFIG } from "../../../lib/config";
import { colors } from "../../../lib/styles/colors";
import { Offer } from "../../../lib/types/offer";
import { IPrice } from "../../../lib/utils/convertPrice";
import { useCoreSDK } from "../../../lib/utils/useCoreSdk";
import { useConvertedPrice } from "../../price/useConvertedPrice";
import Grid from "../../ui/Grid";

interface Props {
  offer: Offer;
  commitProxyAddress?: string;
  openseaLinkToOriginalMainnetCollection?: string;
  isConditionMet?: boolean;
  style?: CSSProperties;
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

  if (tokenType === TokenType.FungibleToken) {
    return (
      <>
        {tokenInfo.convertedValue.price} {tokenInfo.symbol} tokens (
        <a href={CONFIG.getTxExplorerUrl?.(tokenAddress, true)} target="_blank">
          {tokenAddress.slice(0, 10)}...
        </a>
        )
      </>
    );
  }
  if (tokenType === TokenType.NonFungibleToken) {
    if (method === EvaluationMethod.Threshold) {
      return (
        <>
          {threshold} tokens from{" "}
          <a
            href={CONFIG.getTxExplorerUrl?.(tokenAddress, true)}
            target="_blank"
          >
            {tokenAddress.slice(0, 10)}...
          </a>
        </>
      );
    }
    if (method === EvaluationMethod.SpecificToken) {
      return (
        <>
          Token ID: {tokenId} from{" "}
          <a
            href={CONFIG.getTxExplorerUrl?.(tokenAddress, true)}
            target="_blank"
          >
            {tokenAddress.slice(0, 15)}...
          </a>
        </>
      );
    }
  }
  if (tokenType === TokenType.MultiToken) {
    return (
      <>
        {threshold} x token(s) with id: {tokenId} from{" "}
        <a href={CONFIG.getTxExplorerUrl?.(tokenAddress, true)} target="_blank">
          {tokenAddress.slice(0, 10)}...
        </a>
      </>
    );
  }
  return "";
};

const TokenGated = ({
  offer,
  commitProxyAddress,
  openseaLinkToOriginalMainnetCollection,
  isConditionMet,
  style
}: Props) => {
  const { condition } = offer;
  const core = useCoreSDK();
  const [tokenInfo, setTokenInfo] = useState({
    name: "",
    decimals: "",
    symbol: ""
  });

  useEffect(() => {
    (async () => {
      if (condition?.tokenAddress && condition?.tokenType === 0) {
        try {
          const { name, decimals, symbol } = await core.getExchangeTokenInfo(
            condition.tokenAddress
          );
          setTokenInfo({ name, decimals: decimals?.toString(), symbol });
        } catch (error) {
          setTokenInfo({ name: "", decimals: "", symbol: "" });
        }
      }
    })();
  }, [condition, core]);

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
    <Grid as="section" padding="0 0" style={style}>
      <TokenGatedInfo>
        <TokenIconWrapper>
          <TokenIcon $conditionMet={isConditionMet} />

          <IconWrapper $conditionMet={isConditionMet}>
            {isConditionMet ? (
              <Check size={25} color={colors.black} />
            ) : (
              <X size={25} color={colors.red} />
            )}
          </IconWrapper>
        </TokenIconWrapper>

        <LockInfo>
          <LockInfoTitle>Token Gated Offer</LockInfoTitle>
          {commitProxyAddress && openseaLinkToOriginalMainnetCollection ? (
            <>
              <LockInfoDesc>
                You {!isConditionMet && " must "} hold token(s) from
              </LockInfoDesc>
              <LockInfoDesc>
                <a
                  href={openseaLinkToOriginalMainnetCollection}
                  target="_blank"
                >
                  {openseaLinkToOriginalMainnetCollection}
                </a>
              </LockInfoDesc>
            </>
          ) : (
            <>
              <LockInfoDesc>
                You {!isConditionMet && " need to "} own the following token(s)
                to Commit:
              </LockInfoDesc>
              <LockInfoDesc>{displayMessage}</LockInfoDesc>
            </>
          )}
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

const IconWrapper = styled.div<{ $conditionMet?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  z-index: 5;
  border: 0.125rem solid
    ${({ $conditionMet }) => ($conditionMet ? colors.black : colors.red)};
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: ${({ $conditionMet }) =>
    $conditionMet ? colors.green : colors.black};
`;

const TokenIcon = styled.div<{ $conditionMet?: boolean }>`
  background-color: ${({ $conditionMet }) =>
    $conditionMet ? colors.green : colors.black};
  padding: 0.5rem;
  z-index: 3;
  position: relative;
  left: 1.375rem;
  border: 0.125rem solid
    ${({ $conditionMet }) => ($conditionMet ? colors.black : colors.red)};
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
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
