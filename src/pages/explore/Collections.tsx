import React, { useMemo, useState } from "react";
import ReactSelect, { StylesConfig } from "react-select";
import { FilterValue } from "react-table";
import styled from "styled-components";

import CollectionsCard from "../../components/modal/components/Explore/Collections/CollectionsCard";
import Grid from "../../components/ui/Grid";
import Typography from "../../components/ui/Typography";
import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import { useCollections } from "../../lib/utils/hooks/useCollections";

const selectOptions = [
  { value: "1", label: "Price Low to High ($)" },
  { value: "2", label: "Price High to Low ($)" },
  { value: "3", label: "Recently Created" },
  { value: "4", label: "Recently Live" },
  { value: "5", label: "Recently Committed" },
  { value: "6", label: "Recently Redeemed" }
];

const ExploreContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto 4rem auto;
  overflow: hidden;
  background-color: ${colors.lightGrey};
  padding: 3.125rem;
`;

const CreatorsGrid = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 25% 25% 25% 25%;
  grid-gap: 0.5rem;
  grid-row-gap: 2rem;
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

function Collections() {
  const [filter, setFilter] = useState<FilterValue | null>(null);
  const { data } = useCollections();

  const collections = useMemo(
    () => data && data.filter((item) => item.offers.length > 0),
    [data]
  );

  return (
    <>
      <Grid>
        <h1>Collections</h1>
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
      </Grid>
      <ExploreContainer>
        <CreatorsGrid>
          {collections &&
            collections.map((collection) => (
              <CollectionsCard key={collection.id} collection={collection} />
            ))}
        </CreatorsGrid>
      </ExploreContainer>
    </>
  );
}

export default Collections;
