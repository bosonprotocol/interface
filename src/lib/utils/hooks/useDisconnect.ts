import { getMagicLogout, hooks, useUser } from "@bosonprotocol/react-kit";
import { useWeb3React } from "@web3-react/core";
import { useCallback } from "react";
import { useAppDispatch } from "state/hooks";
import { updateSelectedWallet } from "state/user/reducer";

export const useDisconnect = () => {
  const { connector } = useWeb3React();
  const { setUser } = useUser();
  const magic = hooks.useMagic();
  const { remove } = hooks.useWalletInfo();
  const magicLogout = getMagicLogout(magic);
  const dispatch = useAppDispatch();

  return useCallback(async () => {
    if (connector && connector.deactivate) {
      await connector.deactivate();
    }
    await connector.resetState();
    remove();
    dispatch(updateSelectedWallet({ wallet: undefined }));
    await magicLogout(setUser);
  }, [connector, dispatch, magicLogout, remove, setUser]);
};
