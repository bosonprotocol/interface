import { Exchange } from "../../lib/utils/hooks/useExchanges";
import { useModal } from "../modal/useModal";
import Button from "../ui/Button";

interface Props {
  selected: Array<Exchange | null>;
  refetch: () => void;
}
function SellerBatchComplete({ selected, refetch }: Props) {
  const { showModal, modalTypes } = useModal();
  return (
    <Button
      theme="bosonPrimary"
      size="small"
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
