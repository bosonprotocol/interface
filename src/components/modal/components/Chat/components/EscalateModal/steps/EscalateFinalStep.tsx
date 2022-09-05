import { Copy } from "phosphor-react";
import React from "react";
import styled from "styled-components";

import { colors } from "../../../../../../../lib/styles/colors";
import { useBreakpoints } from "../../../../../../../lib/utils/hooks/useBreakpoints";
import { Exchange } from "../../../../../../../lib/utils/hooks/useExchanges";
import Grid from "../../../../../../ui/Grid";
import Typography from "../../../../../../ui/Typography";

interface Props {
  exchange: Exchange;
}

const Container = styled.div`
  background: ${colors.white};
  margin-top: 2rem;
  padding: 2rem;
`;

const StyledCopy = styled(Copy)`
  margin-left: 0.3125rem;
`;

const StyledGrid = styled.div<{ isLteXS: boolean }>`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-columns: ${({ isLteXS }) => isLteXS && "100%"};
  max-width: ${({ isLteXS }) => !isLteXS && "30rem"};
`;

const CopyButton = styled.button`
  background: none;
  border: none;
`;

const StyledTypography = styled(Typography)<{ isLteXS: boolean }>`
  display: ${({ isLteXS }) => isLteXS && "block"};
`;

function EscalateFinalStep({ exchange }: Props) {
  const { isLteXS } = useBreakpoints();

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
        You have to submit evidence to the dispute resolver to decide on your
        case.
      </Typography>
      <Grid justifyContent={isLteXS ? "center" : "flex-start"}>
        <Typography $fontSize="1rem" fontWeight="600">
          Portal Dis Rec Inc.
        </Typography>
        <CopyButton
          onClick={() => navigator.clipboard.writeText("Portal@dispute.com")}
        >
          <StyledCopy size={24} color={colors.secondary} weight="light" />
        </CopyButton>
      </Grid>
      <StyledTypography
        $fontSize="1rem"
        fontWeight="400"
        color={colors.darkGrey}
        margin="2rem 0 0 1rem"
        textAlign={isLteXS ? "center" : "left"}
        isLteXS={isLteXS}
      >
        Portal@dispute.com
      </StyledTypography>
      <Grid
        justifyContent={isLteXS ? "center" : "flex-start"}
        margin="2rem 0 0 0"
      >
        <Typography $fontSize="1rem" fontWeight="600">
          Authentication message
        </Typography>
        <CopyButton
          onClick={() =>
            navigator.clipboard.writeText(
              "Exchange ID XY \nDispute ID XY \nAuthenticator 893984vgghjkjhlklkjkjljlkjlkjkljlhkjgjhgjhhgf"
            )
          }
        >
          <StyledCopy size={24} color={colors.secondary} weight="light" />
        </CopyButton>
      </Grid>
      <StyledGrid isLteXS={isLteXS}>
        <StyledTypography
          $fontSize="1rem"
          fontWeight="400"
          color={colors.darkGrey}
          margin="1rem 0 0 1rem"
          textAlign={isLteXS ? "center" : "left"}
          isLteXS={isLteXS}
        >
          Exchange ID
        </StyledTypography>
        <StyledTypography
          $fontSize="1rem"
          fontWeight="600"
          color={colors.darkGrey}
          margin="1rem 0 0 1rem"
          $width="100%"
          justifyContent="flex-end"
          textAlign={isLteXS ? "center" : "right"}
          isLteXS={isLteXS}
        >
          {exchange.id}
        </StyledTypography>
        <StyledTypography
          $fontSize="1rem"
          fontWeight="400"
          color={colors.darkGrey}
          margin="1rem 0 0 1rem"
          textAlign={isLteXS ? "center" : "left"}
          isLteXS={isLteXS}
        >
          Dispute ID
        </StyledTypography>
        <StyledTypography
          $fontSize="1rem"
          fontWeight="600"
          color={colors.darkGrey}
          margin="1rem 0 0 1rem"
          $width="100%"
          justifyContent="flex-end"
          textAlign={isLteXS ? "center" : "right"}
          isLteXS={isLteXS}
        >
          {exchange.id}
        </StyledTypography>
        <StyledTypography
          $fontSize="1rem"
          fontWeight="400"
          color={colors.darkGrey}
          margin="1rem 0 0 1rem"
          textAlign={isLteXS ? "center" : "left"}
          isLteXS={isLteXS}
        >
          Authenticator
        </StyledTypography>
        <StyledTypography
          $fontSize="1rem"
          fontWeight="600"
          color={colors.darkGrey}
          margin="1rem 0 0 1rem"
          $width="100%"
          justifyContent="flex-end"
          textAlign={isLteXS ? "center" : "left"}
          isLteXS={isLteXS}
        >
          insert-signature
        </StyledTypography>
      </StyledGrid>
    </Container>
  );
}

export default EscalateFinalStep;
