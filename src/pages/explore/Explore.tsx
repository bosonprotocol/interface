import qs from "query-string";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

import CollectionsCard from "../../components/modal/components/Explore/Collections/CollectionsCard";
import { useSortByPrice } from "../../components/price/useSortByPrice";
import ProductCard from "../../components/productCard/ProductCard";
import Grid from "../../components/ui/Grid";
import Loading from "../../components/ui/Loading";
import { ExploreQueryParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { useCollections } from "../../lib/utils/hooks/useCollections";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { ProductGridContainer } from "../profile/ProfilePage.styles";
import ExploreViewMore from "./ExploreViewMore";
import Pagination from "./Pagination";
import { WithAllOffers, WithAllOffersProps } from "./WithAllOffers";

const GridInner = styled.div`
  width: 100%;
`;
function Explore({
  offers,
  params,
  handleChange,
  pageOptions,
  filterOptions
}: WithAllOffersProps) {
  console.log("🚀  roberto --  ~ file: Explore.tsx ~ line 30 ~ params", params);
  console.log(
    "🚀  roberto --  ~ file: Explore.tsx ~ line 30 ~ filterOptions",
    filterOptions
  );
  const location = useLocation();
  const navigate = useKeepQueryParamsNavigate();
  const [pageIndex, setPageIndex] = useState<number | null>(
    Number(params?.page || 0)
  );

  useEffect(() => {
    if (pageIndex !== null) {
      window.scroll({ top: 0, behavior: "smooth" });
      handleChange(ExploreQueryParameters.page, pageIndex.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex]);

  // const sellerCurationList = filterOptions?.sellerCurationList?.split(",");
  // console.log(
  //   "🚀  roberto --  ~ file: useCollections.ts ~ line 38 ~ sample",
  //   sellerCurationList
  // );

  const { data, isLoading: collectionsIsLoading } = useCollections(
    { ...filterOptions },
    {
      enabled: !!filterOptions?.orderBy
    }
  );
  console.log("🚀  roberto --  ~ file: Explore.tsx ~ line 45 ~ data", data);

  const collections = useMemo(() => {
    const filtered = data?.filter((item) => item.offers.length > 0);

    if (filtered && filtered.length > 0) {
      return filtered;
    }

    return data;
  }, [data]);

  const offerArray = useSortByPrice({ offers, ...filterOptions });

  return (
    <>
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
                  setPageIndex(0);
                  navigate({
                    pathname: `${BosonRoutes.Products}`,
                    search: qs.stringify({ ...params, page: 0 })
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
                        ? (pageIndex || 0) * pageOptions?.itemsPerPage
                        : 0,
                      pageOptions.pagination
                        ? (pageIndex || 0) * pageOptions?.itemsPerPage +
                            pageOptions?.itemsPerPage
                        : pageOptions?.itemsPerPage
                    )
                    ?.map(
                      (offer) =>
                        offer.isValid && (
                          <div
                            key={`ProductCard_${offer?.id}`}
                            id={`offer_${offer.id}`}
                          >
                            <ProductCard offer={offer} dataTestId="offer" />
                          </div>
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
                  setPageIndex(0);
                  navigate({
                    pathname: `${BosonRoutes.Sellers}`,
                    search: qs.stringify({ ...params, page: 0 })
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
                        ? (pageIndex || 0) * pageOptions?.itemsPerPage
                        : 0,
                      pageOptions.pagination
                        ? (pageIndex || 0) * pageOptions?.itemsPerPage +
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
              defaultPage={pageIndex || 0}
              isNextEnabled={
                ((pageOptions.type.includes("Sellers")
                  ? collections?.length
                  : offerArray?.length) || 0) >=
                pageOptions.itemsPerPage * ((pageIndex || 0) + 1) + 1
              }
              isPreviousEnabled={
                ((pageOptions.type.includes("Sellers")
                  ? collections?.length
                  : offerArray?.length) || 0) > 0
              }
              onChangeIndex={(index: number) => {
                setPageIndex(index);
              }}
            />
          )}
        </Grid>
      )}
    </>
  );
}

const ExploreWithAllOffers = WithAllOffers(Explore);

function ExploreWrapper() {
  return <ExploreWithAllOffers />;
}
export default ExploreWrapper;
