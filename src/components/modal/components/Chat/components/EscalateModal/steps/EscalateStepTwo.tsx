import React from "react";
import styled from "styled-components";

import { colors } from "../../../../../../../lib/styles/colors";
import Typography from "../../../../../../ui/Typography";

const Container = styled.div`
  background: ${colors.white};
  margin-top: 2rem;
  padding: 2rem;
`;

const StyledList = styled.ol`
  margin-top: 2rem;
  padding-left: 1rem;
  [data-list-element] {
    font-weight: 600;
    font-size: 1rem;
  }
  [data-sublist] {
    list-style-type: none;
    padding-left: 0;
    [data-list-element] {
      font-weight: 400;
      font-size: 1rem;
      color: ${colors.darkGrey};
      margin-bottom: 1rem;
    }
  }
`;

function EscalateStepTwo() {
  return (
    <Container>
      <Typography $fontSize="2rem" fontWeight="600">
        Escalate Dispute
      </Typography>
      <Typography $fontSize="1rem" fontWeight="400" color={colors.darkGrey}>
        Escalating a dispute will enable the dispite resolver to decide on the
        outcome of the dispute. The dispute resolver will decide based on the
        contractual agreement and evidence submitted by both parties.
      </Typography>
      <StyledList>
        <li data-list-element>Dispute Escalation Transaction</li>
        <ol data-sublist>
          <li data-list-element>
            Confirm dispute escalation transaction first submit
          </li>
        </ol>
        <li data-list-element>Case Description & Evidence</li>
        <ol data-sublist>
          <li data-list-element>
            Submit case description and evidence to dispute resolver via e-mail
          </li>
        </ol>
      </StyledList>
    </Container>
  );
}

export default EscalateStepTwo;
