import { ArrowSquareOut, GithubLogo } from "phosphor-react";
import React from "react";
import styled from "styled-components";

import Help from "../../../../components/product/Help";
import BosonButton from "../../../../components/ui/BosonButton";
import Button from "../../../../components/ui/Button";
import Grid from "../../../../components/ui/Grid";
import Typography from "../../../../components/ui/Typography";
import { breakpoint } from "../../../../lib/styles/breakpoint";
import { DCLLayout } from "../../styles";

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
    <DCLLayout width="auto">
      <Grid
        justifyContent="space-between"
        alignItems="flex-start"
        flexWrap="wrap"
        gap="3rem"
      >
        <StyledGrid flexDirection="column" alignItems="flex-start">
          <Typography fontWeight="600" $fontSize="2rem">
            Add product to your land
          </Typography>
          <Typography tag="p">
            The developer documentation provides comprehensive guidance on
            integrating the Boson Kiosk into your virtual property in
            Decentraland. This capability will enable scene builders in
            Decentraland to incorporate a Boson Kiosk into their virtual
            environments.
          </Typography>
          <Typography tag="p">
            The integration of a Boson Kiosk enables potential buyers to
            purchase Boson rNFTs (redeemable Non-Fungible Tokens) directly
            within the Metaverse. This is achieved through direct interaction
            with the Boson Protocol on the Polygon platform.
          </Typography>
          <Typography tag="p">
            Do not hesitate to get in touch in case you need any help!
          </Typography>
          <Grid justifyContent="flex-start" gap="1.25rem">
            <a
              href="https://docs.bosonprotocol.io/docs/quick_start/metaverse_tutorial/selling_in_dcl/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button theme="secondary">
                Documentation <ArrowSquareOut size={24} />
              </Button>
            </a>
            <a
              href="https://github.com/bosonprotocol/boson-dcl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button theme="secondary">
                GitHub <GithubLogo size={24} />
              </Button>
            </a>
          </Grid>
          <BosonButton
            onClick={() => setSuccess()}
            style={{ marginTop: "3.5rem" }}
          >
            Done
          </BosonButton>
        </StyledGrid>
        <Help data={[{ title: "hola", description: "desc" }]} />
      </Grid>
    </DCLLayout>
  );
};
