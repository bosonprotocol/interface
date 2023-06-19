import { MagnifyingGlass } from "phosphor-react";
import { useEffect, useState } from "react";

import Grid from "../ui/Grid";
import {
  Input,
  InputWrapper,
  SearchFilterWrapper
} from "./styles/SellerFilters.styles";

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
export default function SellerFilters({ setSearch, search, buttons }: Props) {
  const [searchValue, setSearchValue] = useState<string>(search);

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
  };

  useEffect(() => {
    const searchInterval = setTimeout(() => setSearch(searchValue), 1000);
    return () => clearTimeout(searchInterval);
  }, [searchValue, setSearch]);

  // const handleChangeSelect = (
  //   option: SingleValue<{
  //     value: string;
  //     label: string;
  //   }>
  // ) => {
  //   if (option) {
  //     setFilter(option);
  //   }
  // };

  return (
    <Grid
      gap="1rem"
      padding="2rem 0"
      justifyContent="space-between"
      flexWrap="wrap"
    >
      <div>
        <Grid gap="1rem" padding="0" justifyContent="flex-start">
          {/* <SelectFilterWrapper>
            <SelectTitle>Filter:</SelectTitle>
            <Select
              styles={customStyles}
              isSearchable={false}
              placeholder=""
              value={filter}
              options={selectOptions}
              onChange={handleChangeSelect}
            />
          </SelectFilterWrapper> */}
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
