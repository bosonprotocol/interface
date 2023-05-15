import {
  ConditionStruct,
  EvaluationMethod,
  TokenType
} from "@bosonprotocol/common";
import { utils } from "ethers";

import { CreateProductForm } from "../../../components/product/utils";

type JointTermsOfSale =
  | CreateProductForm["coreTermsOfSale"]
  | CreateProductForm["variantsCoreTermsOfSale"];

export type CommonTermsOfSale = Pick<
  JointTermsOfSale,
  | "tokenId"
  | "minBalance"
  | "tokenType"
  | "tokenCriteria"
  | "tokenContract"
  | "maxCommits"
>;

export const buildCondition = (
  commonTermsOfSale: CommonTermsOfSale,
  decimals?: number
): ConditionStruct => {
  let tokenType: TokenType = TokenType.FungibleToken;
  let method: EvaluationMethod = EvaluationMethod.None;
  let threshold;
  let tokenId = commonTermsOfSale.tokenId || "0";

  let formatedValue = null;
  if (decimals && commonTermsOfSale.minBalance) {
    formatedValue = utils.parseUnits(commonTermsOfSale.minBalance, decimals);
  }

  switch (commonTermsOfSale.tokenType.value) {
    case "erc1155":
      tokenType = TokenType.MultiToken;
      method = EvaluationMethod.Threshold;
      threshold = commonTermsOfSale.minBalance;
      break;
    case "erc721":
      tokenType = TokenType.NonFungibleToken;
      if (commonTermsOfSale.tokenCriteria.value === "tokenid") {
        method = EvaluationMethod.SpecificToken;
        // if erc721 and SpecificToken we should set the threshold as zero
        threshold = "0";
      } else {
        method = EvaluationMethod.Threshold;
        threshold = commonTermsOfSale.minBalance;
        tokenId = "0";
      }
      break;
    default:
      tokenType = TokenType.FungibleToken;
      method = EvaluationMethod.Threshold;
      threshold = formatedValue || commonTermsOfSale.minBalance;
      break;
  }
  return {
    method,
    tokenType,
    tokenAddress: commonTermsOfSale.tokenContract || "",
    tokenId,
    threshold: threshold || "",
    maxCommits: commonTermsOfSale.maxCommits || ""
  };
};
