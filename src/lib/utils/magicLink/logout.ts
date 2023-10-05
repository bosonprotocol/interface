import { SetUser } from "components/magicLink/UserContext";
import { Magic } from "magic-sdk";

// When a user logs out, disconnect with Magic & re-set web3 provider
export const getMagicLogout =
  (magic: Magic | undefined | null) => async (setUser: SetUser) => {
    if (!magic) {
      return;
    }
    localStorage.removeItem("user");
    await magic.wallet.disconnect();
    setUser(undefined);
  };
