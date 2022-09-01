import React from "react";
import styled from "styled-components";

import { colors } from "../../../../../../../lib/styles/colors";
import { Exchange } from "../../../../../../../lib/utils/hooks/useExchanges";
import Grid from "../../../../../../ui/Grid";
import Typography from "../../../../../../ui/Typography";

interface Props {
  exchange: Exchange;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

const StyledGrid = styled(Grid)`
  background: ${colors.white};
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  justify-content: space-between;
  width: 100%;
  grid-gap: 0.625rem;
  margin-top: 5rem;
  padding-bottom: 15px;
  border-bottom: 1px solid ${colors.lightGrey};
`;

function EscalateStepOne({ exchange, setActiveStep }: Props) {
  return (
    <>
      <StyledGrid
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        padding="2rem"
        margin="1rem 0 0 0"
      >
        <Typography fontWeight="600" $fontSize="2rem" margin="1rem 0 0 0">
          Escalate Dispute
        </Typography>
        <Typography $fontSize="1rem" fontWeight="400">
          Escalating a dispute will enable the dispite resolver to decide on the
          outcome of the dispute. The dispute resolver will decide based on the
          contractual agreement and evidence submitted by both parties.
        </Typography>
        <GridContainer>
          <Typography fontWeight="400" $fontSize="1rem" color={colors.darkGrey}>
            Dispute resolver
          </Typography>
          <Typography
            fontWeight="600"
            $fontSize="1rem"
            color={colors.darkGrey}
            justifyContent="flex-end"
          >
            Portal
          </Typography>
          <Typography fontWeight="400" $fontSize="1rem" color={colors.darkGrey}>
            Exchange policy
          </Typography>
          <Typography
            fontWeight="600"
            $fontSize="1rem"
            color={colors.darkGrey}
            justifyContent="flex-end"
          >
            Fair Exchange Policy
          </Typography>
          <Typography fontWeight="400" $fontSize="1rem" color={colors.darkGrey}>
            Escalation deposit
          </Typography>
          <Typography
            fontWeight="600"
            $fontSize="1rem"
            color={colors.darkGrey}
            justifyContent="flex-end"
          >
            10% ($5)
          </Typography>
          <Typography fontWeight="400" $fontSize="1rem" color={colors.darkGrey}>
            Dispute period
          </Typography>
          <Typography
            fontWeight="600"
            $fontSize="1rem"
            color={colors.darkGrey}
            justifyContent="flex-end"
          >
            20 days left
          </Typography>
        </GridContainer>
      </StyledGrid>
    </>
  );
}

export default EscalateStepOne;
