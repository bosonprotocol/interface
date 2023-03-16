import { ButtonSize } from "@bosonprotocol/react-kit";

import { Exchange } from "../../lib/utils/hooks/useExchanges";
import { SellerRolesProps } from "../../lib/utils/hooks/useSellerRoles";
import { useModal } from "../modal/useModal";
import BosonButton from "../ui/BosonButton";

interface Props {
  selected: Array<Exchange | null>;
  refetch: () => void;
  sellerRoles: SellerRolesProps;
}
function SellerBatchComplete({ selected, refetch, sellerRoles }: Props) {
  const { showModal, modalTypes } = useModal();
  return (
    <BosonButton
      variant="primaryFill"
      size={ButtonSize.Small}
      disabled={!sellerRoles?.isAssistant}
      tooltip="This action is restricted to only the assistant wallet"
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
    </BosonButton>
  );
}

export default SellerBatchComplete;
