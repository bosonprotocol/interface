import { offers } from "@bosonprotocol/react-kit";
import dayjs from "dayjs";
import map from "lodash/map";
import { useMemo, useState } from "react";

import { CONFIG } from "../../../lib/config";
import { Offer } from "../../../lib/types/offer";
import { calcPrice } from "../../../lib/utils/calcPrice";
import { getDateTimestamp } from "../../../lib/utils/getDateTimestamp";
import Loading from "../../ui/Loading";
import { WithSellerDataProps } from "../common/WithSellerData";
import SellerAddNewProduct from "../SellerAddNewProduct";
import SellerBatchVoid from "../SellerBatchVoid";
import SellerExport from "../SellerExport";
import SellerFilters from "../SellerFilters";
import { SellerInsideProps } from "../SellerInside";
import SellerTags from "../SellerTags";
import SellerProductsTable from "./SellerProductsTable";

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

interface FilterValue {
  value: string;
  label: string;
}

export default function SellerProducts({
  // offers: offersData,
  products: productsData,
  sellerRoles,
  sellerId
}: SellerInsideProps & WithSellerDataProps) {
  const [currentTag, setCurrentTag] = useState(productTags[0].value);
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<FilterValue | null>(null);
  const [selected, setSelected] = useState<Array<Offer | null>>([]);

  // const { data, isLoading, isError, refetch } = offersData;
  const { products, isLoading, isError, refetch } = productsData;

  // console.log({
  //   data,
  //   // products,
  //   sellers,
  //   sellerId,
  //   newOffers
  // });

  const allOffers = useMemo(() => {
    const filtered =
      products
        .filter((product) => product.seller.id === sellerId)
        ?.map((offer) => {
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

    if (search && search.length > 0) {
      return filtered.filter((n): boolean => {
        return (
          n !== null &&
          (n.id.includes(search) ||
            n.metadata.name.toLowerCase().includes(search.toLowerCase()))
        );
      });
    }

    return filtered.filter((n): boolean => {
      return n !== null;
    });
  }, [products, search, sellerId, currentTag]);

  const prepareCSVData = useMemo(() => {
    const csvData = map(allOffers, (offer) => {
      return {
        ["ID/SKU"]: offer?.id ? offer?.id : "",
        ["Product name"]: offer?.metadata?.name ?? "",
        ["Status"]: offer ? offers.getOfferStatus(offer) : "",
        ["Remaining Quantity"]: offer?.quantityAvailable ?? "",
        ["Initial Quantity"]: offer?.quantityInitial ?? "",
        ["Price"]:
          offer?.price && offer?.exchangeToken?.decimals
            ? calcPrice(offer.price, offer.exchangeToken.decimals)
            : "",
        ["Token"]: offer?.exchangeToken?.symbol ?? "",
        ["Offer validity"]: offer?.validUntilDate
          ? dayjs(getDateTimestamp(offer.validUntilDate)).format(
              CONFIG.dateFormat
            )
          : ""
      };
    });
    return csvData;
  }, [allOffers]);

  const filterButton = useMemo(() => {
    const dateString = dayjs().format("YYYYMMDD");

    return (
      <>
        {selected.length > 0 && (
          <SellerBatchVoid
            selected={selected}
            refetch={refetch}
            sellerRoles={sellerRoles}
          />
        )}
        <SellerExport
          csvProps={{
            data: prepareCSVData,
            filename: `products-${dateString}`
          }}
        />
        <SellerAddNewProduct sellerRoles={sellerRoles} />
      </>
    );
  }, [prepareCSVData, selected, refetch, sellerRoles]);

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
      <SellerProductsTable
        offers={allOffers}
        isLoading={isLoading}
        isError={isError}
        refetch={refetch}
        setSelected={setSelected}
        sellerRoles={sellerRoles}
      />
    </>
  );
}
