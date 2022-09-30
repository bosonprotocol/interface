import { exchanges as ExchangesKit, subgraph } from "@bosonprotocol/react-kit";
import dayjs from "dayjs";
import { BigNumber, utils } from "ethers";
import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import { CONFIG } from "../../../lib/config";
import { getDateTimestamp } from "../../../lib/utils/getDateTimestamp";
import { Exchange } from "../../../lib/utils/hooks/useExchanges";
import ExportDropdown from "../../ui/ExportDropdown";
import Loading from "../../ui/Loading";
import { WithSellerDataProps } from "../common/WithSellerData";
import SellerBatchComplete from "../SellerBatchComplete";
import SellerFilters from "../SellerFilters";
import { SellerInsideProps } from "../SellerInside";
import SellerTags from "../SellerTags";
import SellerExchangeTable from "./SellerExchangeTable";

const productTags = [
  {
    label: "All",
    value: "all"
  },
  {
    label: "Live rNFTs",
    value: "live-rnfts"
  },
  {
    label: "Redemptions",
    value: "redemptions"
  },
  {
    label: "Disputes",
    value: "disputes"
  },
  {
    label: "Past exchanges",
    value: "past-exchanges"
  }
];

interface FilterValue {
  value: string;
  label: string;
}
interface MyLocationState {
  currentTag: string;
}
export default function SellerExchanges({
  exchanges: exchangesData
}: SellerInsideProps & WithSellerDataProps) {
  const location = useLocation();
  const state = location.state as MyLocationState;

  const initialTag = useMemo(() => {
    return state?.currentTag
      ? productTags.filter((f) => f?.value === state?.currentTag)[0]
      : productTags[0];
  }, [state]);

  const [currentTag, setCurrentTag] = useState(
    initialTag?.value || productTags[0].value
  );
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<FilterValue | null>(null);
  const [selected, setSelected] = useState<Array<Exchange | null>>([]);

  const { data, isLoading, isError, refetch } = exchangesData;

  const allData = useMemo(() => {
    const filtered =
      data?.map((exchange: Exchange) => {
        const status = ExchangesKit.getExchangeState(exchange);
        if (currentTag === "live-rnfts") {
          return status === subgraph.ExchangeState.Committed ? exchange : null;
        }
        if (currentTag === "redemptions") {
          return status === subgraph.ExchangeState.Redeemed ? exchange : null;
        }
        if (currentTag === "disputes") {
          return status === subgraph.ExchangeState.Disputed ? exchange : null;
        }
        if (currentTag === "past-exchanges") {
          return status === ExchangesKit.ExtendedExchangeState.Expired ||
            status === subgraph.ExchangeState.Completed
            ? exchange
            : null;
        }
        return exchange;
      }) || [];

    if (search && search.length > 0) {
      return (
        filtered?.filter((n) => {
          return (
            n?.id.includes(search) ||
            n?.offer?.metadata?.name
              ?.toLowerCase()
              .includes(search.toLowerCase())
          );
        }) || []
      );
    }

    return (
      filtered?.filter((n) => {
        return n !== null;
      }) || []
    );
  }, [data, search, currentTag]);

  const prepareCSVData = useMemo(() => {
    const csvData = allData?.map((exchange) => {
      const status = exchange ? ExchangesKit.getExchangeState(exchange) : "";
      subgraph.ExchangeState;
      const price = (value: string, decimals: string) => {
        try {
          return utils.formatUnits(BigNumber.from(value), Number(decimals));
        } catch (e) {
          console.error(e);
          return "";
        }
      };

      return {
        ["ID/SKU"]: exchange?.id ? exchange?.id : "",
        ["Product name"]: exchange?.offer?.metadata?.name ?? "",
        ["Status"]: status,
        ["Price"]:
          exchange?.offer?.price && exchange?.offer?.exchangeToken?.decimals
            ? price(exchange.offer.price, exchange.offer.exchangeToken.decimals)
            : "",
        ["Token"]: exchange?.offer?.exchangeToken?.symbol ?? "",
        ["Redeemable Until"]: exchange?.offer?.voucherRedeemableUntilDate
          ? dayjs(
              getDateTimestamp(exchange?.offer?.voucherRedeemableUntilDate)
            ).format(CONFIG.dateFormat)
          : ""
      };
    });
    return csvData;
  }, [allData]);

  const filterButton = useMemo(() => {
    return (
      <>
        {selected.length > 0 && (
          <SellerBatchComplete selected={selected} refetch={refetch} />
        )}
        <ExportDropdown
          children={[
            {
              id: 0,
              name: "Export only the data shown in table",
              csvProps: {
                data: prepareCSVData,
                filename: "products"
              }
            },
            {
              id: 1,
              name: "Export all data(incl. delivery info)",
              disabled: true,
              csvProps: {
                data: prepareCSVData,
                filename: "products"
              }
            }
          ]}
        />
      </>
    );
  }, [prepareCSVData, refetch, selected]);

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
      <SellerExchangeTable
        data={allData}
        isLoading={isLoading}
        isError={isError}
        refetch={refetch}
        setSelected={setSelected}
      />
    </>
  );
}
