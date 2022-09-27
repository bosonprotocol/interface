import qs from "query-string";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

import { LayoutRoot } from "../../components/Layout";
import CollectionsCard from "../../components/modal/components/Explore/Collections/CollectionsCard";
import { useSortByPrice } from "../../components/price/useSortByPrice";
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
import Pagination from "./Pagination";
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

function Explore({ offers, ...rest }: WithAllOffersProps) {
  const location = useLocation();
  const navigate = useKeepQueryParamsNavigate();
  const { params, handleChange } = useSearchParams();
  const [pageIndex, setPageIndex] = useState<number>(Number(params?.page || 0));

  useEffect(() => {
    window.scroll({ top: 0, behavior: "smooth" });
    handleChange(ExploreQueryParameters.page, pageIndex.toString());
  }, [pageIndex, handleChange]);

  const pageOptions = useMemo(() => {
    let options = {
      pagination: true,
      itemsPerPage: rest?.offersPerPage || 10,
      type: ["Sellers", "Products"]
    };
    if (location?.pathname === BosonRoutes.Explore) {
      options = {
        ...options,
        pagination: false,
        itemsPerPage: rest?.showoffPage || 4
      };
    }
    if (location?.pathname === BosonRoutes.Products) {
      options = {
        ...options,
        type: ["Products"]
      };
    }
    if (location?.pathname === BosonRoutes.Sellers) {
      options = {
        ...options,
        type: ["Sellers"]
      };
    }

    return options;
  }, [location.pathname, rest]); // eslint-disable-line

  const filterOptions = useMemo(() => {
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
      return filtered;
    }

    return data;
  }, [data]);

  const { offerArray } = useSortByPrice({
    offers,
    isSortable: true,
    ...filterOptions
  });
  console.log("TEST", offers, offerArray);
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
              {pageOptions.type.includes("Products") && (
                <GridInner>
                  <ExploreViewMore
                    name="Products"
                    url={BosonRoutes.Products}
                    onClick={() => {
                      navigate({
                        pathname: `${BosonRoutes.Products}`,
                        search: qs.stringify(params)
                      });
                    }}
                    showMore={location?.pathname === BosonRoutes.Explore}
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
                    {offerArray &&
                      offerArray
                        ?.slice(
                          pageOptions.pagination
                            ? pageIndex * pageOptions?.itemsPerPage
                            : 0,
                          pageOptions.pagination
                            ? pageIndex * pageOptions?.itemsPerPage +
                                pageOptions?.itemsPerPage
                            : pageOptions?.itemsPerPage
                        )
                        ?.map(
                          (offer) =>
                            offer.isValid && (
                              <Fragment key={`ProductCard_${offer?.id}`}>
                                <ProductCard offer={offer} dataTestId="offer" />
                              </Fragment>
                            )
                        )}
                  </ProductGridContainer>
                </GridInner>
              )}
              {pageOptions.type.includes("Sellers") && (
                <GridInner>
                  <ExploreViewMore
                    name="Sellers"
                    url={BosonRoutes.Sellers}
                    onClick={() => {
                      navigate({
                        pathname: `${BosonRoutes.Sellers}`,
                        search: qs.stringify(params)
                      });
                    }}
                    showMore={location?.pathname === BosonRoutes.Explore}
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
                      collections
                        ?.slice(
                          pageOptions.pagination
                            ? pageIndex * pageOptions?.itemsPerPage
                            : 0,
                          pageOptions.pagination
                            ? pageIndex * pageOptions?.itemsPerPage +
                                pageOptions?.itemsPerPage
                            : pageOptions?.itemsPerPage
                        )
                        ?.map((collection) => (
                          <Fragment key={`CollectionsCard_${collection?.id}`}>
                            <CollectionsCard collection={collection} />
                          </Fragment>
                        ))}
                  </ProductGridContainer>
                </GridInner>
              )}
              {pageOptions.pagination && (
                <Pagination
                  defaultPage={pageIndex}
                  // TODO: add proper values based on real props
                  isNextEnabled={true}
                  isPreviousEnabled={true}
                  onChangeIndex={(index: number) => {
                    setPageIndex(index);
                  }}
                />
              )}
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
