import {
  AcceptProposalContent,
  MessageData,
  MessageType,
  ThreadId,
  version
} from "@bosonprotocol/chat-sdk/dist/esm/util/v0.0.1/definitions";
import { TransactionResponse } from "@bosonprotocol/common";
import { CoreSDK, subgraph } from "@bosonprotocol/react-kit";
import * as Sentry from "@sentry/browser";
import { useConfigContext } from "components/config/ConfigContext";
import { BigNumber, BigNumberish, utils } from "ethers";
import { Info as InfoComponent } from "phosphor-react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState
} from "react";
import toast from "react-hot-toast";
import styled from "styled-components";
import { useAccount } from "wagmi";

import { colors } from "../../../../lib/styles/colors";
import { useAddPendingTransaction } from "../../../../lib/utils/hooks/transactions/usePendingTransactions";
import { Exchange } from "../../../../lib/utils/hooks/useExchanges";
import { useCoreSDK } from "../../../../lib/utils/useCoreSdk";
import { useChatContext } from "../../../../pages/chat/ChatProvider/ChatContext";
import { ICON_KEYS } from "../../../../pages/chat/components/conversation/const";
import {
  MessageDataWithInfo,
  ProposalItem
} from "../../../../pages/chat/types";
import { poll } from "../../../../pages/create-product/utils";
import SimpleError from "../../../error/SimpleError";
import { useConvertedPrice } from "../../../price/useConvertedPrice";
import SuccessTransactionToast from "../../../toasts/SuccessTransactionToast";
import BosonButton from "../../../ui/BosonButton";
import Button from "../../../ui/Button";
import Grid from "../../../ui/Grid";
import { useModal } from "../../useModal";
import { DisputeSplit } from "./components/DisputeSplit";
import ExchangePreview from "./components/ExchangePreview";
import ProposalTypeSummary from "./components/ProposalTypeSummary";
import { PERCENTAGE_FACTOR } from "./const";

interface Props {
  exchange: Exchange;
  proposal: ProposalItem;
  iAmTheBuyer: boolean;
  setHasError: Dispatch<SetStateAction<boolean>>;
  addMessage: (
    newMessageOrList: MessageDataWithInfo | MessageDataWithInfo[]
  ) => Promise<void>;
  onSentMessage: (messageData: MessageData, uuid: string) => Promise<void>;
}

const ProposedSolution = styled.h4`
  font-size: 1.25rem;
  font-weight: 600;
`;

const Info = styled.div`
  padding: 1.5rem;
  background-color: ${colors.lightGrey};
  margin: 2rem 0;
  color: ${colors.darkGrey};
  display: flex;
  align-items: center;
`;

const InfoIcon = styled(InfoComponent)`
  margin-right: 1.1875rem;
`;

const ButtonsSection = styled.div`
  border-top: 2px solid ${colors.border};
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
`;

async function resolveDisputeWithMetaTx(
  coreSdk: CoreSDK,
  exchangeId: BigNumberish,
  buyerPercent: BigNumberish,
  counterpartySig: {
    r: string;
    s: string;
    v: number;
  }
): Promise<TransactionResponse> {
  const nonce = Date.now();
  const { r, s, v, functionName, functionSignature } =
    await coreSdk.signMetaTxResolveDispute({
      exchangeId,
      buyerPercent,
      counterpartySig,
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

export default function ResolveDisputeModal({
  exchange,
  proposal,
  iAmTheBuyer,
  addMessage,
  onSentMessage,
  setHasError
}: Props) {
  const { config } = useConfigContext();
  const { showModal, hideModal } = useModal();
  const { bosonXmtp } = useChatContext();
  const coreSDK = useCoreSDK();
  const addPendingTransaction = useAddPendingTransaction();
  const { address } = useAccount();
  const threadId = useMemo<ThreadId | null>(() => {
    if (!exchange) {
      return null;
    }
    return {
      exchangeId: exchange.id,
      buyerId: exchange.buyer.id,
      sellerId: exchange.seller.id
    };
  }, [exchange]);
  const [resolveDisputeError, setResolveDisputeError] = useState<Error | null>(
    null
  );
  const symbol = exchange.offer.exchangeToken.symbol;

  const inEscrow: string = BigNumber.from(exchange.offer.price)
    .add(BigNumber.from(exchange.offer.sellerDeposit || "0"))
    .toString();
  const fixedPercentageAmount: number =
    Number(proposal.percentageAmount) / PERCENTAGE_FACTOR;
  const refundBuyerWillReceive = Math.round(
    (Number(inEscrow) * Number(fixedPercentageAmount)) / 100
  ).toString();

  const refundBuyerWillReceivePrice = useConvertedPrice({
    value: refundBuyerWillReceive,
    decimals: exchange.offer.exchangeToken.decimals,
    symbol: symbol
  });
  const sellerWillReceive = BigNumber.from(inEscrow)
    .sub(refundBuyerWillReceive)
    .toString();
  const sellerWillReceivePrice = useConvertedPrice({
    value: sellerWillReceive.toString(),
    decimals: exchange.offer.exchangeToken.decimals,
    symbol: symbol
  });
  const destinationAddressLowerCase = iAmTheBuyer
    ? exchange?.offer.seller.assistant
    : exchange?.buyer.wallet;
  const destinationAddress = destinationAddressLowerCase
    ? utils.getAddress(destinationAddressLowerCase)
    : "";
  const handleSendingAcceptProposalMessage = useCallback(async () => {
    if (bosonXmtp && threadId && address) {
      try {
        setHasError(false);
        const content: AcceptProposalContent = {
          value: {
            icon: ICON_KEYS.checkCircle,
            title: iAmTheBuyer
              ? "Buyer accepted the refund proposal"
              : "Seller accepted the refund proposal",
            heading: "Dispute has been mutually resolved",
            body: "Your funds are now available for withdrawal",
            proposal
          }
        };
        const newMessage = {
          threadId,
          content,
          contentType: MessageType.AcceptProposal,
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
            "Something went wrong while sending an accept proposal message"
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
    bosonXmtp,
    threadId,
    address,
    setHasError,
    iAmTheBuyer,
    proposal,
    addMessage,
    destinationAddress,
    onSentMessage
  ]);
  return (
    <>
      <Grid justifyContent="space-between" padding="0 0 2rem 0">
        <ExchangePreview exchange={exchange} />
      </Grid>
      <ProposedSolution>Proposed solution</ProposedSolution>
      <div style={{ marginBottom: "3.44rem" }}>
        <ProposalTypeSummary exchange={exchange} proposal={proposal} />
      </div>
      <DisputeSplit exchange={exchange} proposal={proposal} />
      <Info>
        <InfoIcon />
        By accepting this proposal the dispute will be resolved and the buyer
        will be refunded {refundBuyerWillReceivePrice.price} {symbol}. The
        seller will receive {sellerWillReceivePrice.price} {symbol} for this
        exchange.
      </Info>
      {resolveDisputeError && <SimpleError />}
      <ButtonsSection>
        <BosonButton
          variant="primaryFill"
          onClick={async () => {
            try {
              setResolveDisputeError(null);
              const signature = utils.splitSignature(proposal.signature);
              let tx: TransactionResponse;
              showModal("WAITING_FOR_CONFIRMATION");
              await handleSendingAcceptProposalMessage();
              const isMetaTx = Boolean(coreSDK?.isMetaTxConfigSet && address);
              if (isMetaTx) {
                tx = await resolveDisputeWithMetaTx(
                  coreSDK,
                  exchange.id,
                  proposal.percentageAmount,
                  signature
                );
              } else {
                tx = await coreSDK.resolveDispute({
                  exchangeId: exchange.id,
                  buyerPercentBasisPoints: proposal.percentageAmount,
                  sigR: signature.r,
                  sigS: signature.s,
                  sigV: signature.v
                });
              }
              showModal("TRANSACTION_SUBMITTED", {
                action: "Raise dispute",
                txHash: tx.hash
              });
              addPendingTransaction({
                type: subgraph.EventType.DisputeRaised,
                hash: tx.hash,
                isMetaTx,
                accountType: "Buyer",
                exchange: {
                  id: exchange.id
                }
              });
              await tx.wait();
              await poll(
                async () => {
                  const resolvedDispute = await coreSDK.getDisputeById(
                    exchange.dispute?.id as BigNumberish
                  );
                  return resolvedDispute.resolvedDate;
                },
                (resolvedDate) => {
                  return !resolvedDate;
                },
                500
              );
              hideModal();
              toast((t) => (
                <SuccessTransactionToast
                  t={t}
                  action={`Raised dispute: ${exchange.offer.metadata.name}`}
                  url={config.envConfig.getTxExplorerUrl?.(tx.hash)}
                />
              ));
            } catch (error) {
              const hasUserRejectedTx =
                (error as unknown as { code: string }).code ===
                "ACTION_REJECTED";
              if (hasUserRejectedTx) {
                showModal("TRANSACTION_FAILED");
              } else {
                showModal("TRANSACTION_FAILED", {
                  errorMessage: "Something went wrong"
                });
              }
              setResolveDisputeError(error as Error);
            }
          }}
        >
          Accept proposal
        </BosonButton>
        <Button theme="blankOutline" onClick={() => hideModal()}>
          Back
        </Button>
      </ButtonsSection>
    </>
  );
}
