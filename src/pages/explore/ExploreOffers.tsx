import { useEffect, useState } from "react";
import { generatePath, useParams } from "react-router-dom";
import styled from "styled-components";

import OfferList from "../../components/offers/OfferList";
import {
  QueryParameters,
  UrlParameters
} from "../../lib/routing/query-parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { footerHeight } from "../../lib/styles/layout";
import { Offer } from "../../lib/types/offer";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { useOffers } from "../../lib/utils/hooks/useOffers/";
import { usePrevious } from "../../lib/utils/hooks/usePrevious";
import Pagination from "./Pagination";

const Container = styled.div`
  margin-top: 10px;
`;

const PaginationWrapper = styled.div`
  position: absolute;
  bottom: calc(${footerHeight} + 80px);
  left: 50%;
  transform: translate(-50%, 0);
`;

interface Props {
  name?: string;
  brand?: string;
  exchangeTokenAddress?: Offer["exchangeToken"]["address"];
  sellerId?: Offer["seller"]["id"];
}

const updatePageIndexInUrl =
  (navigate: ReturnType<typeof useKeepQueryParamsNavigate>) =>
  (
    index: number,
    queryParams: { [x in keyof typeof QueryParameters]: string }
  ): void => {
    const queryParamsUrl = new URLSearchParams(
      Object.entries(queryParams).filter(([, value]) => value !== "")
    ).toString();
    if (index === 0) {
      navigate({
        pathname: BosonRoutes.Explore,
        search: queryParamsUrl
      });
    } else {
      navigate({
        pathname: generatePath(BosonRoutes.ExplorePageByIndex, {
          [UrlParameters.page]: index + 1 + ""
        }),
        search: queryParamsUrl
      });
    }
  };

const OFFERS_PER_PAGE = 10;
const DEFAULT_PAGE = 0;

export default function ExploreOffers(props: Props) {
  const { brand, name, exchangeTokenAddress, sellerId } = props;
  const params = useParams();
  const navigate = useKeepQueryParamsNavigate();
  const updateUrl = (index: number) =>
    updatePageIndexInUrl(navigate)(index, {
      name: name ?? "",
      currency: exchangeTokenAddress ?? "",
      seller: sellerId ?? ""
    });
  const initialPageIndex = Math.max(
    0,
    params[UrlParameters.page]
      ? Number(params[UrlParameters.page]) - 1
      : DEFAULT_PAGE
  );
  const [pageIndex, setPageIndex] = useState(initialPageIndex);

  const useOffersPayload = {
    brand,
    name,
    voided: false,
    valid: true,
    exchangeTokenAddress,
    sellerId,
    // TODO: comment this out once we can request offers with valid metadata directly as requesting 1 extra offer should be enough
    // first: OFFERS_PER_PAGE + 1,
    first: OFFERS_PER_PAGE * 2,
    skip: OFFERS_PER_PAGE * pageIndex
  };
  const {
    data: currentAndNextPageOffers,
    isLoading,
    isError,
    isFetched
  } = useOffers(useOffersPayload);

  const prevProps = usePrevious(props);

  useEffect(() => {
    if (isFetched && !currentAndNextPageOffers?.length) {
      /**
       * if you go directly to a page without any offers,
       * you'll be redirected to the first page
       */
      setPageIndex(DEFAULT_PAGE);
      updateUrl(DEFAULT_PAGE);
    }
  }, [currentAndNextPageOffers, isFetched]);

  useEffect(() => {
    /**
     * if the filters change, you should be redirected to the first page
     */
    if (prevProps) {
      setPageIndex(DEFAULT_PAGE);
      updateUrl(DEFAULT_PAGE);
    }
  }, [brand, name, exchangeTokenAddress, sellerId]);
  const { data: firstPageOffers } = useOffers(
    {
      ...useOffersPayload
      // TODO: 1 offer should be enough once we can request offers with valid metadata directly
      // first: 1,
      // skip: 0
    },
    {
      enabled: pageIndex > 0 && !currentAndNextPageOffers?.length
    }
  );
  const offers = currentAndNextPageOffers?.slice(0, OFFERS_PER_PAGE);

  return (
    <Container>
      <h1>Explore</h1>
      <OfferList
        offers={offers}
        isError={isError}
        isLoading={isLoading}
        action="commit"
        showInvalidOffers={false}
      />
      <PaginationWrapper>
        <Pagination
          defaultPage={pageIndex}
          isNextEnabled={
            (currentAndNextPageOffers?.length || 0) >= OFFERS_PER_PAGE + 1
          }
          isPreviousEnabled={(firstPageOffers?.length || 0) > 0}
          onChangeIndex={(index) => {
            setPageIndex(index);
            updateUrl(index);
          }}
        />
      </PaginationWrapper>
    </Container>
  );
}
