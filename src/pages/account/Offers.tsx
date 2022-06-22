import { useEffect, useRef, useState } from "react";

import { Action } from "../../components/offer/OfferCard";
import OfferList from "../../components/offers/OfferList";
import { Offer } from "../../lib/types/offer";
import { useOffers } from "../../lib/utils/hooks/useOffers";

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
  const [allOffers, setAllOffers] = useState<Offer[]>([]);
  const {
    data: offersWithOneExtra,
    isError,
    isLoading
  } = useOffers(
    {
      voided: false,
      valid: !showInvalidOffers,
      sellerId,
      first: OFFERS_PER_PAGE + 1,
      skip: OFFERS_PER_PAGE * pageIndex
    },
    {
      enabled: !!sellerId
    }
  );
  const thereAreMoreOffers =
    (offersWithOneExtra?.length || 0) >= OFFERS_PER_PAGE + 1;

  useEffect(() => {
    if (offersWithOneExtra) {
      const offers = offersWithOneExtra.slice(0, OFFERS_PER_PAGE);

      setAllOffers([...allOffers, ...offers]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  }, [isLoading, thereAreMoreOffers, pageIndex]);

  return (
    <>
      <OfferList
        offers={allOffers}
        isError={isError}
        showSeller={false}
        action={action}
        showInvalidOffers={showInvalidOffers}
        isPrivateProfile={isPrivateProfile}
      />
      <div ref={intersect}></div>
    </>
  );
}
