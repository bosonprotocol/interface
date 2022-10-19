import dayjs from "dayjs";
import map from "lodash/map";
import { useCallback, useMemo, useState } from "react";
import { FilterValue } from "react-table";

import { CONFIG } from "../../../lib/config";
import { calcPrice } from "../../../lib/utils/calcPrice";
import { getDateTimestamp } from "../../../lib/utils/getDateTimestamp";
import {
  GetActiveEscalatedDisputes,
  GetPastEscalatedDisputesWithDecisions,
  GetPastEscalatedDisputesWithRefusals
} from "../../../lib/utils/hooks/disputes/getDisputes";
import { Disputes } from "../../../lib/utils/hooks/useExchanges";
import SellerFilters from "../../seller/SellerFilters";
import SellerTags from "../../seller/SellerTags";
import ExportDropdown from "../../ui/ExportDropdown";
import Loading from "../../ui/Loading";
import { DisputeResolverProps } from "../DisputeResolverInside";
import DisputesTable from "../ManageDisputes/DisputesTable";

type CsvType = "all" | "active" | "past";
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

export const DisputesManage: React.FC<DisputeResolverProps> = () => {
  const [currentTag, setCurrentTag] = useState(productTags[0].value);

  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<FilterValue | null>(null);

  const {
    data: activeDisputes,
    isLoading,
    isError
  } = GetActiveEscalatedDisputes();

  const { data: disputesWithDecisions } =
    GetPastEscalatedDisputesWithDecisions();

  const { data: disputesWithefusals } = GetPastEscalatedDisputesWithRefusals();

  const filterDisputes = useCallback(
    (type: string) => {
      switch (type) {
        case "past":
          return [...disputesWithDecisions, ...disputesWithefusals];
        case "active":
          return [...activeDisputes];
        default:
          return [
            ...activeDisputes,
            ...disputesWithDecisions,
            ...disputesWithefusals
          ];
      }
    },
    [activeDisputes, disputesWithDecisions, disputesWithefusals]
  );

  const allData = useMemo(() => {
    const filtered = filterDisputes(currentTag);

    if (search && search.length > 0) {
      return (
        filtered?.filter((n) => {
          return (
            n?.id.includes(search) ||
            n?.exchange?.offer?.metadata?.name
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
  }, [filterDisputes, search, currentTag]);

  const prepareCSVData = useCallback(
    (type: CsvType) => {
      const disputes = filterDisputes(type);

      const csvData = map(disputes, (dispute: Disputes) => {
        return {
          ["ID/SKU"]: dispute?.id || "",
          ["Product Name"]: dispute?.exchange?.offer?.metadata?.name || "",
          ["Status"]: dispute?.state || "",
          ["Price"]:
            dispute?.exchange?.offer?.price &&
            dispute?.exchange?.offer?.exchangeToken?.decimals
              ? calcPrice(
                  dispute?.exchange?.offer?.price,
                  dispute?.exchange?.offer?.exchangeToken?.decimals
                )
              : "",
          ["Escalated Date"]: dispute?.escalatedDate
            ? dayjs(getDateTimestamp(dispute?.escalatedDate)).format(
                CONFIG.dateFormat
              )
            : "",
          ["Escalated Expires"]: dispute?.exchange?.offer
            ?.resolutionPeriodDuration
            ? dayjs(
                getDateTimestamp(
                  `${
                    parseInt(dispute?.escalatedDate || "") +
                    parseInt(dispute?.exchange?.offer?.resolutionPeriodDuration)
                  }`
                )
              ).format(CONFIG.dateFormat)
            : ""
        };
      });
      return csvData;
    },
    [filterDisputes]
  );

  const filterButton = useMemo(() => {
    const dateString = dayjs().format("YYYYMMDD");

    return (
      <ExportDropdown
        children={[
          {
            id: 0,
            name: "Export all disputes",
            hidden: true,
            csvProps: {
              data: prepareCSVData("all"),
              filename: `disputes-all-${dateString}`
            }
          },
          {
            id: 1,
            name: "Export active disputes",
            csvProps: {
              data: prepareCSVData("active"),
              filename: `disputes-active-${dateString}`
            }
          },
          {
            id: 1,
            name: "Export past disputes",
            csvProps: {
              data: prepareCSVData("past"),
              filename: `disputes-past-${dateString}`
            }
          }
        ]}
      />
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
      <DisputesTable
        disputes={allData}
        isLoading={isLoading}
        isError={isError}
      />
    </>
  );
};
