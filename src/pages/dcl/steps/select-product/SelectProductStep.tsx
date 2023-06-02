import React from "react";

import { WithSellerData } from "../../../../components/seller/common/WithSellerData";
import { ProductsTableColumnId } from "../../../../components/seller/products/SellerProductsTable";
import { sellerPageTypes } from "../../../../components/seller/SellerPages";
import Grid from "../../../../components/ui/Grid";
import Loading from "../../../../components/ui/Loading";
import Typography from "../../../../components/ui/Typography";
import { colors } from "../../../../lib/styles/colors";
import { useCurrentSellers } from "../../../../lib/utils/hooks/useCurrentSellers";
import { DCLLayout } from "../../styles";

type SelectProductStepProps = {
  goToNextStep: () => void;
};

const Products = WithSellerData(sellerPageTypes.products.component);

const columnsToShow: Readonly<ProductsTableColumnId[]> = [
  ProductsTableColumnId.offerId,
  ProductsTableColumnId.warningIcon,
  ProductsTableColumnId.image,
  ProductsTableColumnId.sku,
  ProductsTableColumnId.productName,
  ProductsTableColumnId.status,
  ProductsTableColumnId.quantity,
  ProductsTableColumnId.salesChannels,
  ProductsTableColumnId.action
] as const;
export const SelectProductStep: React.FC<SelectProductStepProps> = ({
  goToNextStep
}) => {
  const { isLoading, sellerIds: currentSellerIds } = useCurrentSellers();

  if (isLoading) {
    return <Loading />;
  }
  const [sellerId] = currentSellerIds;
  return (
    <DCLLayout width="auto">
      <Grid flexDirection="column" alignItems="flex-start">
        <Typography fontWeight="600" $fontSize="1.5rem" margin="0 0 0.75rem 0">
          DCL Setup
        </Typography>
        <div
          style={{
            minHeight: "31.25rem",
            background: colors.white,
            padding: "0.5rem 1.5rem 1.5rem 1.5rem",
            width: "inherit"
          }}
        >
          <Products sellerId={sellerId} columnsToShow={columnsToShow} />
        </div>
      </Grid>
    </DCLLayout>
  );
};
