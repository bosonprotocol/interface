import { ArrowRight } from "phosphor-react";
import React, { useEffect, useMemo, useState } from "react";
import { default as ReactSelect, StylesConfig } from "react-select";
import styled from "styled-components";

import CollectionsCard from "../../components/modal/components/Explore/Collections/CollectionsCard";
import Grid from "../../components/ui/Grid";
import Typography from "../../components/ui/Typography";
import { ExploreQueryParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { useQueryParameter } from "../../lib/routing/useQueryParameter";
import { Select } from "../../lib/styles/base";
import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import { useBrands } from "../../lib/utils/hooks/useBrands";
import { useCollections } from "../../lib/utils/hooks/useCollections";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { useTokens } from "../../lib/utils/hooks/useTokens";
import ExploreOffers from "./ExploreOffers";

interface FilterValue {
  value: string;
  label: string;
}
const selectOptions = [
  { value: "1", label: "Price Low to High ($)" },
  { value: "2", label: "Price High to Low ($)" },
  { value: "3", label: "Recently Created" },
  { value: "4", label: "Recently Live" },
  { value: "5", label: "Recently Committed" },
  { value: "6", label: "Recently Redeemed" }
];

const customStyles: StylesConfig<
  {
    value: string;
    label: string;
  },
  false
> = {
  control: (provided) => ({
    ...provided,
    borderRadius: 0,
    boxShadow: "none",
    ":hover": {
      borderColor: colors.secondary,
      borderWidth: "0"
    },
    background: "none",
    border: "none"
  }),
  container: (provided, state) => ({
    ...provided,
    zIndex: state.isFocused ? zIndex.Select + 1 : zIndex.Select,
    position: "static",
    width: "100%",
    padding: 0,
    backgound: "none"
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: 0
  }),
  menu: (provided) => ({
    ...provided,
    position: "absolute",
    left: "0"
  }),
  option: (provided, state) => ({
    ...provided,
    cursor: state.isDisabled ? "not-allowed" : "pointer",
    opacity: state.isDisabled ? "0.5" : "1",
    background:
      state.isSelected || state.isFocused ? colors.lightGrey : colors.white,
    color: state.isSelected ? colors.secondary : colors.black
  }),
  indicatorSeparator: () => ({
    display: "none"
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: 0
  })
};
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

  ${breakpoint.m} {
    width: 500px;
  }
`;

const SelectFilterWrapper = styled.div`
  position: relative;
  min-width: 10.125rem;
  max-height: 2.5rem;
  background: ${colors.lightGrey};
  padding: 0.5rem 0.75rem 0.5rem 1rem;
  display: flex;
  align-items: center;
`;

const TopContainer = styled.div`
  display: grid;
  grid-template-columns: 80% 20%;
  align-items: center;
  justify-content: center;
  ${breakpoint.m} {
    flex-direction: row;
  }
`;

const FiltersContainer = styled.div``;

const BrandSelect = styled(Select)`
  max-width: 100%;
  ${breakpoint.m} {
    width: 500px;
  }
`;

const CurrencyOrSellerSelect = styled(BrandSelect)`
  margin-top: 10px;
`;

const SidebarContainer = styled.div`
  display: none;
`;

const ExploreOffersContainer = styled.div`
  background: ${colors.lightGrey};
  padding: 0 3.125rem 3.125rem 3.125rem;
`;

const CreatorsGrid = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 25% 25% 25% 25%;
  grid-gap: 8px;
`;

const ViewMoreButton = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${colors.secondary};
  width: 110px;
  font-size: 16px;
  font-weight: 600;
`;
export default function Explore() {
  const [nameQueryParameter, setNameQueryParameter] = useQueryParameter(
    ExploreQueryParameters.name
  );
  const [currencyQueryParameter, setCurrencyQueryParameter] = useQueryParameter(
    ExploreQueryParameters.currency
  );
  const [sellerQueryParameter, setSellerQueryParameter] = useQueryParameter(
    ExploreQueryParameters.seller
  );

  const [brandInput, setBrandInput] = useState<string>(nameQueryParameter);
  const [brandSelect, setBrandSelect] = useState<string>("");
  const [nameToSearch, setNameToSearch] = useState<string>(nameQueryParameter);
  const [filter, setFilter] = useState<FilterValue | null>(null);
  const navigate = useKeepQueryParamsNavigate();

  useEffect(() => {
    setBrandInput(nameQueryParameter);
    setNameToSearch(nameQueryParameter);
  }, [nameQueryParameter]);

  const { data: tokens } = useTokens();
  const [selectedToken, setSelectedToken] = useState<string>(
    currencyQueryParameter
  );
  const { data: brands } = useBrands();

  const [selectedSeller, setSelectedSeller] =
    useState<string>(sellerQueryParameter);

  const { data } = useCollections();

  const collections = useMemo(
    () => data && data.filter((item) => item.offers.length > 0).slice(0, 4),
    [data]
  );

  const onChangeName = (name: string) => {
    setNameToSearch(name);
    setNameQueryParameter(name);
  };

  return (
    <ExploreContainer>
      <TopContainer>
        <h1>Explore products</h1>
        <SelectFilterWrapper>
          <Typography fontWeight="600" color={colors.darkGrey}>
            Sort:
          </Typography>
          <ReactSelect
            styles={customStyles}
            isSearchable={false}
            placeholder=""
            value={filter}
            options={selectOptions}
            onChange={(option) => {
              setFilter(option);
            }}
          />
        </SelectFilterWrapper>
      </TopContainer>
      {/* <SidebarContainer>
        <h2>Filter</h2>
        <FiltersContainer>
          <BrandSelect
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
                <option key={token.symbol} value={token.symbol}>
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
              Array.isArray(sellers) &&
              sellers?.map((seller) => (
                <option key={seller?.id} value={seller?.id}>
                  ID: {seller?.id}
                </option>
              ))}
          </CurrencyOrSellerSelect>
        </FiltersContainer>
      </SidebarContainer> */}
      <ExploreOffersContainer>
        <ExploreOffers
          name={nameToSearch}
          exchangeTokenAddress={selectedToken}
          sellerId={selectedSeller}
          brand={brandSelect}
          hidePagination
        />
      </ExploreOffersContainer>
      <ExploreOffersContainer>
        <Grid>
          <h1>Collections</h1>
          <ViewMoreButton
            onClick={() =>
              navigate({
                pathname: `${BosonRoutes.Collections}`
              })
            }
          >
            View more <ArrowRight size={22} />
          </ViewMoreButton>
        </Grid>
        <CreatorsGrid>
          {collections &&
            collections.map((collection) => (
              <CollectionsCard key={collection.id} collection={collection} />
            ))}
        </CreatorsGrid>
      </ExploreOffersContainer>
    </ExploreContainer>
  );
}
