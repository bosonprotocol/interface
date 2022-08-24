import { MagnifyingGlass } from "phosphor-react";
import { useEffect, useState } from "react";
import Select, { SingleValue, StylesConfig } from "react-select";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import Grid from "../ui/Grid";

const InputWrapper = styled(Grid)`
  flex: 1;
  gap: 1rem;

  padding: 0.45rem 1.5rem;
  max-height: 2.5rem;
  background: ${colors.border};
`;

const Input = styled.input`
  width: 100%;
  font-size: 16px;
  background: transparent;
  border: 0px solid ${colors.border};

  font-family: "Plus Jakarta Sans";
  font-style: normal;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;

  &:focus {
    outline: none;
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
const SearchFilterWrapper = styled.div`
  min-width: 24.1rem;
`;

const SelectTitle = styled.strong`
  display: block;
`;

const selectOptions = [
  { value: "1", label: "Show all" },
  { value: "2", label: "Jonas to add" }
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
      borderWidth: "1px"
    },
    background: "none",
    border: "none"
  }),
  container: (provided, state) => ({
    ...provided,
    zIndex: state.isFocused ? zIndex.Select + 1 : zIndex.Select,
    position: "static",
    width: "100%",
    padding: 0
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

interface FilterValue {
  value: string;
  label: string;
}
interface Props {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  filter: FilterValue | null;
  setFilter: React.Dispatch<React.SetStateAction<FilterValue | null>>;
  buttons?: JSX.Element;
}
export default function SellerFilters({
  setSearch,
  search,
  filter,
  setFilter,
  buttons
}: Props) {
  const [searchValue, setSearchValue] = useState<string>(search);

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
  };

  useEffect(() => {
    const searchInterval = setTimeout(() => setSearch(searchValue), 1000);
    return () => clearTimeout(searchInterval);
  }, [searchValue, setSearch]);

  const handleChangeSelect = (
    option: SingleValue<{
      value: string;
      label: string;
    }>
  ) => {
    if (option) {
      console.log(option);
      setFilter(option);
    }
  };

  return (
    <Grid gap="1rem" padding="2rem 0" justifyContent="space-between">
      <div>
        <Grid gap="1rem" padding="0" justifyContent="flex-start">
          <SelectFilterWrapper>
            <SelectTitle>Filter:</SelectTitle>
            <Select
              styles={customStyles}
              isSearchable={false}
              placeholder=""
              value={filter}
              options={selectOptions}
              onChange={handleChangeSelect}
            />
          </SelectFilterWrapper>
          <SearchFilterWrapper>
            <InputWrapper>
              <MagnifyingGlass size={24} />
              <Input
                name="search"
                onChange={handleChangeSearch}
                value={searchValue}
                placeholder="Search"
              />
            </InputWrapper>
          </SearchFilterWrapper>
        </Grid>
      </div>
      {buttons && (
        <Grid justifyContent="flex-end" gap="1rem" $width="auto">
          {buttons}
        </Grid>
      )}
    </Grid>
  );
}
