import {
  MessageData,
  ProposalContent
} from "@bosonprotocol/chat-sdk/dist/esm/util/v0.0.1/definitions";
import { Check, Info, X } from "phosphor-react";
import { Dispatch, SetStateAction, useState } from "react";

import { MakeProposalModalProps } from "../../../../../components/modal/components/Chat/MakeProposal/MakeProposalModal";
import { useModal } from "../../../../../components/modal/useModal";
import Button from "../../../../../components/ui/Button";
import Grid from "../../../../../components/ui/Grid";
import Typography from "../../../../../components/ui/Typography";
import { colors } from "../../../../../lib/styles/colors";
import { getExchangeDisputeDates } from "../../../../../lib/utils/exchange";
import { Exchange } from "../../../../../lib/utils/hooks/useExchanges";
import { MessageDataWithInfo } from "../../../types";

export type ProposalButtonsProps = {
  exchange: Exchange;
  proposal: MessageData;
  sendProposal: MakeProposalModalProps["sendProposal"];
  iAmTheBuyer: boolean;
  setHasError: Dispatch<SetStateAction<boolean>>;
  addMessage: (
    newMessageOrList: MessageDataWithInfo | MessageDataWithInfo[]
  ) => Promise<void>;
  onSentMessage: (messageData: MessageData, uuid: string) => Promise<void>;
};

export const ProposalButtons: React.FC<ProposalButtonsProps> = ({
  proposal,
  exchange,
  sendProposal,
  iAmTheBuyer,
  addMessage,
  onSentMessage,
  setHasError
}) => {
  const { showModal } = useModal();
  const { daysLeftToResolveDispute } = getExchangeDisputeDates(exchange);
  const [showText, setShowText] = useState<boolean>(true);
  return (
    <Grid flexDirection="column" padding="1rem 1rem 0 1rem" gap="1rem">
      {showText && (
        <Typography
          padding="1rem"
          background={colors.lightGrey}
          flexDirection="column"
          style={{ width: "100%", position: "relative" }}
        >
          <X
            size={15}
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              cursor: "pointer"
            }}
            onClick={() => {
              setShowText(false);
            }}
          />
          <Grid gap="1rem">
            <div style={{ flex: "0" }}>
              <Info
                size={25}
                color={colors.black}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  showModal("RAISE_DISPUTE", {
                    title: "Dispute process"
                  });
                }}
              />
            </div>
            <div style={{ flex: "1" }}>
              <p>
                You can either accept their proposal, create a counterproposal
                or first write a message about additional details if needed.
              </p>
              <p>
                You have {daysLeftToResolveDispute} days left to resolve the
                dispute directly with the buyer.
              </p>
            </div>
          </Grid>
        </Typography>
      )}
      <Grid gap="1rem" justifyContent="space-between" flex="1">
        <Button
          theme="secondary"
          onClick={() => {
            const [proposalItem] = (proposal.data.content as ProposalContent)
              .value.proposals;
            if (proposalItem) {
              showModal(
                "RESOLVE_DISPUTE",
                {
                  title: "Resolve dispute",
                  exchange,
                  proposal: proposalItem,
                  iAmTheBuyer,
                  setHasError,
                  addMessage,
                  onSentMessage
                },
                "auto",
                undefined,
                {
                  m: "600px"
                }
              );
            }
          }}
        >
          <span style={{ whiteSpace: "pre" }}>Accept proposal</span>{" "}
          <Check size={18} />
        </Button>
        <Button
          theme="secondary"
          onClick={() =>
            showModal(
              "MAKE_PROPOSAL",
              {
                exchange,
                sendProposal,
                isCounterProposal: true
              },
              "m"
            )
          }
        >
          <span style={{ whiteSpace: "pre" }}>Counterpropose</span>
        </Button>
      </Grid>
    </Grid>
  );
};
