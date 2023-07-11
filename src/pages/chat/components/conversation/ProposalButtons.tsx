import { Check } from "phosphor-react";

import Button from "../../../../components/ui/Button";
import Grid from "../../../../components/ui/Grid";
import Typography from "../../../../components/ui/Typography";

type ProposalButtonsProps = {
  onWriteMessage: () => void;
};

export const ProposalButtons: React.FC<ProposalButtonsProps> = ({
  onWriteMessage
}) => {
  return (
    <Grid flexDirection="column">
      <Typography>
        You can either accept their proposal, create a counterproposal or first
        write a message about additional details if needed. You have 24 days
        left to resolve the dispute directly with the buyer.
      </Typography>
      <Grid>
        <Button theme="secondary">
          Accept proposal <Check />
        </Button>
        <Button theme="secondary">Counterpropose</Button>
        <Button theme="secondary" onClick={onWriteMessage}>
          Write message
        </Button>
      </Grid>
    </Grid>
  );
};
