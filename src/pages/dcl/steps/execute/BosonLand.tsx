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
            Add your products to Boson Boulevard
          </Typography>
          <p>
            To get access and sell on Boson Boulevard, get in touch with us
            through the Typeform link below. We will get back to you within 1-3
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
            {
              // TODO: add typeform link
            }
            Apply <ArrowSquareOut size={24} />
          </Button>
          <BosonButton
            type="button"
            onClick={() => setSuccess()}
            style={{ marginTop: "3.5rem" }}
          >
            Done
          </BosonButton>
        </StyledGrid>
        <Help
          data={[
            {
              title: "What is Boson Boulevard?",
              description:
                "Boson Boulevard is a dcommerce district that has been created in the Boson virtual environment in DCL."
            },
            {
              title: "Can anyone sell on Boson Boulevard?",
              description:
                "Boson Boulevard is a curated dcommerce experience. Brands meeting a certain criteria can sell on that virtual experience."
            },
            {
              title:
                "How long does it take to have my products live on Boson Boulevard?",
              description:
                "Once we receive your information, products can go live within 2-4 business days"
            }
          ]}
        />
      </Grid>
    </StyledDCLLayout>
  );
};
