import { BigNumber, utils } from "ethers";

export const calcPrice = (value: string, decimals: string) => {
  try {
    return utils.formatUnits(BigNumber.from(value), Number(decimals));
  } catch (e) {
    console.error(e);
    return "";
  }
};
