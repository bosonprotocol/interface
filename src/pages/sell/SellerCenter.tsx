import { Button } from "@bosonprotocol/react-kit";
import { House, WarningCircle } from "phosphor-react";
import { useEffect, useState } from "react";
import styled from "styled-components";

import Navigate from "../../components/customNavigation/Navigate";
import {
  WithSellerData,
  WithSellerDataProps
} from "../../components/seller/common/WithSellerData";
import SellerAside from "../../components/seller/SellerAside";
import SellerInside, {
  SellerInsideProps
} from "../../components/seller/SellerInside";
import Grid from "../../components/ui/Grid";
import Loading from "../../components/ui/Loading";
import Typography from "../../components/ui/Typography";
import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { useCurrentSellers } from "../../lib/utils/hooks/useCurrentSellers";
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
    <GridWrapper>
      <SellerAside {...props} />
      <SellerInside {...props} />
    </GridWrapper>
  );
}
const SellerCenterWithData = WithSellerData(SellerCenter);

function SellerCenterWrapper() {
  const navigate = useKeepQueryParamsNavigate();
  const { isLoading, sellerIds, isSuccess } = useCurrentSellers();
  const [selectedSellerId, setSelectedSellerId] = useState<string>(
    sellerIds?.length === 1 ? sellerIds[0] : ""
  );
  useEffect(() => {
    if (isSuccess) {
      setSelectedSellerId(sellerIds.length === 1 ? sellerIds[0] : "");
    }
  }, [isSuccess, sellerIds]);

  const isAccountSeller = !!selectedSellerId;

  if (isLoading) {
    return (
      <Wrapper>
        <Loading />
      </Wrapper>
    );
  }

  if (!isAccountSeller) {
    return <Navigate replace to={{ pathname: BosonRoutes.ClosedBeta }} />;
  }

  if (!sellerIds.length) {
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
            variant="accentInverted"
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

  if (sellerIds.length > 1 && !selectedSellerId) {
    <select
      onChange={(e) => {
        setSelectedSellerId(e.target.value);
      }}
    >
      {sellerIds.map((id: string) => (
        <option value={id} key="id">
          {id}
        </option>
      ))}
    </select>;
  }

  return <SellerCenterWithData sellerId={selectedSellerId} />;
}

export default SellerCenterWrapper;
