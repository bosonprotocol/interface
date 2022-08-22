import { useState } from "react";
import styled from "styled-components";

import Typography from "../../ui/Typography";
import SellerTags from "../SellerTags";
import SellerFilters from "./SellerFilters";
import SellerTable from "./SellerTable";

const SellerTitle = styled(Typography)`
  margin: 0 0 1.25rem 0;
`;

const productTags = [
  {
    label: "All",
    value: "all"
  },
  {
    label: "Phygital",
    value: "phygital"
  },
  {
    label: "Physical",
    value: "physical"
  },
  {
    label: "Expired",
    value: "expired"
  },
  {
    label: "Voided",
    value: "voided"
  }
];

export default function SellerProducts() {
  const [currentTag, setCurrentTag] = useState(productTags[0].value);

  return (
    <div>
      <SellerTitle tag="h3">Products</SellerTitle>
      <SellerTags
        tags={productTags}
        currentTag={currentTag}
        setCurrentTag={setCurrentTag}
      />
      <SellerFilters />
      <SellerTable />
    </div>
  );
}
