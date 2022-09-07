import { useModal } from "../../components/modal/useModal";
import { Offer } from "../../lib/types/offer";
import Button from "../ui/Button";

interface Props {
  selected: Array<Offer | null>;
  refetch: () => void;
}
function SellerBatchVoid({ selected, refetch }: Props) {
  const { showModal, modalTypes } = useModal();

  return (
    <Button
      theme="primary"
      size="small"
      onClick={() => {
        showModal(
          modalTypes.VOID_PRODUCT,
          {
            title: "Void Confirmation",
            offers: selected,
            refetch
          },
          "s"
        );
      }}
    >
      Void
    </Button>
  );
}

export default SellerBatchVoid;
