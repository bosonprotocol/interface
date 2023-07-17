import {
  AcceptProposalContent,
  MessageData
} from "@bosonprotocol/chat-sdk/dist/esm/util/v0.0.1/definitions";
import { subgraph } from "@bosonprotocol/react-kit";
import { Info } from "phosphor-react";

import { PERCENTAGE_FACTOR } from "../../../../components/modal/components/Chat/const";
import Grid from "../../../../components/ui/Grid";
import Typography from "../../../../components/ui/Typography";
import { colors } from "../../../../lib/styles/colors";
import { useDisputes } from "../../../../lib/utils/hooks/useDisputes";
import { ProposalButtons, ProposalButtonsProps } from "./ProposalButtons";

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

  const isInRedeemed = subgraph.ExchangeState.Redeemed === exchange.state;
  const isInDispute = exchange.disputed && !dispute?.finalizedDate;
  const isResolved = !!dispute?.resolvedDate;
  const isEscalated = !!dispute?.escalatedDate;
  const isRetracted = !!dispute?.retractedDate;
  console.log({
    // TODO: remove
    isInRedeemed,
    isInDispute,
    isResolved,
    isEscalated,
    isRetracted,
    exchange,
    dispute,
    acceptedProposal
  });
  const acceptedProposalContent = acceptedProposal?.data
    .content as AcceptProposalContent;
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
      ) : isResolved && acceptedProposalContent ? (
        <Grid flexDirection="column" padding="1rem 1rem 0 1rem" gap="1rem">
          <Typography
            padding="1rem"
            background={colors.lightGrey}
            flexDirection="column"
            style={{ width: "100%" }}
          >
            <Grid gap="1rem">
              <div style={{ flex: "0" }}>
                <Info
                  size={25}
                  color={colors.black}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    // TODO:
                  }}
                />
              </div>
              <div style={{ flex: "1" }}>
                <p>
                  You've accepted the buyer's proposal to refund{" "}
                  {Number(
                    acceptedProposalContent.value.proposal.percentageAmount
                  ) / PERCENTAGE_FACTOR}
                  % of the total amount in escrow. The dispute has been resolved
                  and the exchange has been finalised.
                </p>
              </div>
            </Grid>
          </Typography>
        </Grid>
      ) : (
        <></>
      )}
    </>
  );
};
