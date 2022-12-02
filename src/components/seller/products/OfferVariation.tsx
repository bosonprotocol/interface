import styled from "styled-components";

import Grid from "../../ui/Grid";
import Typography from "../../ui/Typography";

const VariationsGrid = styled(Grid)`
  * {
    font-size: 0.7rem;
  }
`;

interface Props {
  color?: string | undefined | null;
  size?: string | undefined | null;
}

export default function OfferVariation({ color, size }: Props) {
  return (
    <VariationsGrid justifyContent="flex-start" gap="0.5rem">
      {color && (
        <Grid justifyContent="flex-start" gap="0.2rem">
          <Typography>Color:</Typography>
          <Typography fontWeight="600">{color}</Typography>
        </Grid>
      )}
      {size && (
        <Grid justifyContent="flex-start" gap="0.2rem">
          <Typography>Size:</Typography>
          <Typography fontWeight="600">{size}</Typography>
        </Grid>
      )}
    </VariationsGrid>
  );
}
