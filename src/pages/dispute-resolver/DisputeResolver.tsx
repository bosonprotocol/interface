import { House, WarningCircle } from "phosphor-react";
import styled from "styled-components";

import DRAside from "../../components/disputeResolver/DisputeResolverAside";
import DisputeResolverInside from "../../components/disputeResolver/DisputeResolverInside";
import Button from "../../components/ui/Button";
import Grid from "../../components/ui/Grid";
import Loading from "../../components/ui/Loading";
import Typography from "../../components/ui/Typography";
import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { useCurrentDisputeResolverId } from "../../lib/utils/hooks/useCurrentDisputeResolverId";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";

export const Wrapper = styled.div`
  text-align: center;
`;
const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: 14.3em 1fr;
  gap: 0;
  min-height: calc(100vh - 30.25rem);
  margin: 0 -1rem;
  font-family: "Plus Jakarta Sans";
  color: ${colors.black};
`;

export interface DisputeResolverInsideProps {
  disputeResolverId: string;
}

function DisputeResolverCenter(props: DisputeResolverInsideProps) {
  return (
    <GridWrapper>
      <DRAside {...props} />
      <DisputeResolverInside {...props} />
    </GridWrapper>
  );
}

function DisputeResolverCenterWrapper() {
  const navigate = useKeepQueryParamsNavigate();
  const { isLoading, disputeResolverId } = useCurrentDisputeResolverId();

  if (isLoading) {
    return (
      <Wrapper>
        <Loading />
      </Wrapper>
    );
  }

  if (disputeResolverId === null) {
    return (
      <Wrapper>
        <Grid
          justifyContent="center"
          padding="5rem"
          gap="2rem"
          flexDirection="column"
        >
          <WarningCircle size={112} color={colors.red} weight="thin" />
          <Typography tag="h5">
            You need to be a dispute resolver to access this page!
          </Typography>
          <Button
            theme="secondary"
            onClick={() => {
              navigate({
                pathname: BosonRoutes.Root
              });
            }}
          >
            Back home
            <House size={16} />
          </Button>
        </Grid>
      </Wrapper>
    );
  }

  return <DisputeResolverCenter disputeResolverId={disputeResolverId} />;
}

export default DisputeResolverCenterWrapper;
