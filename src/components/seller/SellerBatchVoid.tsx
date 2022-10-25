import { ButtonSize } from "@bosonprotocol/react-kit";

import { useModal } from "../../components/modal/useModal";
import { Offer } from "../../lib/types/offer";
import { SellerRolesProps } from "../../lib/utils/hooks/useSellerRoles";
import BosonButton from "../ui/BosonButton";

interface Props {
  selected: Array<Offer | null>;
  refetch: () => void;
  sellerRoles: SellerRolesProps;
}
function SellerBatchVoid({ selected, refetch, sellerRoles }: Props) {
  const { showModal, modalTypes } = useModal();

  return (
    <BosonButton
      variant="accentInverted"
      size={ButtonSize.Small}
      disabled={!sellerRoles?.isOperator}
      tooltip="This action is restricted to only the operator wallet"
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
      Batch Void
    </BosonButton>
  );
}

export default SellerBatchVoid;
