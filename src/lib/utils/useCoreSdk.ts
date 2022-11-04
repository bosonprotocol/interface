import { useContext } from "react";

import { CoreSDKContext } from "../../components/CoreSDKProvider";

export function useCoreSDK() {
  const coreSdk = useContext(CoreSDKContext);
  return coreSdk;
}
