import { useWeb3React } from "@web3-react/core";
import { useCallback } from "react";
import { useAppDispatch } from "state/hooks";
import { updateSelectedWallet } from "state/user/reducer";

export const useDisconnect = () => {
  const { connector } = useWeb3React();

  const dispatch = useAppDispatch();

  return useCallback(() => {
    if (connector && connector.deactivate) {
      connector.deactivate();
    }
    connector.resetState();
    dispatch(updateSelectedWallet({ wallet: undefined }));
  }, [connector, dispatch]);
};
