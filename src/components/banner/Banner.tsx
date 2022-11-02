import { ArrowRight } from "phosphor-react";
import styled from "styled-components";

import Grid from "../../components/ui/Grid";
import { colors } from "../../lib/styles/colors";
import Typography from "../ui/Typography";

const BannerContainer = styled.a`
  display: block;
  text-align: center;
  width: 100vw;
  background-color: ${colors.secondary};
  color: ${colors.white};
`;
const ArrowWrapper = styled(Grid)`
  background-color: ${colors.primary};
  padding: 0.315rem;
  color: ${colors.black};
  width: auto;
`;

function Banner() {
  return (
    <BannerContainer href="https://medium.com/bosonprotocol" target="_blank">
      <Grid justifyContent="center" gap="1rem" padding="0.535rem">
        <Typography margin="0" $fontSize="1.125rem">
          Get 50% of purchase price of any item as a $BOSON reward
        </Typography>
        <ArrowWrapper>
          <ArrowRight size={13} />
        </ArrowWrapper>
      </Grid>
    </BannerContainer>
  );
}

export default Banner;
