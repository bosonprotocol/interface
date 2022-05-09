import OfferList from "@components/offers/OfferList";
import { UrlParameters } from "@lib/routing/query-parameters";
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
}

const OFFERS_PER_PAGE = 15;
const DEFAULT_PAGE = 0;

export default function ExploreOffers({
  brand,
  name,
  exchangeTokenAddress
}: Props) {
  const params = useParams();
  const navigate = useNavigate();
  const initialPageIndex = Math.max(
    0,
    params[UrlParameters.page]
      ? Number(params[UrlParameters.page]) - 1
      : DEFAULT_PAGE
  );
  const [pageIndex, setPageIndex] = useState(initialPageIndex);

  const {
    data: offers,
    isLoading,
    isError
  } = useOffers({
    brand,
    name,
    voided: false,
    valid: true,
    exchangeTokenAddress,
    filterOutWrongMetadata: true,
    first: OFFERS_PER_PAGE,
    skip: OFFERS_PER_PAGE * pageIndex
  });

  const ref = useRef<HTMLDivElement>(null);

  return (
    <Container ref={ref}>
      <h1>Explore</h1>
      <OfferList offers={offers} isError={isError} isLoading={isLoading} />
      <PaginationWrapper>
        <Pagination
          defaultPage={pageIndex}
          itemsLength={offers?.length || 0}
          itemsPerPage={OFFERS_PER_PAGE}
          onChangeIndex={(index) => {
            setPageIndex(index);

            if (index === 0) {
              navigate(generatePath(BosonRoutes.Explore));
            } else {
              navigate(
                generatePath(BosonRoutes.ExplorePagePage, {
                  [UrlParameters.page]: index + 1 + ""
                })
              );
            }
          }}
        />
      </PaginationWrapper>
    </Container>
  );
}
