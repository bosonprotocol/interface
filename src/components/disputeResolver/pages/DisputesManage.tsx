import { useState } from "react";

import {
  GetActiveEscalatedDisputes,
  GetPastEscalatedDisputesWithDecisions,
  GetPastEscalatedDisputesWithRefusals
} from "../../../lib/utils/hooks/disputes/getDisputes";
import SellerTags from "../../seller/SellerTags";
import Loading from "../../ui/Loading";
import { DisputeResolverProps } from "../DisputeResolverInside";
import DisputesTable from "../ManageDisputes/DisputesTable";
import DisputesTablePast from "../ManageDisputes/DisputesTablePast";

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

  const {
    data: activeDisputes,
    isLoading,
    isError
  } = GetActiveEscalatedDisputes();

  const { data: disputesWithDecisions } =
    GetPastEscalatedDisputesWithDecisions();

  const { data: disputesWithefusals } = GetPastEscalatedDisputesWithRefusals();

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
      {currentTag === "active" && (
        <DisputesTable
          disputes={activeDisputes}
          isLoading={isLoading}
          isError={isError}
        />
      )}
      {currentTag === "past" && (
        <DisputesTablePast
          disputes={[...disputesWithDecisions, ...disputesWithefusals]}
          isLoading={isLoading}
          isError={isError}
        />
      )}
    </>
  );
};
