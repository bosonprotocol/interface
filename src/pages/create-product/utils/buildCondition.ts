import {
  ConditionStruct,
  EvaluationMethod,
  TokenType
} from "@bosonprotocol/common";

export const buildCondition = (commonTermsOfSale: any): ConditionStruct => {
  let tokenType: TokenType = TokenType.FungibleToken;
  let method: EvaluationMethod = EvaluationMethod.None;
  let threshold;

  switch (commonTermsOfSale.tokenType) {
    case "erc1155":
      tokenType = TokenType.MultiToken;
      method = EvaluationMethod.Threshold;
      threshold = commonTermsOfSale.minBalance;
      break;
    case "erc721":
      tokenType = TokenType.NonFungibleToken;
      if (commonTermsOfSale.tokenCriteria === "tokenid") {
        method = EvaluationMethod.SpecificToken;
        // if erc721 and SpecificToken we should set the threshold as zero
        threshold = "0";
      } else {
        method = EvaluationMethod.Threshold;
        threshold = commonTermsOfSale.minBalance;
      }
      break;
    default:
      tokenType = TokenType.FungibleToken;
      method = EvaluationMethod.Threshold;
      threshold = commonTermsOfSale.minBalance;
      break;
  }
  return {
    method,
    tokenType,
    tokenAddress: commonTermsOfSale.tokenContract,
    tokenId: commonTermsOfSale.tokenId,
    threshold,
    maxCommits: "1"
  };
};
