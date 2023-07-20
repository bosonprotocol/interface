import { MessageData } from "@bosonprotocol/chat-sdk/dist/esm/util/v0.0.1/definitions";
import { subgraph } from "@bosonprotocol/react-kit";

import { useDisputes } from "../../../../../lib/utils/hooks/useDisputes";
import { DrHasDecided } from "./DrHasDecided";
import { ProposalButtons, ProposalButtonsProps } from "./ProposalButtons";
import { YouHaveAccepted } from "./YouHaveAccepted";

export type ChatInfoBoxProps = Omit<ProposalButtonsProps, "proposal"> & {
  showProposal: boolean;
  proposal: MessageData | null;
  acceptedProposal: MessageData | null;
};

export const ChatInfoBox: React.FC<ChatInfoBoxProps> = ({
  addMessage,
  exchange,
  iAmTheBuyer,
  onSentMessage,
  proposal,
  sendProposal,
  setHasError,
  showProposal,
  acceptedProposal
}) => {
  const { data: disputes } = useDisputes(
    {
      disputesFilter: {
        exchange: exchange?.id
      }
    },
    { enabled: !!exchange?.id }
  );
  const dispute = disputes?.[0];

  const isInDispute = exchange.disputed && !dispute?.finalizedDate;
  const isResolved = !!dispute?.resolvedDate;
  const isDecided = dispute?.state === subgraph.DisputeState.Decided;

  const buyerPercent = dispute?.buyerPercent;

  return (
    <>
      {isInDispute && !!proposal && showProposal ? (
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
