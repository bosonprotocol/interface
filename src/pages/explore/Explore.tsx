import { QueryParams } from "lib/routing/query-params";
import { Select } from "lib/styles/base";
import { useBrands } from "lib/utils/hooks/useBrands";
import { useTokens } from "lib/utils/hooks/useTokens";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";

import { Layout } from "../../components/Layout";
import ExploreOffers from "./ExploreOffers";

const ExploreContainer = styled(Layout)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto 64px auto;
  overflow: hidden;
`;

const Input = styled.input`
  max-width: 100%;
  width: 100%;
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

const CustomSelect = styled(Select)`
  max-width: 100%;
  @media (min-width: 981px) {
    width: 500px;
  }
`;

const TokenSelect = styled(CustomSelect)`
  margin-top: 10px;
`;

const InputContainer = styled.div``;

export default function Explore() {
  const [searchParams] = useSearchParams();
  const nameQueryParam = searchParams.get(QueryParams.name) || "";

  const [brandInput, setBrandInput] = useState<string>(nameQueryParam);
  const [brandSelect, setBrandSelect] = useState<string>("");
  const [nameToSearch, setNameToSearch] = useState<string>(nameQueryParam);

  const { data: tokens } = useTokens();
  const [selectedToken, setSelectedToken] = useState<string>();
  const { data: brands } = useBrands();

  const onChangeName = (newBrand: string) => {
    setNameToSearch(newBrand);
    // TODO: should we update the url query param?
  };
  return (
    <ExploreContainer>
      <TopContainer>
        <FiltersContainer>
          <h2>Filter</h2>
          <CustomSelect
            disabled
            value={brandSelect}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setBrandSelect(e.target.value);
              // onChangeBrand(e.target.value);
            }}
          >
            <option value="">Brand</option>
            {brands &&
              brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
          </CustomSelect>

          <TokenSelect
            value={selectedToken}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setSelectedToken(e.target.value)
            }
          >
            <option value="">Currency</option>
            {tokens &&
              tokens.map((token) => (
                <option key={token.symbol} value={token.address}>
                  {token.symbol}
                </option>
              ))}
          </TokenSelect>
        </FiltersContainer>
        <InputContainer>
          <h2>Search</h2>
          <Input
            onChange={(e) => {
              setBrandInput(e.target.value);
              onChangeName(e.target.value);
            }}
            value={brandInput}
            placeholder="Search by Name"
          />
        </InputContainer>
      </TopContainer>
      <ExploreOffers
        // brand={nameToSearch}
        name={nameToSearch}
        exchangeTokenAddress={selectedToken}
      />
    </ExploreContainer>
  );
}
