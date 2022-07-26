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
  onSubmit: () => void;
  onBackClick: () => void;
}

export default function ReviewAndSubmitStep({ onSubmit, onBackClick }: Props) {
  return (
    <>
      <Typography fontSize="2rem" fontWeight="600">
        Review & Submit
      </Typography>
      <Typography fontWeight="600" tag="p">
        Description
      </Typography>
      <Typography fontSize="1.25rem" color={colors.darkGrey}></Typography>
      <Grid flexDirection="column" margin="2rem 0" alignItems="flex-start">
        <Typography fontWeight="600" tag="p">
          Type of proposal
        </Typography>
      </Grid>
      <ButtonsSection>
        <Button theme="secondary" onClick={() => onSubmit()} disabled={false}>
          Sign & Submit
        </Button>
        <Button theme="secondary" onClick={() => onBackClick()}>
          Back
        </Button>
      </ButtonsSection>
    </>
  );
}
