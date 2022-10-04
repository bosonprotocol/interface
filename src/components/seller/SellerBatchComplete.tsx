import { Exchange } from "../../lib/utils/hooks/useExchanges";
import { SellerRolesProps } from "../../lib/utils/hooks/useSellerRoles";
import { useModal } from "../modal/useModal";
import Button from "../ui/Button";

interface Props {
  selected: Array<Exchange | null>;
  refetch: () => void;
  sellerRoles: SellerRolesProps;
}
function SellerBatchComplete({ selected, refetch, sellerRoles }: Props) {
  const { showModal, modalTypes } = useModal();
  return (
    <Button
      theme="bosonPrimary"
      size="small"
      disabled={!sellerRoles?.isOperator}
      tooltip="This action is restricted to only the operator wallet"
      onClick={() => {
        showModal(
          modalTypes.COMPLETE_EXCHANGE,
          {
            title: "Complete Confirmation",
            exchanges: selected,
            refetch
          },
          "s"
        );
      }}
    >
      Batch Complete
    </Button>
  );
}

export default SellerBatchComplete;
