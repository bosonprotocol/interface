import { BigNumber } from "ethers";

import { optionUnitKeys } from "./const";

export const getFixedOrPercentageVal = (
  price: BigNumber,
  value: string,
  unit: keyof typeof optionUnitKeys
) => {
  const isPercentage = unit === optionUnitKeys["%"];
  if (isPercentage) {
    return price
      .mul(Math.round(parseFloat(value || "0") * 1000))
      .div(100 * 1000);
  }
  const isFixed = unit === optionUnitKeys["fixed"];
  if (isFixed) {
    return value;
  }
  throw new Error(`unit=${unit} not implemented`);
};
