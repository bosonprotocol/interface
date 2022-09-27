import { ArrowRight } from "phosphor-react";
import styled from "styled-components";

import Grid from "../../components/ui/Grid";
import Typography from "../../components/ui/Typography";
import { colors } from "../../lib/styles/colors";

const ViewMoreButton = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${colors.secondary};
  width: 6.875rem;
  font-size: 1rem;
  font-weight: 600;
`;

interface Props {
  name: string;
  onClick: () => void;
}
export default function ExploreViewMore({ name, onClick }: Props) {
  return (
    <Grid>
      <Typography $fontSize="32px" fontWeight="600" margin="0.67em 0 0.67em 0">
        {name}
      </Typography>
      <ViewMoreButton onClick={onClick}>
        View more <ArrowRight size={22} />
      </ViewMoreButton>
    </Grid>
  );
}
