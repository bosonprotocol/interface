import { Check } from "phosphor-react";
import styled from "styled-components";

import { colors } from "../../../../../lib/styles/colors";
import Step from "../../../../../pages/landing/Step";
import { CommitStep, CommitStepWrapper } from "../../../../detail/Detail.style";
import FairExchangePolicy from "../../../../exchangePolicy/FairExchangePolicy";
import Button from "../../../../ui/Button";
import Grid from "../../../../ui/Grid";

const StyledCommitStepWrapper = styled(CommitStepWrapper)`
  [data-testid="step-title"] {
    font-size: 1rem;
  }
`;

interface Props {
  onNextClick: () => void;
}

export default function StepsOverview({ onNextClick }: Props) {
  return (
    <>
      <StyledCommitStepWrapper>
        <CommitStep>
          <Step number={1} title="Commit"></Step>
        </CommitStep>
        <CommitStep>
          <Step number={2} title="Redeem the rNFT"></Step>
        </CommitStep>
        <CommitStep>
          <Step number={3} title="Receive the item"></Step>
        </CommitStep>
      </StyledCommitStepWrapper>
      <FairExchangePolicy
        titleTag="h4"
        bulletPointIcon={<Check size={16} color={colors.secondary} />}
      />
      <Grid padding="2rem 0 0 0" justifyContent="space-between">
        <Button theme="primary" onClick={() => onNextClick()}>
          Next
        </Button>
      </Grid>
    </>
  );
}
