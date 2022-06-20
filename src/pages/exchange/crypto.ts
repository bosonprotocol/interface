// import etht from '@metamask/eth-sig-util'
import * as sigUtil from "@metamask/eth-sig-util";
import * as ethUtil from "ethereumjs-util";
import { providers } from "ethers";

export const encryptData = (publicKey: string, text: string) => {
  const result = sigUtil.encrypt({
    publicKey,
    data: text,
    // https://github.com/MetaMask/eth-sig-util/blob/v4.0.0/src/encryption.ts#L40
    version: "x25519-xsalsa20-poly1305"
  });

  // https://docs.metamask.io/guide/rpc-api.html#other-rpc-methods
  return ethUtil.bufferToHex(Buffer.from(JSON.stringify(result), "utf8"));
};

export const decryptData = async (
  web3: providers.Web3Provider,
  account: string,
  text: string
) => {
  const result = await web3.send("eth_decrypt", [text, account]);
  return result;
};
