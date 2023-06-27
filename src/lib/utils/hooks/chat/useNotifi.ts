import { CONFIG } from "../../../config";

export type ChainName =
  | "ETHEREUM"
  | "POLYGON"
  | "ARBITRUM"
  | "AVALANCHE"
  | "BINANCE"
  | "OPTIMISM";

export type NotifiConfig = {
  dappId: string;
  cardId: string;
  chain: ChainName;
};

export function getNotifiConfig(): NotifiConfig | null {
  try {
    const notifiConfig = JSON.parse(CONFIG.XMTP_NOTIFI || "{}") as NotifiConfig;
    if (notifiConfig.dappId && notifiConfig.cardId && notifiConfig.chain) {
      return notifiConfig;
    }
  } catch (e) {
    console.error(
      `Error when parsing CONFIG.XMTP_NOTIFI: '${CONFIG.XMTP_NOTIFI}'. ${e}`
    );
  }
  return null;
}
