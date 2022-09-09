import { exchanges as ExchangesKit, subgraph } from "@bosonprotocol/react-kit";
import dayjs from "dayjs";
import { BigNumber, utils } from "ethers";
import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import { CONFIG } from "../../../lib/config";
import { getDateTimestamp } from "../../../lib/utils/getDateTimestamp";
import { Exchange, useExchanges } from "../../../lib/utils/hooks/useExchanges";
import Loading from "../../ui/Loading";
import ExportButton from "../common/ExportButton";
import Filters from "../common/Filters";
import Tags from "../common/Tags";
import SellerExchangeTable from "./SellerExchangeTable";

const productTags = [
  {
    label: "Active",
    value: "active"
  },
  {
    label: "Past",
    value: "past"
  }
];

interface Props {
  sellerId: string;
}
interface FilterValue {
  value: string;
  label: string;
}
interface MyLocationState {
  currentTag: string;
}
export default function ManageDisputes({ sellerId }: Props) {
  const location = useLocation();
  const state = location.state as MyLocationState;

  const initialTag = useMemo(() => {
    const currentTag = state?.currentTag || null;
    return currentTag
      ? productTags.filter((f) => f?.value === currentTag)[0]
      : productTags[0];
  }, [state]);

  const [currentTag, setCurrentTag] = useState(
    initialTag?.value || productTags[0].value
  );
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<FilterValue | null>(null);

  const { data, isLoading, isError, refetch } = useExchanges({
    sellerId,
    disputed: null
  });

  const allData = useMemo(() => {
    const filtered =
      data?.map((exchange: Exchange) => {
        const status = ExchangesKit.getExchangeState(exchange);

        if (currentTag === "active") {
          return status !== ExchangesKit.ExtendedExchangeState.Expired &&
            status !== subgraph.ExchangeState.Completed
            ? exchange
            : null;
        }
        if (currentTag === "past") {
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
        <ExportButton
          csvProps={{
            data: prepareCSVData,
            filename: "exchanges"
          }}
        />
      </>
    );
  }, [prepareCSVData]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Tags
        tags={productTags}
        currentTag={currentTag}
        setCurrentTag={setCurrentTag}
      />
      <Filters
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
      />
    </>
  );
}
