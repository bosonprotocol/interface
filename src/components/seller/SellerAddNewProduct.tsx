import { PlusCircle } from "phosphor-react";

import { SellerCenterRoutes } from "../../lib/routing/routes";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import Button from "../ui/Button";

function SellerAddNewProduct() {
  const navigate = useKeepQueryParamsNavigate();
  return (
    <Button
      theme="secondary"
      size="small"
      onClick={() => {
        navigate({ pathname: SellerCenterRoutes.CreateProduct });
      }}
    >
      Add product <PlusCircle size={16} />
    </Button>
  );
}

export default SellerAddNewProduct;
