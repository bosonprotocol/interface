import { ArrowRight } from "phosphor-react";
import styled from "styled-components";

import Grid from "../../components/ui/Grid";
import { colors } from "../../lib/styles/colors";
import Typography from "../ui/Typography";

const BannerContainer = styled.a`
  display: block;
  text-align: center;
  background-color: ${colors.secondary};
  color: ${colors.white};
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  &:hover {
    background-color: ${colors.black};
    [data-arrow-right] {
      transform: translate(1rem, 0);
    }
  }
`;
const ArrowWrapper = styled(Grid)`
  background-color: ${colors.primary};
  padding: 0.315rem;
  color: ${colors.black};
  width: auto;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
`;

function Banner() {
  return (
    <BannerContainer href="https://medium.com/bosonprotocol" target="_blank">
      <Grid justifyContent="center" gap="1rem" padding="0.535rem 1rem">
        <Typography margin="0" $fontSize="1.125rem">
          Get 50% of the purchase price of any item as a $BOSON reward
        </Typography>
        <ArrowWrapper data-arrow-right>
          <ArrowRight size={13} />
        </ArrowWrapper>
      </Grid>
    </BannerContainer>
  );
}

export default Banner;
