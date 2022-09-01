import React from "react";
import styled from "styled-components";

import { colors } from "../../../../../../../lib/styles/colors";
import Typography from "../../../../../../ui/Typography";

const Container = styled.div`
  background: ${colors.white};
  margin-top: 2rem;
  padding: 2rem;
`;

function EscalateFinalStep() {
  return (
    <Container>
      <Typography fontWeight="600" $fontSize="2rem" margin="0 0 0.625rem 0">
        Submit Evidence
      </Typography>
      <Typography
        fontWeight="400"
        $fontSize="1.25rem"
        margin="0 0 5rem 0"
        color={colors.darkGrey}
      >
        Submit Evidence
      </Typography>
    </Container>
  );
}

export default EscalateFinalStep;
