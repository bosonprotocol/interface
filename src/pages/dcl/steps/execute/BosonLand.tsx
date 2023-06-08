import { ArrowSquareOut } from "phosphor-react";
import React from "react";
import styled from "styled-components";

import Help from "../../../../components/product/Help";
import BosonButton from "../../../../components/ui/BosonButton";
import Button from "../../../../components/ui/Button";
import Grid from "../../../../components/ui/Grid";
import Typography from "../../../../components/ui/Typography";
import { breakpoint } from "../../../../lib/styles/breakpoint";
import { StyledDCLLayout } from "../../styles";

const StyledGrid = styled(Grid)`
  ${breakpoint.m} {
    max-width: calc(50% - 3rem);
  }
`;

interface BosonLandProps {
  setSuccess: () => void;
}

export const BosonLand: React.FC<BosonLandProps> = ({ setSuccess }) => {
  return (
    <StyledDCLLayout width="auto">
      <Grid
        justifyContent="space-between"
        alignItems="flex-start"
        flexWrap="wrap"
        gap="3rem"
      >
        <StyledGrid flexDirection="column" alignItems="flex-start">
          <Typography fontWeight="600" $fontSize="2rem">
            Add product to your Boson Land
          </Typography>
          <p>
            To get access and sell on Boson Land you need to apply through the
            Typeform link below. We will get in touch with you within 1-3
            business days. If any questions arise do not hesitate to{" "}
            <a
              href="mailto:info@bosonapp.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              contact
            </a>{" "}
            us.
          </p>
          <Button theme="secondary">
            Apply <ArrowSquareOut size={24} />
          </Button>
          <BosonButton
            onClick={() => setSuccess()}
            style={{ marginTop: "3.5rem" }}
          >
            Done
          </BosonButton>
        </StyledGrid>
        <Help data={[{ title: "hola", description: "desc" }]} />
      </Grid>
    </StyledDCLLayout>
  );
};
