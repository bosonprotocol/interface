import { offers } from "@bosonprotocol/react-kit";
import dayjs from "dayjs";
import { BigNumber, utils } from "ethers";
import map from "lodash/map";
import { useMemo, useState } from "react";

import { CONFIG } from "../../../lib/config";
import { getDateTimestamp } from "../../../lib/utils/getDateTimestamp";
import { ActiveEscalatedDisputes } from "../../../lib/utils/hooks/disputes/getDisputes";
import { Disputes } from "../../../lib/utils/hooks/useExchanges";
import SellerExport from "../../seller/SellerExport";
import Loading from "../../ui/Loading";
import { DisputeResolverProps } from "../DisputeResolverInside";
import DisputesTable from "../ManageDisputes/DisputesTable";

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

interface FilterValue {
  value: string;
  label: string;
}

export const DisputesManage: React.FC<DisputeResolverProps> = () => {
  const [currentTag, setCurrentTag] = useState(productTags[0].value);
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<FilterValue | null>(null);
  const [selected, setSelected] = useState<Array<Disputes | null>>([]);

  const { data, isLoading, isError, refetch } = ActiveEscalatedDisputes();

  // TODO: GET the data here - Roberto

  const allDisputes = useMemo(() => {
    const filtered =
      data?.map((dispute: any) => {
        const status = offers.getOfferStatus(dispute);

        if (currentTag === "physical") {
          return dispute?.metadata?.product?.offerCategory === "PHYSICAL"
            ? dispute
            : null;
        }
        if (currentTag === "phygital") {
          return dispute?.metadata?.product?.offerCategory === "PHYGITAL"
            ? dispute
            : null;
        }
        if (currentTag === "expired") {
          return status === offers.OfferState.EXPIRED ? dispute : null;
        }
        if (currentTag === "voided") {
          return status === offers.OfferState.VOIDED ? dispute : null;
        }
        return dispute;
      }) || [];

    if (search && search.length > 0) {
      return filtered.filter((n: any): boolean => {
        return (
          n !== null &&
          (n.id.includes(search) ||
            n.metadata.name.toLowerCase().includes(search.toLowerCase()))
        );
      });
    }

    return filtered.filter((n: any): boolean => {
      return n !== null;
    });
  }, [data, search, currentTag]);

  const prepareCSVData = useMemo(() => {
    const csvData = map(allDisputes, (offer) => {
      const price = (value: string, decimals: string) => {
        try {
          return utils.formatUnits(BigNumber.from(value), Number(decimals));
        } catch (e) {
          console.error(e);
          return "";
        }
      };
      return {
        ["ID/SKU"]: offer?.id ? offer?.id : "",
        ["Product name"]: offer?.metadata?.name ?? "",
        ["Status"]: offer ? offers.getOfferStatus(offer) : "",
        ["Remaining Quantity"]: offer?.quantityAvailable ?? "",
        ["Initial Quantity"]: offer?.quantityInitial ?? "",
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
  }, [allDisputes]);

  const filterButton = useMemo(() => {
    return (
      <>
        <SellerExport
          csvProps={{
            data: prepareCSVData,
            filename: "disputesList"
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
      {/* <SellerTags
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
      /> */}
      <DisputesTable
        disputes={allDisputes}
        isLoading={isLoading}
        isError={isError}
        refetch={refetch}
        setSelected={setSelected}
      />
    </>
  );
};
