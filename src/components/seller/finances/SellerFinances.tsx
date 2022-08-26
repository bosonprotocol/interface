import { useMemo } from "react";

import { Offer } from "../../../lib/types/offer";
import { useInfiniteOffers } from "../../../lib/utils/hooks/offers/useInfiniteOffers";
import Loading from "../../ui/Loading";
import SellerFinancesTable from "./SellerFinancesTable";

interface Props {
  sellerId: string;
}

export default function SellerFinances({ sellerId }: Props) {
  const { data, isLoading, isError, refetch } = useInfiniteOffers(
    {
      sellerId,
      first: 1000,
      orderBy: "createdAt",
      orderDirection: "desc"
    },
    {
      enabled: !!sellerId,
      keepPreviousData: true
    }
  );

  const allOffers = useMemo(() => {
    const filtered =
      data?.pages.flat()?.map((offer: Offer) => {
        return offer;
      }) || [];

    return filtered.filter((n): boolean => {
      return n !== null;
    });
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <SellerFinancesTable
        offers={allOffers}
        isLoading={isLoading}
        isError={isError}
        refetch={refetch}
      />
    </>
  );
}
