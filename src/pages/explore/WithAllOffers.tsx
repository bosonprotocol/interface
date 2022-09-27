import React, { useEffect, useState } from "react";
import styled from "styled-components";

import Loading from "../../components/ui/Loading";
import { Offer } from "../../lib/types/offer";
import { useInfiniteOffers } from "../../lib/utils/hooks/offers/useInfiniteOffers";

export const Wrapper = styled.div`
  text-align: center;
`;

export interface WithAllOffersProps {
  offers?: Offer[];
  isLoading?: boolean;
  isError?: any;
  showoffPage?: number;
  offersPerPage?: number;
}
const DEFAULT_PAGE = 0;
const OFFERS_PER_PAGE = 999;
export function WithAllOffers<P>(
  WrappedComponent: React.ComponentType<WithAllOffersProps>
) {
  const ComponentWithAllOffers = (props: P) => {
    const [allOffers, setAllOffers] = useState<any>([]);
    const [pageIndex, setPageIndex] = useState(DEFAULT_PAGE);

    const { data, isLoading, isError, isFetchingNextPage, fetchNextPage } =
      useInfiniteOffers(
        {
          first: OFFERS_PER_PAGE + 1
        },
        {
          keepPreviousData: true
        }
      );
    const offersWithOneExtra = data?.pages[data.pages.length - 1];
    const thereAreMoreOffers =
      (offersWithOneExtra?.length || 0) >= OFFERS_PER_PAGE + 1;

    useEffect(() => {
      if (isLoading || !thereAreMoreOffers || isFetchingNextPage) {
        return;
      } else {
        const nextPageIndex = pageIndex + 1;
        setPageIndex(nextPageIndex);
        fetchNextPage({ pageParam: nextPageIndex * OFFERS_PER_PAGE });
      }
    }, [
      isLoading,
      thereAreMoreOffers,
      fetchNextPage,
      pageIndex,
      isFetchingNextPage
    ]);

    useEffect(() => {
      if (thereAreMoreOffers === false) {
        const allOffers =
          data?.pages.flatMap((page) => {
            const allButLast =
              page.length === OFFERS_PER_PAGE + 1
                ? page.slice(0, page.length - 1)
                : page;
            return allButLast;
          }) || [];
        setAllOffers(allOffers);
      }
    }, [thereAreMoreOffers]); // eslint-disable-line

    const allProps = {
      isLoading: isLoading || thereAreMoreOffers || isFetchingNextPage,
      isError,
      showoffPage: 4,
      offersPerPage: 10
    };

    if (isLoading || thereAreMoreOffers || isFetchingNextPage) {
      return (
        <Wrapper>
          <Loading />
        </Wrapper>
      );
    }
    return <WrappedComponent {...props} {...allProps} offers={allOffers} />;
  };
  return ComponentWithAllOffers;
}
