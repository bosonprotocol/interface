import {
  ConditionStruct,
  EvaluationMethod,
  TokenType
} from "@bosonprotocol/common";
import { utils } from "ethers";

import { TokenGating } from "../../../components/product/utils";

export type PartialTokenGating = Pick<
  TokenGating["tokenGating"],
  | "tokenId"
  | "minBalance"
  | "tokenType"
  | "tokenCriteria"
  | "tokenContract"
  | "maxCommits"
>;

export const buildCondition = (
  partialTokenGating: PartialTokenGating,
  decimals?: number
): ConditionStruct => {
  let tokenType: TokenType = TokenType.FungibleToken;
  let method: EvaluationMethod = EvaluationMethod.None;
  let threshold;
  let tokenId = partialTokenGating.tokenId || "0";

  let formatedValue = null;
  if (decimals && partialTokenGating.minBalance) {
    formatedValue = utils.parseUnits(partialTokenGating.minBalance, decimals);
  }

  switch (partialTokenGating.tokenType.value) {
    case "erc1155":
      tokenType = TokenType.MultiToken;
      method = EvaluationMethod.Threshold;
      threshold = partialTokenGating.minBalance;
      break;
    case "erc721":
      tokenType = TokenType.NonFungibleToken;
      if (partialTokenGating.tokenCriteria.value === "tokenid") {
        method = EvaluationMethod.SpecificToken;
        // if erc721 and SpecificToken we should set the threshold as zero
        threshold = "0";
      } else {
        method = EvaluationMethod.Threshold;
        threshold = partialTokenGating.minBalance;
        tokenId = "0";
      }
      break;
    default:
      tokenType = TokenType.FungibleToken;
      method = EvaluationMethod.Threshold;
      threshold = formatedValue || partialTokenGating.minBalance;
      break;
  }
  return {
    method,
    tokenType,
    tokenAddress: partialTokenGating.tokenContract || "",
    gatingType: 0, // default: PerAddress (legacy)
    minTokenId: tokenId,
    maxTokenId: tokenId,
    threshold: threshold || "",
    maxCommits: partialTokenGating.maxCommits || ""
  };
};
