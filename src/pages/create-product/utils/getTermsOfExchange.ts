import { parseUnits } from "@ethersproject/units";
import { optionUnitKeys, TermsOfExchange } from "components/product/utils";
import { getFixedOrPercentageVal } from "components/product/utils/termsOfExchange";
import { fixformattedString } from "lib/utils/number";

export function getTermsOfExchange({
  termsOfExchange,
  price,
  decimals
}: {
  termsOfExchange: TermsOfExchange["termsOfExchange"];
  price: number;
  decimals: number;
}) {
  const priceBN = parseUnits(
    price < 0.1 ? fixformattedString(price) : price.toString(),
    decimals
  );

  const buyerCancellationPenaltyValue = getFixedOrPercentageVal(
    priceBN,
    termsOfExchange.buyerCancellationPenalty,
    termsOfExchange.buyerCancellationPenaltyUnit
      .value as keyof typeof optionUnitKeys,
    decimals
  );

  const sellerDeposit = getFixedOrPercentageVal(
    priceBN,
    termsOfExchange.sellerDeposit,
    termsOfExchange.sellerDepositUnit.value as keyof typeof optionUnitKeys,
    decimals
  );
  return {
    priceBN,
    buyerCancellationPenaltyValue,
    sellerDeposit
  };
}
