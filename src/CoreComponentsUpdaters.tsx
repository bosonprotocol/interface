import { CommitWidgetReduxUpdaters, hooks } from "@bosonprotocol/react-kit";
import { useProvider } from "lib/utils/hooks/connection/connection";
import React from "react";

export const CoreComponentsUpdaters: React.FC = () => {
  const provider = useProvider();
  const isWindowVisible = hooks.useIsWindowVisible();
  return (
    <CommitWidgetReduxUpdaters
      isWindowVisible={isWindowVisible}
      provider={provider}
    />
  );
};
