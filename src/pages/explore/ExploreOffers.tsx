import OfferList from "@components/offers/OfferList";
import { QueryParameters, UrlParameters } from "@lib/routing/query-parameters";
import { BosonRoutes } from "@lib/routing/routes";
import { footerHeight } from "@lib/styles/layout";
import { Offer } from "@lib/types/offer";
import { useOffers } from "@lib/utils/hooks/useOffers/";
import { useEffect, useRef, useState } from "react";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

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
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count >= 1) {
      setPageIndex(DEFAULT_PAGE);
      updateUrl(DEFAULT_PAGE);
    }
    count === 0 && setCount(count + 1);
  }, [brand, name, exchangeTokenAddress, sellerId]);

  const {
    data: offersWithOneExtra,
    isLoading,
    isError
  } = useOffers({
    brand,
    name,
    voided: false,
    valid: true,
    exchangeTokenAddress,
    sellerId,
    filterOutWrongMetadata: true,
    first: OFFERS_PER_PAGE + 1,
    skip: OFFERS_PER_PAGE * pageIndex
  });
  const offers = offersWithOneExtra?.slice(0, OFFERS_PER_PAGE);

  const ref = useRef<HTMLDivElement>(null);

  return (
    <Container ref={ref}>
      <h1>Explore</h1>
      <OfferList offers={offers} isError={isError} isLoading={isLoading} />
      <PaginationWrapper>
        <Pagination
          defaultPage={pageIndex}
          hasMoreItems={
            (offersWithOneExtra?.length || 0) >= OFFERS_PER_PAGE + 1
          }
          onChangeIndex={(index) => {
            setPageIndex(index);
            updateUrl(index);
          }}
        />
      </PaginationWrapper>
    </Container>
  );
}
