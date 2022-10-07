// import { TypedDataDomain } from "@ethersproject/abstract-signer";

import type { useSignTypedData } from "wagmi";

import { omit } from "./helpers";

type SignTypedDataAsync = ReturnType<
  typeof useSignTypedData
>["signTypedDataAsync"];

export const signedTypeData = (
  signTypedDataAsync: SignTypedDataAsync,
  // eslint-disable-next-line
  domain: any, //TypedDataDomain,
  // eslint-disable-next-line
  types: Record<string, any>,
  // eslint-disable-next-line
  value: Record<string, any>
) => {
  // remove the __typedname from the signature!
  return signTypedDataAsync({
    domain: omit(domain, "__typename"),
    types: omit(types, "__typename"),
    value: omit(value, "__typename")
  });
};
