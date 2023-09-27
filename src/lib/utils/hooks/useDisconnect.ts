import { useWeb3React } from "@web3-react/core";
import { useCallback } from "react";
import { useAppDispatch } from "state/hooks";
import { updateSelectedWallet } from "state/user/reducer";

export const useDisconnect = () => {
  const { connector } = useWeb3React();

  const dispatch = useAppDispatch();

  return useCallback(async () => {
    if (connector && connector.deactivate) {
      await connector.deactivate();
    }
    await connector.resetState();
    dispatch(updateSelectedWallet({ wallet: undefined }));
  }, [connector, dispatch]);
};
