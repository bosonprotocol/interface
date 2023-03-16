import { parseUnits } from "@ethersproject/units";
import { BigNumber } from "ethers";

import { fixformattedString } from "../../../lib/utils/number";
import { optionUnitKeys } from "./const";

export const getFixedOrPercentageVal = (
  price: BigNumber,
  fixedValue: string | number,
  unit: keyof typeof optionUnitKeys,
  decimals: number
): BigNumber => {
  const strValue =
    typeof fixedValue === "string" ? fixedValue : fixedValue.toString();
  const isPercentage = unit === optionUnitKeys["%"];
  if (isPercentage) {
    return price
      .mul(Math.round(parseFloat(strValue || "0") * 1000))
      .div(100 * 1000);
  }
  const isFixed = unit === optionUnitKeys["fixed"];
  if (isFixed) {
    return parseUnits(
      Number(strValue) < 0.1 ? fixformattedString(Number(strValue)) : strValue,
      decimals
    );
  }
  throw new Error(`unit=${unit} not implemented`);
};
