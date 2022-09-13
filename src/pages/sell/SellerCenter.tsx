import { House, WarningCircle } from "phosphor-react";
import styled from "styled-components";

import {
  WithSellerData,
  WithSellerDataProps
} from "../../components/seller/common/WithSellerData";
import SellerAside from "../../components/seller/SellerAside";
import SellerInside from "../../components/seller/SellerInside";
import { SellerInsideProps } from "../../components/seller/SellerInside";
import Button from "../../components/ui/Button";
import Grid from "../../components/ui/Grid";
import Loading from "../../components/ui/Loading";
import Typography from "../../components/ui/Typography";
import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { useCurrentSellerId } from "../../lib/utils/hooks/useCurrentSellerId";
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

function SellerCenter(props: SellerInsideProps & WithSellerDataProps) {
  return (
    <GridWrapper data-wrapper>
      <SellerAside {...props} />
      <SellerInside {...props} />
    </GridWrapper>
  );
}
const SellerCenterWithData = WithSellerData<SellerInsideProps>(SellerCenter);

function SellerCenterWrapper() {
  const navigate = useKeepQueryParamsNavigate();
  const { isLoading, sellerId } = useCurrentSellerId();

  if (isLoading) {
    return (
      <Wrapper>
        <Loading />
      </Wrapper>
    );
  }

  if (sellerId === null) {
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
            The seller with that ID doesn't exist!
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

  return <SellerCenterWithData sellerId={sellerId} />;
}

export default SellerCenterWrapper;
