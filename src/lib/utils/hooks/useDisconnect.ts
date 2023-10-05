import { useWeb3React } from "@web3-react/core";
import { useUser } from "components/magicLink/UserContext";
import { useCallback } from "react";
import { useAppDispatch } from "state/hooks";
import { updateSelectedWallet } from "state/user/reducer";

import { getMagicLogout } from "../magicLink/logout";
import { useMagic, useWalletInfo } from "./magic";

export const useDisconnect = () => {
  const { connector } = useWeb3React();
  const { setUser } = useUser();
  const magic = useMagic();
  const { remove } = useWalletInfo();
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
