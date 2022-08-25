import { exchanges as ExchangesKit, subgraph } from "@bosonprotocol/react-kit";
import dayjs from "dayjs";
import { BigNumber, utils } from "ethers";
import { useMemo, useState } from "react";

import { CONFIG } from "../../../lib/config";
import { getDateTimestamp } from "../../../lib/utils/getDateTimestamp";
import { Exchange, useExchanges } from "../../../lib/utils/hooks/useExchanges";
import Loading from "../../ui/Loading";
import SellerExport from "../SellerExport";
import SellerFilters from "../SellerFilters";
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

interface Props {
  sellerId: string;
}
interface FilterValue {
  value: string;
  label: string;
}

export default function SellerExchanges({ sellerId }: Props) {
  const [currentTag, setCurrentTag] = useState(productTags[0].value);
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<FilterValue | null>(null);

  let newSellerId;
  const { data, isLoading, isError, refetch } = useExchanges({
    sellerId: newSellerId || sellerId,
    disputed: false
  });

  const allData = useMemo(() => {
    const filtered =
      data?.map((exchange: Exchange) => {
        const status = ExchangesKit.getExchangeState(exchange);

        if (currentTag === "live-rnfts") {
          return status === subgraph.ExchangeState.Completed ? exchange : null;
        }
        if (currentTag === "redemptions") {
          return status === subgraph.ExchangeState.Redeemed ? exchange : null;
        }
        if (currentTag === "disputes") {
          return status === subgraph.ExchangeState.Disputed ? exchange : null;
        }
        if (currentTag === "past-exchanges") {
          return status === ExchangesKit.ExtendedExchangeState.Expired
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
    const csvData = allData?.map((exchange: any) => {
      const status = ExchangesKit.getExchangeState(exchange);
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
              getDateTimestamp(exchange.offer.voucherRedeemableUntilDate)
            ).format(CONFIG.dateFormat)
          : ""
      };
    });
    return csvData;
  }, [allData]);

  const filterButton = useMemo(() => {
    return (
      <>
        <SellerExport
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
      />
    </>
  );
}
