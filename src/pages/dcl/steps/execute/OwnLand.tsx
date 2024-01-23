import { ArrowSquareOut, GithubLogo } from "phosphor-react";
import React from "react";
import styled from "styled-components";

import Help from "../../../../components/product/Help";
import BosonButton from "../../../../components/ui/BosonButton";
import Button from "../../../../components/ui/Button";
import { Grid } from "../../../../components/ui/Grid";
import { Typography } from "../../../../components/ui/Typography";
import { breakpoint } from "../../../../lib/styles/breakpoint";
import { StyledDCLLayout } from "../../styles";

const StyledGrid = styled(Grid)`
  ${breakpoint.m} {
    max-width: calc(50% - 3rem);
  }
`;
interface OwnLandProps {
  setSuccess: () => void;
}

export const OwnLand: React.FC<OwnLandProps> = ({ setSuccess }) => {
  return (
    <StyledDCLLayout width="auto">
      <Grid
        justifyContent="space-between"
        alignItems="flex-start"
        flexWrap="wrap"
        gap="3rem"
      >
        <StyledGrid flexDirection="column" alignItems="flex-start">
          <Typography fontWeight="600" fontSize="2rem">
            Add product to your own land
          </Typography>
          <Typography tag="p">
            The developer documentation provides comprehensive guidance on
            integrating the Boson Metaverse Commerce Toolkit into your virtual
            property in Decentraland. This capability will enable scene builders
            in Decentraland to incorporate a Boson Kiosk into their virtual
            environments.
          </Typography>
          <Typography tag="p">
            The integration of the Boson Metaverse Commerce Toolkit enables
            potential buyers to purchase physical NFTs directly within the
            Metaverse. This is achieved through direct interaction with the
            Boson Protocol on the Polygon platform.
          </Typography>
          <p>
            Do not hesitate to{" "}
            <a
              href="mailto:info@bosonapp.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              get in touch
            </a>{" "}
            in case you need any help!
          </p>
          <Grid justifyContent="flex-start" gap="1.25rem">
            <a
              href="https://docs.bosonprotocol.io/docs/quick_start/metaverse_tutorial/selling_in_dcl/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button themeVal="secondary">
                Documentation <ArrowSquareOut size={24} />
              </Button>
            </a>
            <a
              href="https://github.com/bosonprotocol/boson-dcl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button themeVal="secondary">
                GitHub <GithubLogo size={24} />
              </Button>
            </a>
          </Grid>
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
              title: "Can I sell on my own virtual land in DCL?",
              description:
                "Yes. The Boson Metaverse Commerce Toolkit can be used across any virtual environment or land in DCL."
            },
            {
              title:
                "Do I need a developer to integrate the Metaverse Commerce Toolkit into my scene on my own DCL land?",
              description:
                "Integrating the Metaverse Commerce Toolkit requires some familiarity and understanding of integrating scenes in DCL. In addition, a basic knowledge of Typescript coding is required."
            },
            {
              title:
                "How long does it take to integrate the Metaverse Commerce Toolkit into my DCL land?",
              description:
                "Typically, users who are familiar with DCL and Typescript have integrated the Metaverse Commerce Toolkit into their scene within a few hours."
            },
            {
              title:
                "I have questions about the Metaverse Commerce Toolkit, how do I get help?",
              description: (
                <p>
                  For questions, please contact us at{" "}
                  <a
                    href="mailto:info@bosonapp.io"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    info@bosonapp.io
                  </a>{" "}
                  or via{" "}
                  <a
                    href="https://discord.com/invite/5dRV7fWet2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Discord
                  </a>{" "}
                  or{" "}
                  <a
                    href="https://t.me/bosonprotocol"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Telegram
                  </a>
                  .
                </p>
              )
            }
          ]}
        />
      </Grid>
    </StyledDCLLayout>
  );
};
