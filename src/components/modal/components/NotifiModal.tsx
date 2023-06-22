import "@notifi-network/notifi-react-card/dist/index.css";

import {
  NotifiContext,
  NotifiInputFieldsText,
  NotifiInputSeparators,
  NotifiSubscriptionCard
} from "@notifi-network/notifi-react-card";
import { useNotifiClient } from "@notifi-network/notifi-react-hooks";
import { arrayify } from "ethers/lib/utils";
import { useMemo, useState } from "react";
import { useAccount, useSigner } from "wagmi";

import { useChatContext } from "../../../pages/chat/ChatProvider/ChatContext";

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
    // dappId: "testludobosondapp",
    dappId: "junitest.xyz",
    // cardId: "db7bdfd7b72d427ea2c8840785cfa0b4"
    cardId: "f94c8ab903d849e2b70204c4357372cc"
  };

  const { bosonXmtp } = useChatContext();
  const [areTopicsReady, setAreTopicsReady] = useState<boolean>(false);

  const notifiClient = useNotifiClient({
    dappAddress: notifiConfig.dappId,
    env: "Development",
    walletPublicKey: address as string,
    walletBlockchain: "ETHEREUM"
  });

  const alreadyRegisteredTopics = useMemo(() => {
    const sourceTopics = notifiClient.data?.alerts
      ?.find(
        (alert: { filter?: { filterType?: string } }) =>
          alert.filter?.filterType === "WEB3_CHAT_MESSAGES"
      )
      ?.sourceGroup?.sources?.filter(
        (source: unknown) => (source as { type?: string }).type === "XMTP"
      )
      ?.map(
        (source: unknown) => (source as { name?: string }).name
      ) as string[];
    return sourceTopics || [];
  }, [notifiClient]);

  const topicDatas = useMemo(() => {
    if (bosonXmtp) {
      bosonXmtp.getConversations().then((convos) => {
        const newTopicDatas = convos
          .map((convo) => {
            return { topic: convo.topic, peerAddress: convo.peerAddress };
          })
          .filter(
            (topicData) => !alreadyRegisteredTopics.includes(topicData.topic)
          );
        setAreTopicsReady(true);
        return newTopicDatas;
      });
    } else {
      console.log("topics are not ready");
      setAreTopicsReady(false);
      return [];
    }
  }, [bosonXmtp, alreadyRegisteredTopics]);

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
          {areTopicsReady ? (
            <NotifiSubscriptionCard
              cardId={notifiConfig.cardId}
              inputLabels={inputLabels}
              inputSeparators={inputSeparators}
              darkMode //optional
              inputs={{
                XMTPTopics:
                  topicDatas?.map(
                    (topicData: { topic: string; peerAddress: string }) =>
                      topicData.topic
                  ) || []
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
