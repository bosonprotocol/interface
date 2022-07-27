/* eslint @typescript-eslint/no-explicit-any: "off" */
export const checkIfValueIsEmpty = (v: any) =>
  v == null ||
  (Object.prototype.hasOwnProperty.call(v, "length") && v.length === 0) ||
  (v.constructor === Object && Object.keys(v).length === 0);
