import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import OfferList from "../../components/offers/OfferList";
import { UrlParameters } from "../../lib/routing/query-parameters";
import { Offer } from "../../lib/types/offer";
import { useOffers } from "../../lib/utils/hooks/useOffers";

const OFFERS_PER_PAGE = 10;

export default function MyOffers() {
  const { [UrlParameters.accountId]: account } = useParams();

  const [pageIndex, setPageIndex] = useState(0);
  const intersect = useRef(null);
  const [allOffers, setAllOffers] = useState<Offer[]>([]);
  const {
    data: offersWithOneExtra,
    isError,
    isLoading
  } = useOffers({
    voided: false,
    valid: false,
    sellerId: "4",
    filterOutWrongMetadata: false,
    first: OFFERS_PER_PAGE + 1,
    skip: OFFERS_PER_PAGE * pageIndex
  });
  const thereAreMoreOffers =
    (offersWithOneExtra?.length || 0) >= OFFERS_PER_PAGE + 1;

  useEffect(() => {
    if (offersWithOneExtra) {
      const offers = offersWithOneExtra?.slice(0, OFFERS_PER_PAGE);

      setAllOffers([...allOffers, ...offers]);
    }
  }, [offersWithOneExtra]);

  useEffect(() => {
    if (isLoading || !thereAreMoreOffers) {
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
        setPageIndex(pageIndex + 1);
      }
    }, option);
    if (intersect.current) observer.observe(intersect.current);
    return () => observer.disconnect();
  }, [isLoading, thereAreMoreOffers]);

  return (
    <>
      <OfferList offers={allOffers} isError={isError} showSeller={false} />
      <div ref={intersect}></div>
    </>
  );
}
