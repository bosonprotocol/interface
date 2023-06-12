import React from "react";
import styled from "styled-components";

import { LayoutRoot } from "../../components/layout/Layout";
import BosonButton from "../../components/ui/BosonButton";
import Grid from "../../components/ui/Grid";
import Typography from "../../components/ui/Typography";
import { colors } from "../../lib/styles/colors";

const Background = styled.div`
  background: ${colors.lightGrey};
  width: 100%;
`;

// interface SellerLandingPageProps {

// }

export const SellerLandingPage: React.FC = () => {
  return (
    <Grid flexDirection="column">
      <Background>
        <LayoutRoot>
          <Grid>
            <Typography tag="h1" fontWeight="600" $fontSize="3.5rem">
              Sell physical products as NFTs everywhere
            </Typography>
            <Grid flexDirection="column" $width="12.75rem">
              <BosonButton>
                <span style={{ whiteSpace: "pre", fontSize: "1rem" }}>
                  Start from scratch
                </span>
              </BosonButton>
              <Typography fontWeight="600" $fontSize="20px" textAlign="center">
                or select a template below
              </Typography>
            </Grid>
          </Grid>
        </LayoutRoot>
      </Background>
    </Grid>
  );
};

export default SellerLandingPage;
