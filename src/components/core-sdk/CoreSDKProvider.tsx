import { ReactNode } from "react";

import { CoreSDKContext, useProviderCoreSDK } from "./CoreSDKContext";
import { ExtendedCoreSDK } from "./types";

interface Props {
  children: ReactNode;
}

export function CoreSDKProvider({ children }: Props) {
  const coreSDK = useProviderCoreSDK() as ExtendedCoreSDK;

  return (
    <CoreSDKContext.Provider value={coreSDK}>
      {children}
    </CoreSDKContext.Provider>
  );
}
