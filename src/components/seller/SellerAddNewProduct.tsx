import { ButtonSize } from "@bosonprotocol/react-kit";
import { PlusCircle } from "phosphor-react";

import { SellerCenterRoutes } from "../../lib/routing/routes";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { SellerRolesProps } from "../../lib/utils/hooks/useSellerRoles";
import BosonButton from "../ui/BosonButton";

interface Props {
  sellerRoles: SellerRolesProps;
}
function SellerAddNewProduct({ sellerRoles }: Props) {
  const navigate = useKeepQueryParamsNavigate();
  return (
    <BosonButton
      variant="primaryFill"
      size={ButtonSize.Small}
      disabled={!sellerRoles?.isAssistant}
      tooltip="This action is restricted to only the assistant wallet"
      onClick={() => {
        navigate({ pathname: SellerCenterRoutes.CreateProduct });
      }}
    >
      Add product <PlusCircle size={16} />
    </BosonButton>
  );
}

export default SellerAddNewProduct;
