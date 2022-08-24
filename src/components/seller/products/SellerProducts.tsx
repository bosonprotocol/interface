import { offers } from "@bosonprotocol/react-kit";
import { useMemo, useState } from "react";

import { Offer } from "../../../lib/types/offer";
import { useInfiniteOffers } from "../../../lib/utils/hooks/offers/useInfiniteOffers";
import Loading from "../../ui/Loading";
import SellerAddNewProduct from "../SellerAddNewProduct";
import SellerExport from "../SellerExport";
import SellerFilters from "../SellerFilters";
import SellerTags from "../SellerTags";
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
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<string>("");

  console.log(search, "search");
  console.log(filter, "filter");

  const filterButton = useMemo(() => {
    return (
      <>
        <SellerExport />
        <SellerAddNewProduct />
      </>
    );
  }, []);

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

  const allOffers = useMemo(() => {
    const filtered =
      data?.pages.flat()?.map((offer: Offer) => {
        const status = offers.getOfferStatus(offer);

        if (currentTag === "physical") {
          return offer?.metadata?.product?.offerCategory === "PHYSICAL"
            ? offer
            : null;
        }
        if (currentTag === "phygital") {
          return offer?.metadata?.product?.offerCategory === "PHYGITAL"
            ? offer
            : null;
        }
        if (currentTag === "expired") {
          return status === offers.OfferState.EXPIRED ? offer : null;
        }
        if (currentTag === "voided") {
          return status === offers.OfferState.VOIDED ? offer : null;
        }
        return offer;
      }) || [];
    return filtered.filter((n): boolean => {
      return n !== null;
    });
  }, [data, currentTag]);

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
      <SellerFilters
        setSearch={setSearch}
        search={search}
        filter={filter}
        setFilter={setFilter}
        buttons={filterButton}
      />
      <SellerTable offers={allOffers} isLoading={isLoading} isError={isError} />
    </>
  );
}
