import { EvaluationMethod, TokenType } from "@bosonprotocol/common";
import { useConfigContext } from "components/config/ConfigContext";
import { Check, X } from "phosphor-react";
import { CSSProperties, useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import { DappConfig } from "../../../lib/config";
import { colors } from "../../../lib/styles/colors";
import { Offer } from "../../../lib/types/offer";
import { IPrice } from "../../../lib/utils/convertPrice";
import { sanitizeUrl } from "../../../lib/utils/url";
import { useCoreSDK } from "../../../lib/utils/useCoreSdk";
import { useConvertedPrice } from "../../price/useConvertedPrice";
import Grid from "../../ui/Grid";
import Image from "../../ui/Image";

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
  minTokenId: string;
  maxTokenId: string;
  gatingType: number;
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

const getBuildMessage =
  (config: DappConfig) =>
  (condition: Condition, tokenInfo: TokenInfo): JSX.Element => {
    const {
      method,
      tokenType,
      minTokenId: tokenId,
      tokenAddress,
      threshold
    } = condition;

    if (tokenType === TokenType.FungibleToken) {
      return (
        <>
          {tokenInfo.convertedValue.price} {tokenInfo.symbol} tokens (
          <a
            href={config.envConfig.getTxExplorerUrl?.(tokenAddress, true)}
            target="_blank"
          >
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
              href={config.envConfig.getTxExplorerUrl?.(tokenAddress, true)}
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
              href={config.envConfig.getTxExplorerUrl?.(tokenAddress, true)}
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
          <a
            href={config.envConfig.getTxExplorerUrl?.(tokenAddress, true)}
            target="_blank"
          >
            {tokenAddress.slice(0, 10)}...
          </a>
        </>
      );
    }
    return <></>;
  };

const TokenGated = ({
  offer,
  commitProxyAddress,
  openseaLinkToOriginalMainnetCollection,
  isConditionMet,
  style
}: Props) => {
  const { config } = useConfigContext();
  const buildMessage = getBuildMessage(config);
  const { condition } = offer;
  const core = useCoreSDK();
  const [tokenInfo, setTokenInfo] = useState({
    name: "",
    decimals: "18",
    symbol: ""
  });

  const sellerAvatar: string | undefined = useMemo(
    () =>
      (offer?.metadata?.productV1Seller?.images || []).find(
        (img) => img.tag === "profile"
      )?.url,
    [offer?.metadata?.productV1Seller?.images]
  );

  useEffect(() => {
    (async () => {
      if (condition?.tokenAddress && condition?.tokenType === 0) {
        try {
          const result = await core.getExchangeTokenInfo(
            condition.tokenAddress
          );
          const { name = "", decimals, symbol = "" } = result;
          setTokenInfo({ name, decimals: decimals?.toString() ?? "", symbol });
        } catch (error) {
          setTokenInfo({ name: "", decimals: "", symbol: "" });
        }
      }
    })();
  }, [condition, core]);

  const convertedValue = useConvertedPrice({
    value: condition?.threshold || "",
    decimals: tokenInfo?.decimals || "18",
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
          <TokenIcon $conditionMet={isConditionMet}>
            {sellerAvatar && <Image src={sellerAvatar} />}
          </TokenIcon>
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
                  href={sanitizeUrl(openseaLinkToOriginalMainnetCollection)}
                  target="_blank"
                  rel="noopener noreferrer"
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

  position: relative;
  overflow: hidden;
  > div {
    position: absolute;
    top: 50%;
    left: 50%;
    padding-top: 0;
    height: 100%;
    width: 100%;
    transform: translate(-50%, -50%);
    background: ${colors.white};
    > img {
      position: relative;
      top: 0;
      left: 0;
      transform: none;
    }
  }
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
  word-break: break-word;
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
