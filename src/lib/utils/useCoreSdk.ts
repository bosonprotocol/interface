import { useCoreSDKContext } from "components/core-sdk/CoreSDKContext";

export const useCoreSDK = () => {
  const coreSDK = useCoreSDKContext();

  return coreSDK;
};
