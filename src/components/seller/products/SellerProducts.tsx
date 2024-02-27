import { offers } from "@bosonprotocol/react-kit";
import { LoadingMessage } from "components/loading/LoadingMessage";
import dayjs from "dayjs";
import { NO_EXPIRATION } from "lib/constants/offer";
import { formatDate } from "lib/utils/date";
import map from "lodash/map";
import uniqBy from "lodash/uniqBy";
import { useMemo, useState } from "react";

import { Offer } from "../../../lib/types/offer";
import { calcPrice } from "../../../lib/utils/calcPrice";
import { getDateTimestamp } from "../../../lib/utils/getDateTimestamp";
import { useSellers } from "../../../lib/utils/hooks/useSellers";
import { ExtendedOffer } from "../../../pages/explore/WithAllOffers";
import { UpdateIcon } from "../../ui/UpdateIcon";
import { WithSellerDataProps } from "../common/WithSellerData";
import SellerAddNewProduct from "../SellerAddNewProduct";
import SellerBatchVoid from "../SellerBatchVoid";
import SellerExport from "../SellerExport";
import SellerFilters from "../SellerFilters";
import { SellerInsideProps } from "../SellerInside";
import SellerTags from "../SellerTags";
import SellerProductsTable, {
  SellerProductsTableProps
} from "./SellerProductsTable";

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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const emptyArray: any[] = [];
export default function SellerProducts({
  products: productsData,
  sellerRoles,
  sellerId,
  offersBacked,
  columnsToShow
}: SellerInsideProps &
  WithSellerDataProps &
  Pick<SellerProductsTableProps, "columnsToShow">) {
  const {
    data: sellers,
    isLoading: isLoadingSellers,
    refetch: refetchSellers,
    isRefetching: isSellersRefetching
  } = useSellers(
    {
      id: sellerId
    },
    { enabled: !!sellerId }
  );
  const salesChannels = sellers?.[0]?.metadata?.salesChannels ?? emptyArray;
  const [currentTag, setCurrentTag] = useState(productTags[0].value);
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<FilterValue | null>(null);
  const [selected, setSelected] = useState<Array<Offer | null>>([]);

  const { products, isLoading, isError, refetch } = productsData;

  const allOffers = useMemo(() => {
    const allOffers =
      products?.filter((product) => product.seller.id === sellerId) || [];

    const filtered =
      allOffers?.map((offer) => {
        const status = offers.getOfferStatus(offer);

        if (currentTag === "physical") {
          return offer.metadata?.__typename === "ProductV1MetadataEntity"
            ? offer
            : null;
        }
        if (currentTag === "phygital") {
          return offer.metadata?.__typename === "BundleMetadataEntity"
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
            !!n.metadata?.name.toLowerCase().includes(search.toLowerCase()))
        );
      });
    }

    return filtered.filter((n): boolean => {
      return n !== null;
    });
  }, [products, search, sellerId, currentTag]);

  const prepareCSVData = useMemo(() => {
    const allOffersWithVariants = allOffers.reduce((acc, elem) => {
      if (elem?.additional?.variants.length) {
        elem.additional.variants.forEach((variant) => {
          acc.push(variant as ExtendedOffer);
        });
      }
      if (elem) {
        acc.push(elem);
      }
      return acc;
    }, [] as ExtendedOffer[]);
    const csvData = map(uniqBy(allOffersWithVariants, "id"), (offer) => {
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
          ? formatDate(getDateTimestamp(offer.validUntilDate), {
              textIfTooBig: NO_EXPIRATION
            })
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
        <UpdateIcon
          size={15}
          onClick={async () => {
            await refetch();
            await refetchSellers();
          }}
        />
      </>
    );
  }, [prepareCSVData, selected, refetch, sellerRoles, refetchSellers]);
  const anyLoading = isLoading || isLoadingSellers;
  if (anyLoading) {
    return <LoadingMessage />;
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
        currentTag={currentTag}
        offers={allOffers}
        isLoading={anyLoading}
        isSellersRefetching={isSellersRefetching}
        isError={isError}
        refetch={refetch}
        setSelected={setSelected}
        sellerRoles={sellerRoles}
        offersBacked={offersBacked}
        columnsToShow={columnsToShow}
        salesChannels={salesChannels}
        refetchSellers={refetchSellers}
        sellerId={sellerId}
      />
    </>
  );
}
