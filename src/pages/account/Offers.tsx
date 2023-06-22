import { useEffect, useRef, useState } from "react";

import { Action } from "../../components/offer/OfferCard";
import OfferList from "../../components/offers/OfferList";
import { useInfiniteOffers } from "../../lib/utils/hooks/offers/useInfiniteOffers";

const OFFERS_PER_PAGE = 10;

interface Props {
  sellerId: string;
  action: Action;
  showInvalidOffers: boolean;
  isPrivateProfile: boolean;
}

export default function Offers({
  sellerId,
  action,
  showInvalidOffers,
  isPrivateProfile
}: Props) {
  const [pageIndex, setPageIndex] = useState(0);
  const intersect = useRef(null);
  const { data, isError, isLoading, isFetchingNextPage, fetchNextPage } =
    useInfiniteOffers(
      {
        voided: false,
        valid: !showInvalidOffers,
        sellerId,
        first: OFFERS_PER_PAGE + 1,
        orderBy: "createdAt",
        orderDirection: "desc"
      },
      {
        enabled: !!sellerId,
        keepPreviousData: true
      }
    );
  const offersWithOneExtra = data?.pages[data.pages.length - 1];
  const allOffers =
    data?.pages.flatMap((page) => {
      const allButLast =
        page.length === OFFERS_PER_PAGE + 1
          ? page.slice(0, page.length - 1)
          : page;
      return allButLast;
    }) || [];
  const thereAreMoreOffers =
    (offersWithOneExtra?.length || 0) >= OFFERS_PER_PAGE + 1;

  useEffect(() => {
    if (isLoading || !thereAreMoreOffers || isFetchingNextPage) {
      return;
    }
    const option = {
      root: null,
      rootMargin: "2000px 0px 0px 0px",
      threshold: 0
    };
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        const nextPageIndex = pageIndex + 1;
        setPageIndex(nextPageIndex);
        fetchNextPage({ pageParam: nextPageIndex * OFFERS_PER_PAGE });
      }
    }, option);
    if (intersect.current) observer.observe(intersect.current);
    return () => observer.disconnect();
  }, [
    isLoading,
    thereAreMoreOffers,
    fetchNextPage,
    pageIndex,
    isFetchingNextPage
  ]);

  return (
    <>
      <OfferList
        offers={allOffers}
        isError={isError}
        showSeller={false}
        action={action}
        showInvalidOffers={showInvalidOffers}
        isPrivateProfile={isPrivateProfile}
        itemsPerRow={{
          xs: 1,
          s: 2,
          m: 3,
          l: 4,
          xl: 4
        }}
      />
      <div ref={intersect}></div>
    </>
  );
}
