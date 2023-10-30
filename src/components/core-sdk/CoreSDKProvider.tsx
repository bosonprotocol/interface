import { ReactNode } from "react";

import { CoreSDKContext, useProviderCoreSDK } from "./CoreSDKContext";
import { ExtendedCoreSDK } from "./types";

interface Props {
  children: ReactNode;
}

export function CoreSDKProvider({ children }: Props) {
  const coreSDK = useProviderCoreSDK() as ExtendedCoreSDK;

  if (!coreSDK.uuid) {
    coreSDK.uuid = crypto.randomUUID();
  }
  return (
    <CoreSDKContext.Provider value={coreSDK}>
      {children}
    </CoreSDKContext.Provider>
  );
}
