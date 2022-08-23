import { useState } from "react";

import { useInfiniteOffers } from "../../../lib/utils/hooks/offers/useInfiniteOffers";
import Loading from "../../ui/Loading";
import SellerTags from "../SellerTags";
import SellerFilters from "./SellerFilters";
import SellerTable from "./SellerTable";

const productTags = [
  {
    label: "All",
    value: "all"
  },
  {
    label: "Phygital",
    value: "phygital"
  },
  {
    label: "Physical",
    value: "physical"
  },
  {
    label: "Expired",
    value: "expired"
  },
  {
    label: "Voided",
    value: "voided"
  }
];

interface Props {
  sellerId: string;
}

export default function SellerProducts({ sellerId }: Props) {
  const [currentTag, setCurrentTag] = useState(productTags[0].value);

  const { data, isLoading, isError } = useInfiniteOffers(
    {
      voided: false,
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

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <SellerTags
        tags={productTags}
        currentTag={currentTag}
        setCurrentTag={setCurrentTag}
      />
      <SellerFilters />
      <SellerTable
        offers={
          data?.pages?.flatMap((page: any) => {
            return page;
          }) || []
        }
        isLoading={isLoading}
        isError={isError}
      />
    </>
  );
}
