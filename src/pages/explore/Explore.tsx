import {
  CollectionsCardSkeleton,
  ProductCardSkeleton
} from "@bosonprotocol/react-kit";
import qs from "query-string";
import { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

import CollectionsCard from "../../components/modal/components/Explore/Collections/CollectionsCard";
import { useSortOffers } from "../../components/price/useSortOffers";
import ProductCard from "../../components/productCard/ProductCard";
import Grid from "../../components/ui/Grid";
import { ExploreQueryParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { Profile } from "../../lib/utils/hooks/lens/graphql/generated";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { ProductGridContainer } from "../profile/ProfilePage.styles";
import ExploreViewMore from "./ExploreViewMore";
import Pagination from "./Pagination";
import {
  ExtendedOffer,
  ExtendedSeller,
  WithAllOffers,
  WithAllOffersProps
} from "./WithAllOffers";

const GridInner = styled.div`
  width: 100%;
`;
function Explore({
  products,
  params,
  handleChange,
  pageOptions,
  filterOptions,
  isLoading
}: WithAllOffersProps) {
  const { itemsPerPage } = pageOptions;
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

  const offerArray = useSortOffers({
    type: "products",
    data: products?.products || [],
    ...filterOptions
  });
  const collections = useSortOffers({
    type: "sellers",
    data: products?.sellers || [],
    ...filterOptions
  });
  const sellerLensProfilePerSellerId = (products?.sellers || []).reduce(
    (map, seller) => {
      if (!map.has(seller.id) && !!seller.lensProfile) {
        map.set(seller.id, seller.lensProfile);
      }
      return map;
    },
    new Map<string, Profile>()
  );

  return (
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
              m: 3,
              l: 4,
              xl: 4
            }}
          >
            {isLoading
              ? new Array(itemsPerPage).fill(0).map((_, index) => {
                  return <ProductCardSkeleton key={index} withBottomText />;
                })
              : offerArray
                  ?.slice(
                    pageOptions.pagination
                      ? (pageIndex || 0) * pageOptions?.itemsPerPage
                      : 0,
                    pageOptions.pagination
                      ? (pageIndex || 0) * pageOptions?.itemsPerPage +
                          pageOptions?.itemsPerPage
                      : pageOptions?.itemsPerPage
                  )
                  ?.map((offer) => (
                    <div
                      key={`ProductCard_${offer?.id}`}
                      id={`offer_${offer?.id}`}
                    >
                      <ProductCard
                        offer={offer as ExtendedOffer}
                        filterOptions={filterOptions}
                        dataTestId="offer"
                        lensProfile={sellerLensProfilePerSellerId.get(
                          offer.seller.id
                        )}
                      />
                    </div>
                  ))}
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
              m: 3,
              l: 4,
              xl: 4
            }}
          >
            {isLoading
              ? new Array(itemsPerPage).fill(0).map((_, index) => {
                  return <CollectionsCardSkeleton key={index} />;
                })
              : collections
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
                    <Fragment
                      key={`CollectionsCard_${
                        collection?.brandName || collection?.id
                      }`}
                    >
                      <CollectionsCard
                        collection={collection as ExtendedSeller}
                        lensProfile={sellerLensProfilePerSellerId.get(
                          collection.id
                        )}
                      />
                    </Fragment>
                  ))}
          </ProductGridContainer>
        </GridInner>
      )}
      {!isLoading && pageOptions.pagination && (
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
          pageCount={Math.ceil(
            ((pageOptions.type.includes("Sellers")
              ? collections?.length
              : offerArray?.length) || 0) / pageOptions.itemsPerPage
          )}
        />
      )}
    </Grid>
  );
}

const ExploreWithAllOffers = WithAllOffers(Explore);

function ExploreWrapper() {
  return <ExploreWithAllOffers />;
}
export default ExploreWrapper;
