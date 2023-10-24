import {
  ConditionStruct,
  EvaluationMethod,
  GatingType,
  TokenType
} from "@bosonprotocol/common";
import { utils } from "ethers";

import {
  TokenCriteriaTokenRange,
  TokenGating
} from "../../../components/product/utils";

export type FullTokenGating = TokenGating["tokenGating"];

export const buildCondition = (
  tokenGating: FullTokenGating,
  decimals?: number
): ConditionStruct => {
  let tokenType: TokenType = TokenType.FungibleToken;
  let method: EvaluationMethod = EvaluationMethod.None;
  let threshold;
  let gatingType;
  let minTokenId;
  let maxTokenId;

  let formatedValue = null;
  if (decimals && tokenGating.minBalance) {
    formatedValue = utils.parseUnits(tokenGating.minBalance, decimals);
  }

  switch (tokenGating.tokenType.value) {
    case "erc1155":
      tokenType = TokenType.MultiToken;
      method = EvaluationMethod.Threshold;
      threshold = tokenGating.minBalance;
      minTokenId = tokenGating.minTokenId;
      maxTokenId = tokenGating.maxTokenId;
      gatingType = tokenGating.gatingType.gatingType;
      break;
    case "erc721":
      tokenType = TokenType.NonFungibleToken;
      gatingType = tokenGating.gatingType.gatingType;
      if (tokenGating.tokenCriteria.value === TokenCriteriaTokenRange.value) {
        method = EvaluationMethod.TokenRange;
        // if erc721 and TokenRange we should set the threshold as zero
        threshold = "0";
        minTokenId = tokenGating.minTokenId;
        maxTokenId = tokenGating.maxTokenId;
      } else {
        method = EvaluationMethod.Threshold;
        threshold = tokenGating.minBalance;
        minTokenId = "0";
        maxTokenId = "0";
      }
      break;
    default:
      tokenType = TokenType.FungibleToken;
      method = EvaluationMethod.Threshold;
      threshold = formatedValue || tokenGating.minBalance;
      minTokenId = "0";
      maxTokenId = "0";
      break;
  }
  return {
    method,
    tokenType,
    tokenAddress: tokenGating.tokenContract || "",
    gatingType: gatingType ?? GatingType.PerAddress,
    minTokenId: minTokenId ?? "0",
    maxTokenId: maxTokenId ?? "0",
    threshold: threshold || "",
    maxCommits: tokenGating.maxCommits || ""
  };
};
