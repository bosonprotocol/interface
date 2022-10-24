/**
 * Given a small number, it returns its string representation without the scientific 'e' notation.
 * For example:
 *      1e-112 => 1e-112 (too small to change)
 *      1e-7   => 0.0000001
 *      0.0001 => 0.0001
 *      9e+99  => 9e+99
 * @param num
 * @returns
 */
export const fixformattedString = (num: number): string => {
  const numStr = num + "";
  const indexEMinus = numStr.lastIndexOf("e-");
  if (numStr.includes(".") || indexEMinus === -1 || num < 1e-100) {
    return numStr;
  }
  // small number with scientific notation
  const decimals = Math.min(100, Number(numStr.substring(indexEMinus + 2)));
  return num.toFixed(decimals);
};
