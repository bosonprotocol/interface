import { PlusCircle } from "phosphor-react";

import { SellerCenterRoutes } from "../../lib/routing/routes";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { SellerRolesProps } from "../../lib/utils/hooks/useSellerRoles";
import Button from "../ui/Button";

interface Props {
  sellerRoles: SellerRolesProps;
}
function SellerAddNewProduct({ sellerRoles }: Props) {
  const navigate = useKeepQueryParamsNavigate();
  return (
    <Button
      theme="bosonPrimary"
      size="small"
      disabled={!sellerRoles?.isOperator}
      tooltip="This action is restricted to only the operator wallet"
      onClick={() => {
        navigate({ pathname: SellerCenterRoutes.CreateProduct });
      }}
    >
      Add product <PlusCircle size={16} />
    </Button>
  );
}

export default SellerAddNewProduct;
