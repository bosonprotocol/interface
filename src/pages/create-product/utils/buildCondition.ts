import {
  ConditionStruct,
  EvaluationMethod,
  TokenType
} from "@bosonprotocol/common";
import { utils } from "ethers";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const buildCondition = (
  commonTermsOfSale: any,
  decimals?: number
): ConditionStruct => {
  console.log(
    "🚀  roberto --  ~ file: buildCondition.ts ~ line 13 ~ decimals",
    decimals
  );
  console.log(
    "🚀  roberto --  ~ file: buildCondition.ts ~ line 10 ~ buildCondition ~ commonTermsOfSale",
    commonTermsOfSale
  );

  let tokenType: TokenType = TokenType.FungibleToken;
  let method: EvaluationMethod = EvaluationMethod.None;
  let threshold;
  let tokenId = commonTermsOfSale.tokenId || "0";

  let formatedValue = undefined;
  if (decimals) {
    formatedValue = utils.parseUnits(commonTermsOfSale.minBalance, decimals);
  }
  console.log(
    "🚀  roberto --  ~ file: buildCondition.ts ~ line 28 ~ formatedValue",
    formatedValue
  );

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
    tokenAddress: commonTermsOfSale.tokenContract,
    tokenId,
    threshold,
    maxCommits: commonTermsOfSale.maxCommits
  };
};
