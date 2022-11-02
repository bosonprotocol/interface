import styled from "styled-components";

import bgImage from "../../assets/closed-beta-bg.png";
import Grid from "../../components/ui/Grid";
import Typography from "../../components/ui/Typography";
import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";

const ClosedBetaPage = styled.div`
  min-height: 100vh;
  background-image: url(${bgImage});
  background-repeat: no-repeat;
  background-position: 50% 25%;
  background-size: 150%;
  ${breakpoint.m} {
    background-position: 50% -50%;
    background-size: auto;
  }
  padding: 2rem;

  display: flex;
  align-items: center;
  justify-content: center;

  text-align: center;
  > div {
    padding: 0 5vw;
    ${breakpoint.m} {
      padding: 0 25vw;
    }
  }
`;
const HrefButton = styled.a`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  box-shadow: 0px 0px 0px #000000;
  transition: all 150ms ease-in-out;
  padding: 0.75rem 1.5rem;
  background: ${colors.primary};
  color: #09182c;
`;

export default function ClosedBeta() {
  return (
    <ClosedBetaPage>
      <Grid gap="2rem" flexDirection="column">
        <Typography
          alignItems="center"
          $fontSize="2.75rem"
          fontWeight="600"
          color={colors.secondary}
        >
          CLOSED BETA
        </Typography>
        <Typography alignItems="center" $fontSize="2.5rem" fontWeight="600">
          Selling on the Boson dApp is in closed beta
        </Typography>
        <Typography alignItems="center" $fontSize="1.75rem" fontWeight="500">
          Contact us to sell your products as redeemable NFTs in a decentralized
          way
        </Typography>
        <HrefButton
          href={
            "https://form.typeform.com/to/VKt2oOo3?typeform-source=www.bosonprotocol.io"
          }
          target="_blank"
          rel="noopener"
        >
          Contact us
        </HrefButton>
      </Grid>
    </ClosedBetaPage>
  );
}
