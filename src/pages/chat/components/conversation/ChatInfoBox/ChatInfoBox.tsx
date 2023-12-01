import { MessageData } from "@bosonprotocol/chat-sdk/dist/esm/util/v0.0.1/definitions";
import { subgraph } from "@bosonprotocol/react-kit";

import { getExchangeDisputeDates } from "../../../../../lib/utils/exchange";
import { DaysLeftToResolve } from "./DaysLeftToResolve";
import { DrHasDecided } from "./DrHasDecided";
import { ProposalButtons, ProposalButtonsProps } from "./ProposalButtons";
import { YouHaveAccepted } from "./YouHaveAccepted";

export type ChatInfoBoxProps = Omit<ProposalButtonsProps, "proposal"> & {
  showProposal: boolean;
  proposal: MessageData | null;
  acceptedProposal: MessageData | null;
  dispute: subgraph.DisputeFieldsFragment | undefined;
};

export const ChatInfoBox: React.FC<ChatInfoBoxProps> = ({
  addMessage,
  exchange,
  dispute,
  iAmTheBuyer,
  onSentMessage,
  proposal,
  sendProposal,
  setHasError,
  showProposal,
  acceptedProposal
}) => {
  const isInDispute = exchange.disputed && !dispute?.finalizedDate;
  const isResolved = !!dispute?.resolvedDate;
  const isEscalated = !!dispute?.escalatedDate;
  const isRetracted = !!dispute?.retractedDate;
  const isDecided = dispute?.state === subgraph.DisputeState.Decided;

  const buyerPercent = dispute?.buyerPercent;
  const { daysLeftToResolveDispute, totalDaysToResolveDispute } =
    getExchangeDisputeDates(exchange);
  const lessThanHalfDaysToResolve =
    daysLeftToResolveDispute / totalDaysToResolveDispute < 0.5;

  return (
    <>
      {lessThanHalfDaysToResolve &&
      isInDispute &&
      iAmTheBuyer &&
      !isEscalated ? (
        <DaysLeftToResolve
          daysLeftToResolveDispute={daysLeftToResolveDispute}
          exchange={exchange}
          proposal={proposal}
          sendProposal={sendProposal}
          onSentMessage={onSentMessage}
          setHasError={setHasError}
          addMessage={addMessage}
        />
      ) : isInDispute &&
        !isEscalated &&
        !isRetracted &&
        !!proposal &&
        showProposal ? (
        <ProposalButtons
          exchange={exchange}
          proposal={proposal}
          sendProposal={sendProposal}
          iAmTheBuyer={iAmTheBuyer}
          onSentMessage={onSentMessage}
          setHasError={setHasError}
          addMessage={addMessage}
        />
      ) : isResolved && acceptedProposal && buyerPercent ? (
        <YouHaveAccepted
          iAmTheBuyer={iAmTheBuyer}
          acceptedProposal={acceptedProposal}
          buyerPercent={buyerPercent}
          exchange={exchange}
          proposal={proposal}
        />
      ) : isDecided && buyerPercent ? (
        <DrHasDecided
          buyerPercent={buyerPercent}
          exchange={exchange}
          proposal={proposal}
        />
      ) : (
        <></>
      )}
    </>
  );
};
