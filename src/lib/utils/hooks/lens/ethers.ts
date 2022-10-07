// import { TypedDataDomain } from "@ethersproject/abstract-signer";

import type { useSignTypedData } from "wagmi";

import { omit } from "./helpers";

type SignTypedDataAsync = ReturnType<
  typeof useSignTypedData
>["signTypedDataAsync"];

export const signedTypeData = (
  signTypedDataAsync: SignTypedDataAsync,
  domain: any, //TypedDataDomain,
  types: Record<string, any>,
  value: Record<string, any>
) => {
  // remove the __typedname from the signature!
  return signTypedDataAsync({
    domain: omit(domain, "__typename"),
    types: omit(types, "__typename"),
    value: omit(value, "__typename")
  });
};
