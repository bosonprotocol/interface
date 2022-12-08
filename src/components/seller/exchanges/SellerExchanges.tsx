import { ThreadId } from "@bosonprotocol/chat-sdk/dist/cjs/util/v0.0.1/definitions";
import { exchanges as ExchangesKit, subgraph } from "@bosonprotocol/react-kit";
import * as Sentry from "@sentry/browser";
import dayjs from "dayjs";
import { utils } from "ethers";
import { camelCase } from "lodash";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import { useLocation } from "react-router-dom";

import { CONFIG } from "../../../lib/config";
import { isTruthy } from "../../../lib/types/helpers";
import { calcPrice } from "../../../lib/utils/calcPrice";
import { getDateTimestamp } from "../../../lib/utils/getDateTimestamp";
import { Exchange } from "../../../lib/utils/hooks/useExchanges";
import { useChatContext } from "../../../pages/chat/ChatProvider/ChatContext";
import ExportDropdown from "../../ui/ExportDropdown";
import Loading from "../../ui/Loading";
import { WithSellerDataProps } from "../common/WithSellerData";
import SellerBatchComplete from "../SellerBatchComplete";
import SellerFilters from "../SellerFilters";
import { SellerInsideProps } from "../SellerInside";
import SellerTags from "../SellerTags";
import SellerExchangeTable from "./SellerExchangeTable";

interface DeliveryInfo {
  name?: string;
  streetNameAndNumber?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  email?: string;
}
interface CSVData {
  "ID/SKU": string;
  "Product name": string;
  Status: subgraph.ExchangeState;
  Price: string;
  Token: string;
  "Redeemable Until": string;
  "Delivery Info"?: string;
}

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

const statusOrder = [
  ExchangesKit.ExtendedExchangeState.NotRedeemableYet,
  subgraph.ExchangeState.Committed,
  subgraph.ExchangeState.Redeemed,
  subgraph.ExchangeState.Disputed,
  subgraph.ExchangeState.Cancelled,
  subgraph.ExchangeState.Completed,
  subgraph.ExchangeState.Revoked,
  ExchangesKit.ExtendedExchangeState.Expired
] as ExchangesKit.AllExchangeStates[];

const compareExchangesSortByStatus = (
  exchangeA: Exchange,
  exchangeB: Exchange
): number => {
  const {
    committedDate: committedDateA,
    redeemedDate: redeemedDateA,
    disputedDate: disputedDateA,
    cancelledDate: cancelledDateA,
    completedDate: completedDateA,
    revokedDate: revokedDateA,
    validUntilDate: validUntilDateA,
    id: idA
  } = exchangeA;
  const {
    committedDate: committedDateB,
    redeemedDate: redeemedDateB,
    disputedDate: disputedDateB,
    cancelledDate: cancelledDateB,
    completedDate: completedDateB,
    revokedDate: revokedDateB,
    validUntilDate: validUntilDateB,
    id: idB
  } = exchangeB;
  const stateA = ExchangesKit.getExchangeState(exchangeA);
  const stateB = ExchangesKit.getExchangeState(exchangeB);
  if (
    stateA === stateB ||
    ([
      ExchangesKit.ExtendedExchangeState.NotRedeemableYet,
      subgraph.ExchangeState.Committed
    ].includes(stateA) &&
      [
        ExchangesKit.ExtendedExchangeState.NotRedeemableYet,
        subgraph.ExchangeState.Committed
      ].includes(stateB))
  ) {
    switch (true) {
      case (
        [
          ExchangesKit.ExtendedExchangeState.NotRedeemableYet,
          subgraph.ExchangeState.Committed
        ] as ExchangesKit.AllExchangeStates[]
      ).includes(stateA):
        return Number(committedDateB) - Number(committedDateA);
      case stateA === subgraph.ExchangeState.Redeemed:
        return Number(redeemedDateB) - Number(redeemedDateA);
      case stateA === subgraph.ExchangeState.Disputed:
        return Number(disputedDateB) - Number(disputedDateA);
      case stateA === subgraph.ExchangeState.Cancelled:
        return Number(cancelledDateB) - Number(cancelledDateA);
      case stateA === subgraph.ExchangeState.Completed:
        return Number(completedDateB) - Number(completedDateA);
      case stateA === subgraph.ExchangeState.Revoked:
        return Number(revokedDateB) - Number(revokedDateA);
      case stateA === ExchangesKit.ExtendedExchangeState.Expired:
        return Number(validUntilDateB) - Number(validUntilDateA);
      default: {
        const errorMessage = `Case not supported, stateA=${stateA}, stateB=${stateB}, exchange.idA=${idA}, exchange.idB=${idB}`;
        console.error(errorMessage);
        Sentry.captureException(new Error(errorMessage), {
          extra: {
            stateA,
            stateB,
            idA,
            idB,
            action: "compareExchangesSortByStatus",
            location: "seller-exchanges"
          }
        });
      }
    }
  }
  return statusOrder.indexOf(stateA) - statusOrder.indexOf(stateB);
};

interface FilterValue {
  value: string;
  label: string;
}
interface MyLocationState {
  currentTag: string;
}
export default function SellerExchanges({
  exchanges: exchangesData,
  sellerRoles
}: SellerInsideProps & WithSellerDataProps) {
  const csvBtn = useRef<
    CSVLink & HTMLAnchorElement & { link: HTMLAnchorElement }
  >(null);
  const [csvData, setCsvData] = useState<CSVData[]>([] as CSVData[]);
  const [loading, setLoading] = useState<boolean>(false);

  const { initialize, bosonXmtp, isInitializing } = useChatContext();

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
      data
        ?.map((exchange: Exchange) => {
          const status = ExchangesKit.getExchangeState(exchange);
          if (currentTag === "live-rnfts") {
            return status === subgraph.ExchangeState.Committed
              ? exchange
              : null;
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
        })
        .filter(isTruthy)
        .sort(compareExchangesSortByStatus) || [];

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

  const getExchangeAddressDetails = useCallback(
    async (exchange: Exchange) => {
      try {
        const threadId: ThreadId = {
          exchangeId: exchange.id,
          buyerId: exchange.buyer.id,
          sellerId: exchange.seller.id
        };
        const destinationAddressLowerCase = exchange?.buyer.wallet;
        const destinationAddress = utils.getAddress(
          destinationAddressLowerCase
        );
        const startTime = dayjs(
          getDateTimestamp(exchange?.committedDate)
        ).toDate();
        const endTime = dayjs().toDate();

        if (!bosonXmtp) {
          return "Address not found. Please initialize chat first";
        }
        const result = await bosonXmtp?.getThread(
          threadId,
          destinationAddress,
          {
            startTime,
            endTime
          }
        );
        const messageWithDeliveryInfo = result?.messages?.find((message) => {
          const deliveryInfo = JSON.stringify(
            message?.data?.content?.value || ""
          );
          if (deliveryInfo?.includes("DELIVERY ADDRESS")) {
            return message;
          }
          return undefined;
        });

        if (!messageWithDeliveryInfo) {
          return "Address not found. Please see this exchange's chat history";
        }

        const deliveryInfo: DeliveryInfo = (
          (messageWithDeliveryInfo?.data?.content?.value || "") as string
        )
          ?.split("\n")
          .reduce((acc, item) => {
            const [key, value] = item.split(":");
            return {
              ...acc,
              [camelCase(key)]: (value || "").trim()
            };
          }, {});

        return `${deliveryInfo?.name || "name"}, ${
          deliveryInfo.email || "email"
        }, ${deliveryInfo?.streetNameAndNumber || "streetNameAndNumber"}, ${
          deliveryInfo?.city || "city"
        }, ${deliveryInfo?.state || "state"}, ${deliveryInfo?.zip || "zip"}, ${
          deliveryInfo?.country || "country"
        }`;
      } catch (error) {
        Sentry.captureException(error, {
          extra: {
            action: "export-with-delivery-info",
            location: "seller-center-exchanges",
            id: exchange.id
          }
        });
        console.error("Error while fetching exchange chat history", error);
        return "";
      }
    },
    [bosonXmtp]
  );

  const prepareWithoutDelivery = useMemo(() => {
    return allData?.map((exchange) => {
      const status = (
        exchange ? ExchangesKit.getExchangeState(exchange) : ""
      ) as subgraph.ExchangeState;

      return {
        ["ID/SKU"]: exchange?.id ? exchange?.id : "",
        ["Product name"]: exchange?.offer?.metadata?.name ?? "",
        ["Status"]: status,
        ["Price"]:
          exchange?.offer?.price && exchange?.offer?.exchangeToken?.decimals
            ? calcPrice(
                exchange.offer.price,
                exchange.offer.exchangeToken.decimals
              )
            : "",
        ["Token"]: exchange?.offer?.exchangeToken?.symbol ?? "",
        ["Redeemable Until"]: exchange?.offer?.voucherRedeemableUntilDate
          ? dayjs(
              getDateTimestamp(exchange?.offer?.voucherRedeemableUntilDate)
            ).format(CONFIG.dateFormat)
          : "",
        ["Redeemed Date"]: exchange?.redeemedDate
          ? dayjs(getDateTimestamp(exchange?.redeemedDate)).format()
          : ""
      };
    }) as CSVData[];
  }, [allData]);

  const prepareWithDelivery = useCallback(async () => {
    setLoading(true);
    const allPromises = allData?.map(async (exchange) => {
      const status = (
        exchange ? ExchangesKit.getExchangeState(exchange) : ""
      ) as subgraph.ExchangeState;
      const deliveryInfo =
        exchange?.redeemedDate !== null
          ? await getExchangeAddressDetails(exchange as Exchange)
          : "";

      return {
        ["ID/SKU"]: exchange?.id ? exchange?.id : "",
        ["Product name"]: exchange?.offer?.metadata?.name ?? "",
        ["Status"]: status,
        ["Price"]:
          exchange?.offer?.price && exchange?.offer?.exchangeToken?.decimals
            ? calcPrice(
                exchange.offer.price,
                exchange.offer.exchangeToken.decimals
              )
            : "",
        ["Token"]: exchange?.offer?.exchangeToken?.symbol ?? "",
        ["Redeemable Until"]: exchange?.offer?.voucherRedeemableUntilDate
          ? dayjs(
              getDateTimestamp(exchange?.offer?.voucherRedeemableUntilDate)
            ).format(CONFIG.dateFormat)
          : "",
        ["Redeemed Date"]: exchange?.redeemedDate
          ? dayjs(getDateTimestamp(exchange?.redeemedDate)).format()
          : "",
        ["Delivery Info"]: (deliveryInfo || "").toString()
      };
    });
    const csvData = (await Promise.all(allPromises)) as CSVData[];
    setCsvData(csvData);
    if (csvBtn?.current) {
      setTimeout(() => {
        setLoading(false);
        const a = document.createElement("a");
        a.href = csvBtn.current?.link?.href || "";
        a.download = `${
          csvBtn.current?.props?.filename ||
          `exchanges-with-delivery-info-${dayjs().format("YYYYMMDD")}`
        }.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, 250);
    }
  }, [allData, getExchangeAddressDetails, csvBtn]);

  useEffect(() => {
    if (bosonXmtp && loading && csvData.length === 0) {
      prepareWithDelivery();
    }
  }, [bosonXmtp, csvData, loading]); // eslint-disable-line

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
        buttons={
          <>
            {selected.length > 0 && (
              <SellerBatchComplete
                selected={selected}
                refetch={refetch}
                sellerRoles={sellerRoles}
              />
            )}
            <ExportDropdown
              children={[
                {
                  id: 0,
                  name: "Export only the data shown in table",
                  csvProps: {
                    data: prepareWithoutDelivery,
                    filename: `exchanges-${dayjs().format("YYYYMMDD")}`
                  }
                },
                {
                  id: 1,
                  name: "Export all data(incl. delivery info)",
                  loading: loading,
                  ref: csvBtn,
                  onClick: (e: React.MouseEvent<HTMLElement>) => {
                    e.preventDefault();
                    if (!bosonXmtp && !isInitializing) {
                      setLoading(true);
                      initialize();
                    } else if (bosonXmtp) {
                      prepareWithDelivery();
                    }
                  },
                  csvProps: {
                    data: csvData,
                    filename: `exchanges-with-delivery-info-${dayjs().format(
                      "YYYYMMDD"
                    )}`
                  }
                }
              ]}
            />
          </>
        }
      />
      <SellerExchangeTable
        data={allData}
        isLoading={isLoading}
        isError={isError}
        refetch={refetch}
        setSelected={setSelected}
        sellerRoles={sellerRoles}
      />
    </>
  );
}
