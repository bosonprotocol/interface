import styled from "styled-components";

import { colors } from "../../../../../../lib/styles/colors";
// import { Exchange } from "../../../../../../lib/utils/hooks/useExchanges";
import Button from "../../../../../ui/Button";
import Grid from "../../../../../ui/Grid";
import Typography from "../../../../../ui/Typography";

const ButtonsSection = styled.div`
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
`;

interface Props {
  //   exchange: Exchange;
  onNextClick: () => void;
}

export default function MakeAProposalStep({ onNextClick }: Props) {
  return (
    <>
      <Typography fontSize="2rem" fontWeight="600">
        Make a proposal
      </Typography>
      <Typography fontSize="1.25rem" color={colors.darkGrey}>
        Here you can make a proposal to the seller on how you would like the
        issue to be resolved. Note that this proposal is binding and if the
        seller agrees to it, the proposal will be implemented automatically.
      </Typography>
      <Grid flexDirection="column" margin="2rem 0" alignItems="flex-start">
        <Typography fontWeight="600" tag="p">
          Type of proposal
        </Typography>
      </Grid>
      <ButtonsSection>
        <Button
          theme="secondary"
          onClick={() => onNextClick()}
          disabled={false}
        >
          Next
        </Button>
      </ButtonsSection>
    </>
  );
}
