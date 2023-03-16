import { ButtonSize } from "@bosonprotocol/react-kit";
import styled from "styled-components";

import { useModal } from "../../components/modal/useModal";
import { colors } from "../../lib/styles/colors";
import { Offer } from "../../lib/types/offer";
import { SellerRolesProps } from "../../lib/utils/hooks/useSellerRoles";
import BosonButton from "../ui/BosonButton";

interface Props {
  selected: Array<Offer | null>;
  refetch: () => void;
  sellerRoles: SellerRolesProps;
}

const BatchVoidButton = styled(BosonButton)`
  background: transparent;
  border-color: ${colors.orange};
  color: ${colors.orange};
  &:hover {
    background: ${colors.orange};
    border-color: ${colors.orange};
    color: ${colors.white};
  }
`;

function SellerBatchVoid({ selected, refetch, sellerRoles }: Props) {
  const { showModal, modalTypes } = useModal();

  return (
    <BatchVoidButton
      variant="secondaryInverted"
      size={ButtonSize.Small}
      disabled={!sellerRoles?.isAssistant}
      tooltip="This action is restricted to only the assistant wallet"
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
    </BatchVoidButton>
  );
}

export default SellerBatchVoid;
