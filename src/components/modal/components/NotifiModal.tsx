import "@notifi-network/notifi-react-card/dist/index.css";

import {
  NotifiContext,
  NotifiInputFieldsText,
  NotifiInputSeparators,
  NotifiSubscriptionCard
} from "@notifi-network/notifi-react-card";
import { arrayify } from "ethers/lib/utils";
import { useAccount, useSigner } from "wagmi";

export default function NotifiModal() {
  const { data: signer } = useSigner();
  const { address } = useAccount();

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

  const notifiConfig = {
    // dappId: "junitest.xyz",
    dappId: "testludobosondapp",
    // cardId: "db7bdfd7b72d427ea2c8840785cfa0b4"
    cardId: "f94c8ab903d849e2b70204c4357372cc"
  };

  const xmtpInputs = {
    XMTPTopics: ["xmtp-topic"]
  };

  return (
    <>
      {signer && address && (
        <NotifiContext
          dappAddress={notifiConfig.dappId}
          env="Development"
          signMessage={async (message: Uint8Array) => {
            const result = await signer.signMessage(message);
            return arrayify(result);
          }}
          walletPublicKey={address}
          walletBlockchain="ETHEREUM" // NOTE - Please update to the correct chain name.
          //If Polygon, use "POLYGON"
          //If Arbitrum, use "ARBITRUM"
          //If Binance, use "BINANCE"
          //If Optimism, use OPTIMISM
        >
          <NotifiSubscriptionCard
            cardId={notifiConfig.cardId}
            inputLabels={inputLabels}
            inputSeparators={inputSeparators}
            darkMode //optional
            inputs={xmtpInputs}
          />
        </NotifiContext>
      )}
    </>
  );
}
