import React, { useState } from "react";
import styled from "styled-components";

import { ExploreQueryParameters } from "../../lib/routing/parameters";
import { useQueryParameter } from "../../lib/routing/useQueryParameter";
import { colors } from "../../lib/styles/colors";
import ExploreOffers from "./ExploreOffers";

const ExploreOffersContainer = styled.div`
  background: ${colors.lightGrey};
  padding: 0 3.125rem 3.125rem 3.125rem;
`;

function Products() {
  const [nameQueryParameter, setNameQueryParameter] = useQueryParameter(
    ExploreQueryParameters.name
  );

  const [currencyQueryParameter, setCurrencyQueryParameter] = useQueryParameter(
    ExploreQueryParameters.currency
  );

  const [selectedToken, setSelectedToken] = useState<string>(
    currencyQueryParameter
  );
  const [sellerQueryParameter, setSellerQueryParameter] = useQueryParameter(
    ExploreQueryParameters.seller
  );

  const [brandSelect, setBrandSelect] = useState<string>("");
  const [nameToSearch, setNameToSearch] = useState<string>(nameQueryParameter);

  const [selectedSeller, setSelectedSeller] =
    useState<string>(sellerQueryParameter);

  return (
    <>
      <ExploreOffersContainer>
        <ExploreOffers
          name={nameToSearch}
          exchangeTokenAddress={selectedToken}
          sellerId={selectedSeller}
          brand={brandSelect}
          rows={3}
          hidePagination
        />
      </ExploreOffersContainer>
    </>
  );
}

export default Products;
