import {
  MessageData,
  MessageType,
  ThreadId,
  version
} from "@bosonprotocol/chat-sdk/dist/esm/util/v0.0.1/definitions";
import { TransactionResponse } from "@bosonprotocol/common";
import { CoreSDK, subgraph } from "@bosonprotocol/react-kit";
import * as Sentry from "@sentry/browser";
import { useConfigContext } from "components/config/ConfigContext";
import { BigNumberish } from "ethers";
import { useAccount } from "lib/utils/hooks/connection/connection";
import { poll } from "lib/utils/promises";
import {
  sendAndAddMessageToUI,
  sendErrorMessageIfTxFails
} from "pages/chat/utils/send";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import toast from "react-hot-toast";

import {
  ChatInitializationStatus,
  useChatStatus
} from "../../../lib/utils/hooks/chat/useChatStatus";
import { useAddPendingTransaction } from "../../../lib/utils/hooks/transactions/usePendingTransactions";
import { Exchange } from "../../../lib/utils/hooks/useExchanges";
import { useCoreSDK } from "../../../lib/utils/useCoreSdk";
import { useChatContext } from "../../../pages/chat/ChatProvider/ChatContext";
import {
  ICON_KEYS,
  StringIconTypes
} from "../../../pages/chat/components/conversation/const";
import { MessageDataWithInfo } from "../../../pages/chat/types";
import SimpleError from "../../error/SimpleError";
import SuccessTransactionToast from "../../toasts/SuccessTransactionToast";
import BosonButton from "../../ui/BosonButton";
import Grid from "../../ui/Grid";
import Typography from "../../ui/Typography";
import { ModalProps } from "../ModalContext";
import { useModal } from "../useModal";
import ExchangePreview from "./Chat/components/ExchangePreview";
import InitializeChatWithSuccess from "./Chat/components/InitializeChatWithSuccess";

interface Props {
  hideModal: NonNullable<ModalProps["hideModal"]>;
  exchangeId: string;
  offerName: string;
  disputeId: string;
  refetch: () => void;
  setHasError: Dispatch<SetStateAction<boolean>>;
  addMessage: (
    newMessageOrList: MessageDataWithInfo | MessageDataWithInfo[]
  ) => Promise<void>;
  onSentMessage: (messageData: MessageData, uuid: string) => Promise<void>;
  destinationAddress: string;
  threadId: ThreadId | null;
  exchange: Exchange;
}

async function retractDisputeWithMetaTx(
  coreSdk: CoreSDK,
  exchangeId: BigNumberish
): Promise<TransactionResponse> {
  const nonce = Date.now();
  const { r, s, v, functionName, functionSignature } =
    await coreSdk.signMetaTxRetractDispute({
      exchangeId,
      nonce
    });
  return coreSdk.relayMetaTransaction({
    functionName,
    functionSignature,
    sigR: r,
    sigS: s,
    sigV: v,
    nonce
  });
}

export default function RetractDisputeModal({
  hideModal,
  exchangeId,
  offerName,
  disputeId,
  refetch,
  addMessage,
  setHasError,
  threadId,
  onSentMessage,
  destinationAddress,
  exchange
}: Props) {
  const { config } = useConfigContext();
  const { bosonXmtp } = useChatContext();
  const { chatInitializationStatus } = useChatStatus();
  const coreSDK = useCoreSDK();
  const addPendingTransaction = useAddPendingTransaction();
  const { showModal } = useModal();
  const { account: address } = useAccount();
  const [retractDisputeError, setRetractDisputeError] = useState<Error | null>(
    null
  );
  const handleSendingRetractMessage = useCallback(async () => {
    if (bosonXmtp && threadId && address) {
      try {
        setHasError(false);
        const newMessage = {
          threadId,
          content: {
            value: {
              icon: ICON_KEYS.info,
              heading: "Buyer has retracted the dispute",
              body: "The dispute has been cancelled and the exchange will execute as originally intended.",
              type: StringIconTypes.RETRACT
            }
          },
          contentType: MessageType.StringIcon,
          version
        } as const;
        const uuid = window.crypto.randomUUID();

        await addMessage({
          authorityId: "",
          timestamp: Date.now(),
          sender: address,
          recipient: destinationAddress,
          data: newMessage,
          isValid: false,
          isPending: true,
          uuid
        });

        const messageData = await bosonXmtp.encodeAndSendMessage(
          newMessage,
          destinationAddress
        );
        if (!messageData) {
          throw new Error(
            "Something went wrong while sending a retract message"
          );
        }
        onSentMessage(messageData, uuid);
      } catch (error) {
        console.error(error);
        setHasError(true);
        Sentry.captureException(error, {
          extra: {
            ...threadId,
            destinationAddress,
            action: "handleSendingRetractMessage",
            location: "RetractDisputeModal"
          }
        });
      }
    }
  }, [
    addMessage,
    address,
    bosonXmtp,
    destinationAddress,
    onSentMessage,
    threadId,
    setHasError
  ]);
  const showSuccessInitialization =
    [
      ChatInitializationStatus.INITIALIZED,
      ChatInitializationStatus.ALREADY_INITIALIZED
    ].includes(chatInitializationStatus) && bosonXmtp;

  return (
    <Grid flexDirection="column" gap="5rem">
      <Grid flexDirection="column" alignItems="flex-start">
        <Grid marginTop="2rem" marginBottom="2rem">
          <ExchangePreview exchange={exchange} />
        </Grid>
        <Typography fontWeight="600">What is Retract?</Typography>
        <Typography>
          By retracting you cancel the dispute and the exchange is executed as
          originally intended.
        </Typography>
        {retractDisputeError && <SimpleError />}
      </Grid>
      <InitializeChatWithSuccess />
      <Grid justifyContent="space-between">
        <BosonButton
          variant="primaryFill"
          disabled={!showSuccessInitialization}
          onClick={async () => {
            try {
              await handleSendingRetractMessage();
              setRetractDisputeError(null);
              let tx: TransactionResponse | undefined = undefined;
              showModal("WAITING_FOR_CONFIRMATION");
              const isMetaTx = Boolean(coreSDK?.isMetaTxConfigSet && address);

              await sendErrorMessageIfTxFails({
                sendsTxFn: async () => {
                  if (isMetaTx) {
                    tx = await retractDisputeWithMetaTx(coreSDK, exchangeId);
                  } else {
                    tx = await coreSDK.retractDispute(exchangeId);
                  }
                },
                fnAddMessageFn: async (errorMessageObj) => {
                  bosonXmtp &&
                    address &&
                    (await sendAndAddMessageToUI({
                      bosonXmtp,
                      addMessage,
                      onSentMessage,
                      address,
                      destinationAddress,
                      newMessage: errorMessageObj
                    }));
                },
                errorMessage: "Retract dispute transaction failed",
                threadId
              });
              if (!tx) {
                return;
              }
              tx = tx as TransactionResponse;
              showModal("TRANSACTION_SUBMITTED", {
                action: "Retract dispute",
                txHash: tx.hash
              });
              addPendingTransaction({
                type: subgraph.EventType.DisputeRetracted,
                hash: tx.hash,
                isMetaTx,
                accountType: "Buyer",
                exchange: {
                  id: exchangeId
                }
              });
              await tx.wait();
              await poll(
                async () => {
                  const retractedDispute = await coreSDK.getDisputeById(
                    disputeId
                  );
                  return retractedDispute.retractedDate;
                },
                (retractedDate) => {
                  return !retractedDate;
                },
                500
              );
              toast((t) => (
                <SuccessTransactionToast
                  t={t}
                  action={`Retracted dispute: ${offerName}`}
                  url={config.envConfig.getTxExplorerUrl?.(tx?.hash)}
                />
              ));
              hideModal();
              refetch();
            } catch (error) {
              console.error(error);
              const hasUserRejectedTx =
                (error as unknown as { code: string }).code ===
                "ACTION_REJECTED";
              if (hasUserRejectedTx) {
                showModal("TRANSACTION_FAILED");
              } else {
                Sentry.captureException(error);
                showModal("TRANSACTION_FAILED", {
                  errorMessage: "Something went wrong"
                });
              }
              setRetractDisputeError(error as Error);
            }
          }}
        >
          Confirm Retract
        </BosonButton>
      </Grid>
    </Grid>
  );
}
