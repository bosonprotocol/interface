import { useState } from "react";
import styled from "styled-components";

import { colors } from "../../../lib/styles/colors";
import { useInfiniteOffers } from "../../../lib/utils/hooks/offers/useInfiniteOffers";
import Typography from "../../ui/Typography";
import SellerTags from "../SellerTags";
import SellerFilters from "./SellerFilters";
import SellerTable from "./SellerTable";

const SellerTitle = styled(Typography)`
  margin: 0 0 1.25rem 0;
`;
const SellerInner = styled.div`
  background: ${colors.white};
  padding: 1rem;
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

const OFFERS_PER_PAGE = 5;

export default function SellerProducts() {
  const [currentTag, setCurrentTag] = useState(productTags[0].value);

  // TODO: change this mock and get real seller id based on he's address
  const SELLER_ID = "2";
  const { data, isLoading, isError, ...rest } = useInfiniteOffers(
    {
      voided: false,
      sellerId: SELLER_ID,
      first: 1000,
      orderBy: "createdAt",
      orderDirection: "desc"
    },
    {
      enabled: !!SELLER_ID,
      keepPreviousData: true
    }
  );

  return (
    <>
      <SellerTitle tag="h3">Products</SellerTitle>
      <SellerInner>
        <SellerTags
          tags={productTags}
          currentTag={currentTag}
          setCurrentTag={setCurrentTag}
        />
        <SellerFilters />
        <SellerTable
          offers={
            data?.pages.flatMap((page) => {
              return page;
            }) || []
          }
          isLoading={isLoading}
          isError={isError}
        />
      </SellerInner>
    </>
  );
}
