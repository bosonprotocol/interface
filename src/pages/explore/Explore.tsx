import qs from "query-string";
import { Fragment, useMemo } from "react";
import styled from "styled-components";

import { LayoutRoot } from "../../components/Layout";
import CollectionsCard from "../../components/modal/components/Explore/Collections/CollectionsCard";
import ProductCard from "../../components/productCard/ProductCard";
import Grid from "../../components/ui/Grid";
import Loading from "../../components/ui/Loading";
import Typography from "../../components/ui/Typography";
import { ExploreQueryParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { useCollections } from "../../lib/utils/hooks/useCollections";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { ProductGridContainer } from "../profile/ProfilePage.styles";
import ExploreSelect from "./ExploreSelect";
import ExploreViewMore from "./ExploreViewMore";
import useSearchParams from "./useSearchParams";
import { WithAllOffers, WithAllOffersProps } from "./WithAllOffers";

const ExploreContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 0 auto 4rem auto;
  overflow: hidden;
`;
const GridInner = styled.div`
  width: 100%;
`;
const TopContainer = styled.div`
  display: grid;
  grid-template-columns: 80% 20%;
  align-items: center;
  justify-content: center;
  ${breakpoint.m} {
    flex-direction: row;
  }
`;
const ExploreOffersContainer = styled.div`
  background: ${colors.lightGrey};
  padding: 3rem 0 4rem 0;
`;

function Explore({ offers, showoffPage, offersPerPage }: WithAllOffersProps) {
  const navigate = useKeepQueryParamsNavigate();
  const { params, handleChange } = useSearchParams();

  const filterOptions = useMemo(() => {
    // const name = params?.[ExploreQueryParameters.name] || false;
    const sortBy = params?.[ExploreQueryParameters.sortBy] || false;
    let payload = {
      orderDirection: "",
      orderBy: "",
      validFromDate: "",
      validUntilDate: "",
      exchangeOrderBy: "",
      validFromDate_lte: ""
    };

    if (sortBy !== false) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const [orderBy, orderDirection] = sortBy.split(":");
      if (orderBy === "committedDate" || orderBy === "redeemedDate") {
        payload = {
          ...payload,
          orderDirection: orderDirection,
          orderBy: "createdAt",
          exchangeOrderBy: orderBy
        };
      } else if (orderBy === "validFromDate") {
        payload = {
          ...payload,
          orderDirection: orderDirection,
          orderBy: orderBy,
          validFromDate_lte: `${Math.floor(Date.now() / 1000)}`
        };
      } else {
        payload = {
          ...payload,
          orderDirection: orderDirection,
          orderBy: orderBy
        };
      }
    }
    return payload;
  }, [params]);

  const { data, isLoading: collectionsIsLoading } = useCollections({
    ...filterOptions
  });

  const collections = useMemo(() => {
    const filtered = data?.filter((item) => item.offers.length > 0);

    if (filtered && filtered.length > 0) {
      return filtered.slice(0, 4);
    }

    if (data) {
      return data.slice(0, 4);
    }
  }, [data]);

  return (
    <ExploreContainer>
      <LayoutRoot>
        <TopContainer>
          <Typography tag="h2" $fontSize="2.25rem">
            Explore products
          </Typography>
          <Grid justifyContent="flex-end">
            <ExploreSelect params={params} handleChange={handleChange} />
          </Grid>
        </TopContainer>
      </LayoutRoot>
      <ExploreOffersContainer>
        <LayoutRoot>
          {collectionsIsLoading ? (
            <Loading />
          ) : (
            <Grid flexDirection="column" gap="2rem" justifyContent="flex-start">
              <GridInner>
                <ExploreViewMore
                  name="Products"
                  onClick={() => {
                    navigate({
                      pathname: `${BosonRoutes.Products}`,
                      search: qs.stringify(params)
                    });
                  }}
                />
                <ProductGridContainer
                  itemsPerRow={{
                    xs: 1,
                    s: 2,
                    m: 4,
                    l: 4,
                    xl: 4
                  }}
                >
                  {offers &&
                    offers.slice(0, showoffPage)?.map(
                      (offer) =>
                        offer.isValid && (
                          <Fragment key={`ProductCard_${offer?.id}`}>
                            <ProductCard offer={offer} dataTestId="offer" />
                          </Fragment>
                        )
                    )}
                </ProductGridContainer>
              </GridInner>
              <GridInner>
                <ExploreViewMore
                  name="Sellers"
                  onClick={() => {
                    navigate({
                      pathname: `${BosonRoutes.Sellers}`,
                      search: qs.stringify(params)
                    });
                  }}
                />
                <ProductGridContainer
                  itemsPerRow={{
                    xs: 1,
                    s: 2,
                    m: 4,
                    l: 4,
                    xl: 4
                  }}
                >
                  {collections &&
                    collections?.map((collection) => (
                      <Fragment key={`CollectionsCard_${collection?.id}`}>
                        <CollectionsCard collection={collection} />
                      </Fragment>
                    ))}
                </ProductGridContainer>
              </GridInner>
            </Grid>
          )}
        </LayoutRoot>
      </ExploreOffersContainer>
    </ExploreContainer>
  );
}

const ExploreWithAllOffers = WithAllOffers(Explore);

function ExploreWrapper() {
  return <ExploreWithAllOffers />;
}
export default ExploreWrapper;
