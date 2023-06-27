import "@notifi-network/notifi-react-card/dist/index.css";

import {
  NotifiContext,
  NotifiInputFieldsText,
  NotifiInputSeparators,
  NotifiSubscriptionCard
} from "@notifi-network/notifi-react-card";
import { Signer } from "ethers";
import { arrayify } from "ethers/lib/utils";

import { NotifiConfig } from "../../../lib/utils/hooks/chat/useNotifi";

// export type ChainName =
//   | "ETHEREUM"
//   | "POLYGON"
//   | "ARBITRUM"
//   | "AVALANCHE"
//   | "BINANCE"
//   | "OPTIMISM";

// export type NotifiConfig = {
//   dappId: string;
//   cardId: string;
//   chain: ChainName;
// };

export default function NotifiModal({
  signer,
  address,
  topics,
  notifiConfig
}: {
  signer?: Signer | null;
  address?: string;
  topics?: string[] | null;
  notifiConfig: NotifiConfig | null;
}) {
  const inputLabels: NotifiInputFieldsText = {
    label: {
      email: "Email",
      sms: "Text Message",
      telegram: "Telegram"
    },
    placeholderText: {
      email: "Email"
    }
  };

  const inputSeparators: NotifiInputSeparators = {
    // smsSeparator: {
    //   content: "OR"
    // },
    emailSeparator: {
      content: ""
    }
  };

  return (
    <>
      {signer && address && notifiConfig && (
        <NotifiContext
          dappAddress={notifiConfig.dappId}
          env="Development"
          signMessage={async (message: Uint8Array) => {
            const result = await signer.signMessage(message);
            return arrayify(result);
          }}
          walletPublicKey={address}
          walletBlockchain={notifiConfig.chain}
        >
          {topics ? (
            <NotifiSubscriptionCard
              cardId={notifiConfig.cardId}
              inputLabels={inputLabels}
              inputSeparators={inputSeparators}
              darkMode //optional
              inputs={{
                XMTPTopics: topics || []
              }}
            />
          ) : (
            <p>Fetching XMTP topics...</p>
          )}
        </NotifiContext>
      )}
    </>
  );
}
