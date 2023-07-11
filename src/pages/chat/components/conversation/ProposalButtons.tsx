import { Check, Info } from "phosphor-react";

import Button from "../../../../components/ui/Button";
import Grid from "../../../../components/ui/Grid";
import Typography from "../../../../components/ui/Typography";
import { colors } from "../../../../lib/styles/colors";
import { getExchangeDisputeDates } from "../../../../lib/utils/exchange";
import { Exchange } from "../../../../lib/utils/hooks/useExchanges";

type ProposalButtonsProps = {
  onWriteMessage: () => void;
  exchange: Exchange;
};

export const ProposalButtons: React.FC<ProposalButtonsProps> = ({
  onWriteMessage,
  exchange
}) => {
  const { daysLeftToResolveDispute } = getExchangeDisputeDates(exchange);
  return (
    <Grid flexDirection="column" padding="1rem" gap="1rem">
      <Typography
        padding="1rem"
        background={colors.lightGrey}
        flexDirection="column"
        style={{ width: "100%" }}
      >
        <Grid gap="1rem">
          <div style={{ flex: "0" }}>
            <Info
              size={18}
              color={colors.secondary}
              style={{ cursor: "pointer" }}
            />
          </div>
          <div style={{ flex: "1" }}>
            <p>
              You can either accept their proposal, create a counterproposal or
              first write a message about additional details if needed.
            </p>
            <p>
              You have {daysLeftToResolveDispute} days left to resolve the
              dispute directly with the buyer.
            </p>
          </div>
        </Grid>
      </Typography>
      <Grid gap="1rem" justifyContent="space-between" flex="1">
        <Button theme="secondary">
          <span style={{ whiteSpace: "pre" }}>Accept proposal</span>{" "}
          <Check size={18} />
        </Button>
        <Button theme="secondary">
          <span style={{ whiteSpace: "pre" }}>Counterpropose</span>
        </Button>
        <Button theme="secondary" onClick={onWriteMessage}>
          <span style={{ whiteSpace: "pre" }}>Write message</span>
        </Button>
      </Grid>
    </Grid>
  );
};
