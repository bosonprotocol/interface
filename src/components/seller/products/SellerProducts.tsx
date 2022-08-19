import Typography from "../../ui/Typography";
import SellerFilters from "./SellerFilters";
import SellerTable from "./SellerTable";
import SellerTags from "./SellerTags";

export default function SellerProducts() {
  return (
    <div>
      <Typography>Products</Typography>
      <SellerTags />
      <SellerFilters />
      <SellerTable />
    </div>
  );
}
