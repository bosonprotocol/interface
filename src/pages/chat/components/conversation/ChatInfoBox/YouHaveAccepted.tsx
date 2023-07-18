import {
  AcceptProposalContent,
  MessageData,
  ProposalContent
} from "@bosonprotocol/chat-sdk/dist/esm/util/v0.0.1/definitions";
import { Info, X } from "phosphor-react";
import { useState } from "react";

import { PERCENTAGE_FACTOR } from "../../../../../components/modal/components/Chat/const";
import { useModal } from "../../../../../components/modal/useModal";
import Grid from "../../../../../components/ui/Grid";
import Typography from "../../../../../components/ui/Typography";
import { colors } from "../../../../../lib/styles/colors";
import { Exchange } from "../../../../../lib/utils/hooks/useExchanges";

type YouHaveAcceptedProps = {
  exchange: Exchange;
  proposal: MessageData | null;
  buyerPercent: string;
  acceptedProposal: MessageData;
};

export const YouHaveAccepted: React.FC<YouHaveAcceptedProps> = ({
  exchange,
  proposal,
  buyerPercent,
  acceptedProposal
}) => {
  const { showModal } = useModal();
  const acceptedProposalContent = acceptedProposal.data
    .content as AcceptProposalContent;
  const youHaveAccepted = (
    <p>
      You've accepted the buyer's proposal to refund{" "}
      {Number(acceptedProposalContent?.value.proposal.percentageAmount) /
        PERCENTAGE_FACTOR}
      % of the total amount in escrow. The dispute has been resolved and the
      exchange has been finalised.
    </p>
  );
  const [showText, setShowText] = useState<boolean>(true);
  if (!showText) {
    return <></>;
  }
  return (
    <Grid flexDirection="column" padding="1rem 1rem 0 1rem" gap="1rem">
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
                showModal("RESOLUTION_SUMMARY", {
                  title: "Dispute Resolution Summary",
                  exchange,
                  proposal: {
                    type:
                      (proposal?.data?.content as ProposalContent)?.value
                        ?.proposals?.[0]?.type || "Refund",
                    percentageAmount: buyerPercent
                  },
                  message: youHaveAccepted
                });
              }}
            />
          </div>
          <div style={{ flex: "1" }}>{youHaveAccepted}</div>
        </Grid>
      </Typography>
    </Grid>
  );
};
