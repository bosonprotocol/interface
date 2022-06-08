import { useEffect, useReducer, useRef, useState } from "react";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import OfferList from "../../components/offers/OfferList";
import {
  QueryParameters,
  UrlParameters
} from "../../lib/routing/query-parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { footerHeight } from "../../lib/styles/layout";
import { Offer } from "../../lib/types/offer";
import { useOffers } from "../../lib/utils/hooks/useOffers/";
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
  (navigate: ReturnType<typeof useNavigate>) =>
  (
    index: number,
    queryParams: { [x in keyof typeof QueryParameters]: string }
  ): void => {
    const queryParamsUrl = new URLSearchParams(
      Object.entries(queryParams).filter(([, value]) => value !== "")
    ).toString();
    console.log({ index });
    if (index === 0) {
      navigate(generatePath(`${BosonRoutes.Explore}?${queryParamsUrl}`));
    } else {
      navigate(
        generatePath(`${BosonRoutes.ExplorePageByIndex}?${queryParamsUrl}`, {
          [UrlParameters.page]: index + 1 + ""
        })
      );
    }
  };

const OFFERS_PER_PAGE = 10;
const DEFAULT_PAGE = 0;

export default function ExploreOffers({
  brand,
  name,
  exchangeTokenAddress,
  sellerId
}: Props) {
  const params = useParams();
  const navigate = useNavigate();
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
  const [isPageLoaded, setIsPageLoaded] = useReducer(() => true, false);
  console.log({ initialPageIndex });
  useEffect(() => {
    if (isPageLoaded) {
      setPageIndex(initialPageIndex);
    }
    updateUrl(initialPageIndex);
    !isPageLoaded && setIsPageLoaded();
  }, [brand, name, exchangeTokenAddress, sellerId]);

  const useOffersPayload = {
    brand,
    name,
    voided: false,
    valid: true,
    exchangeTokenAddress,
    sellerId,
    filterOutWrongMetadata: true,
    first: OFFERS_PER_PAGE + 1,
    skip: OFFERS_PER_PAGE * pageIndex
  };

  const {
    data: offersWithOneExtra,
    isLoading,
    isError
  } = useOffers(useOffersPayload);

  const { data: firstPageOffers } = useOffers(
    {
      ...useOffersPayload,
      first: 1,
      skip: 0
    },
    {
      enabled: pageIndex > 0 && !offersWithOneExtra?.length
    }
  );
  const offers = offersWithOneExtra?.slice(0, OFFERS_PER_PAGE);

  return (
    <Container>
      <h1>Explore</h1>
      <OfferList
        offers={offers}
        isError={isError}
        isLoading={isLoading}
        action="commit"
      />
      <PaginationWrapper>
        <Pagination
          defaultPage={pageIndex}
          isNextEnabled={
            (offersWithOneExtra?.length || 0) >= OFFERS_PER_PAGE + 1
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
