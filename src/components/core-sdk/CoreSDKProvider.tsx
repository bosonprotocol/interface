import { ReactNode } from "react";

import { CoreSDKContext, useProviderCoreSDK } from "./CoreSDKContext";

interface Props {
  children: ReactNode;
}

export function CoreSDKProvider({ children }: Props) {
  const coreSDK = useProviderCoreSDK();
  return (
    <CoreSDKContext.Provider value={coreSDK}>
      {children}
    </CoreSDKContext.Provider>
  );
}
