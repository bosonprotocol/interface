import { ArrowRight } from "phosphor-react";
import styled from "styled-components";

import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import Grid from "../../components/ui/Grid";
import Typography from "../../components/ui/Typography";
import { BosonRoutes } from "../../lib/routing/routes";
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
const BreadcrumbsContainer = styled.div`
  display: block;
`;

interface Props {
  name: string;
  url: string;
  onClick: () => void;
  showMore?: boolean;
}
export default function ExploreViewMore({
  name,
  url,
  onClick,
  showMore = false
}: Props) {
  return (
    <Grid>
      {showMore ? (
        <>
          <Typography
            $fontSize="32px"
            fontWeight="600"
            margin="0.67em 0 0.67em 0"
          >
            {name}
          </Typography>
          <ViewMoreButton onClick={onClick}>
            View more <ArrowRight size={22} />
          </ViewMoreButton>
        </>
      ) : (
        <BreadcrumbsContainer>
          <Breadcrumbs
            steps={[
              {
                id: 0,
                label: "Explore",
                url: `${BosonRoutes.Explore}`,
                hightlighted: true
              },
              {
                id: 1,
                label: `All ${name}`,
                url,
                hightlighted: false
              }
            ]}
            margin="-0.625rem 0 2rem 0"
          />
        </BreadcrumbsContainer>
      )}
    </Grid>
  );
}
