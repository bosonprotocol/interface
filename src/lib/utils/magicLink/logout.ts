import { SetUser } from "components/magicLink/UserContext";
import type { SetWeb3 } from "components/magicLink/Web3Context";
import { getProvider } from "lib/utils/magicLink/provider";
import { Magic } from "magic-sdk";

// When a user logs out, disconnect with Magic & re-set web3 provider
export const getMagicLogout =
  (magic: Magic | undefined | null) =>
  async (setWeb3: SetWeb3, setUser: SetUser) => {
    if (!magic) {
      return;
    }
    // TODO: localStorage.removeItem("user");
    await magic.wallet.disconnect();
    const provider = await getProvider(magic);
    setWeb3(provider);
    setUser(undefined);
    // console.log("Successfully disconnected"); // TODO: remove
  };
