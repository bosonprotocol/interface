import { offers } from "@bosonprotocol/react-kit";
import dayjs from "dayjs";
import { BigNumber, utils } from "ethers";
import map from "lodash/map";
import { useMemo, useState } from "react";

import { CONFIG } from "../../../lib/config";
import { Offer } from "../../../lib/types/offer";
import { getDateTimestamp } from "../../../lib/utils/getDateTimestamp";
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
interface FilterValue {
  value: string;
  label: string;
}

export default function SellerProducts({ sellerId }: Props) {
  const [currentTag, setCurrentTag] = useState(productTags[0].value);
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<FilterValue | null>(null);

  const { data, isLoading, isError } = useInfiniteOffers(
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
          (n.id.includes(search) || n.metadata.name.includes(search))
        );
      });
    }

    return filtered.filter((n): boolean => {
      return n !== null;
    });
  }, [data, search, currentTag]);

  const prepareCSVData = useMemo(() => {
    const csvData = map(allOffers, (offer) => {
      const price = (value: string, decimals: string) => {
        try {
          return utils.formatUnits(BigNumber.from(value), Number(decimals));
        } catch (e) {
          console.error(e);
          return "";
        }
      };
      return {
        ["ID/SKU"]: offer?.id ? ("0000" + offer.id).slice(-4) : "",
        ["Product name"]: offer?.metadata?.name ?? "",
        ["Status"]: offer ? offers.getOfferStatus(offer) : "",
        ["Quantity"]:
          offer?.quantityAvailable && offer?.quantityInitial
            ? `${offer.quantityAvailable} / ${offer.quantityInitial}`
            : "",
        ["Price"]:
          offer?.price && offer?.exchangeToken?.decimals
            ? price(offer.price, offer.exchangeToken.decimals)
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
    return (
      <>
        <SellerExport
          csvProps={{
            data: prepareCSVData,
            filename: "products"
          }}
        />
        <SellerAddNewProduct />
      </>
    );
  }, [prepareCSVData]);

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
