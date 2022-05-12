import { QueryParameters } from "@lib/routing/query-parameters";
import { useQueryParameter } from "@lib/routing/useQueryParameter";
import { Select } from "@lib/styles/base";
import { colors } from "@lib/styles/colors";
import { useBrands } from "@lib/utils/hooks/useBrands";
import { useSellers } from "@lib/utils/hooks/useSellers";
import { useTokens } from "@lib/utils/hooks/useTokens";
import React, { useState } from "react";
import styled from "styled-components";

import ExploreOffers from "./ExploreOffers";

const ExploreContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto 64px auto;
  overflow: hidden;
`;

const Input = styled.input`
  max-width: 100%;
  padding: 10px 8px;
  border-radius: 5px;
  font-size: 16px;

  @media (min-width: 981px) {
    width: 500px;
  }
`;

const TopContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (min-width: 981px) {
    flex-direction: row;
  }
`;

const FiltersContainer = styled.div``;

const BrandSelect = styled(Select)`
  max-width: 100%;
  @media (min-width: 981px) {
    width: 500px;
  }
`;

const CurrencyOrSellerSelect = styled(BrandSelect)`
  margin-top: 10px;
`;

const GoButton = styled.button`
  width: 100px;
  background: ${colors.green};
  color: ${colors.navy};
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
`;

const SearchContainer = styled.div``;

const InputContainer = styled.div`
  display: flex;
`;

export default function Explore() {
  const [nameQueryParameter, setNameQueryParameter] = useQueryParameter(
    QueryParameters.name
  );
  const [currencyQueryParameter, setCurrencyQueryParameter] = useQueryParameter(
    QueryParameters.currency
  );
  const [sellerQueryParameter, setSellerQueryParameter] = useQueryParameter(
    QueryParameters.seller
  );

  const [brandInput, setBrandInput] = useState<string>(nameQueryParameter);
  const [brandSelect, setBrandSelect] = useState<string>("");
  const [nameToSearch, setNameToSearch] = useState<string>(nameQueryParameter);

  const { data: tokens } = useTokens();
  const [selectedToken, setSelectedToken] = useState<string>(
    currencyQueryParameter
  );
  const { data: brands } = useBrands();
  const { data: sellers } = useSellers();
  const [selectedSeller, setSelectedSeller] =
    useState<string>(sellerQueryParameter);

  const onChangeName = (name: string) => {
    setNameToSearch(name);
    setNameQueryParameter(name);
  };

  return (
    <ExploreContainer>
      <TopContainer>
        <div>
          <h2>Filter</h2>
          <FiltersContainer>
            <BrandSelect
              disabled
              value={brandSelect}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setBrandSelect(e.target.value);
              }}
            >
              <option value="">Brand</option>
              {brands &&
                brands.map((brand: string) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
            </BrandSelect>

            <CurrencyOrSellerSelect
              value={selectedToken}
              data-testid="currency"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setSelectedToken(e.target.value);
                setCurrencyQueryParameter(e.target.value);
              }}
            >
              <option value="">Currency</option>
              {tokens &&
                tokens.map((token) => (
                  <option key={token.symbol} value={token.address}>
                    {token.symbol}
                  </option>
                ))}
            </CurrencyOrSellerSelect>

            <CurrencyOrSellerSelect
              value={selectedSeller}
              data-testid="seller"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setSelectedSeller(e.target.value);
                setSellerQueryParameter(e.target.value);
              }}
            >
              <option value="">Seller</option>
              {sellers &&
                sellers.map((seller) => (
                  <option key={seller.id} value={seller.id}>
                    ID: {seller.id}
                  </option>
                ))}
            </CurrencyOrSellerSelect>
          </FiltersContainer>
        </div>
        <SearchContainer>
          <h2>Search</h2>
          <InputContainer>
            <Input
              data-testid="name"
              onChange={(e) => {
                setBrandInput(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onChangeName(brandInput);
                }
              }}
              value={brandInput}
              placeholder="Search by Name"
            />
            <GoButton onClick={() => onChangeName(brandInput)}>Go</GoButton>
          </InputContainer>
        </SearchContainer>
      </TopContainer>
      <ExploreOffers
        name={nameToSearch}
        exchangeTokenAddress={selectedToken}
        sellerId={selectedSeller}
      />
    </ExploreContainer>
  );
}
