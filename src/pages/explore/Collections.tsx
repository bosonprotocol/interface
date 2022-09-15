import React, { useEffect, useMemo, useState } from "react";
import ReactSelect, { StylesConfig } from "react-select";
import styled from "styled-components";

import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import CollectionsCard from "../../components/modal/components/Explore/Collections/CollectionsCard";
import Grid from "../../components/ui/Grid";
import Typography from "../../components/ui/Typography";
import { ExploreQueryParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { useQueryParameter } from "../../lib/routing/useQueryParameter";
import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";
import { useCollections } from "../../lib/utils/hooks/useCollections";
import Pagination from "./Pagination";

interface FilterValue {
  value: "asc" | "desc";
  label: string;
}

const selectOptions = [
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" }
] as const;

const ExploreContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto 4rem auto;
  overflow: hidden;
  background-color: ${colors.lightGrey};
  padding: 3.125rem;
`;

const CreatorsGrid = styled.div<{ $isLteS: boolean; $isLteXS: boolean }>`
  display: grid;
  width: 100%;
  grid-template-columns: 25% 25% 25% 25%;
  grid-template-columns: ${({ $isLteS }) => $isLteS && "50%"};
  grid-template-columns: ${({ $isLteXS }) => $isLteXS && "100%"};
  grid-gap: 0.5rem;
  grid-row-gap: 2rem;
`;

const SelectFilterWrapper = styled.div`
  position: relative;
  min-width: 10.125rem;
  max-height: 2.5rem;
  padding: 0.5rem 0.75rem 0.5rem 1rem;
  display: flex;
  align-items: center;
`;

// const CardButton = styled.button`
//   background: none;
//   border: none;
//   width: 100%;
// `;

const BreadcrumbsContainer = styled.div`
  display: block;
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
  const [filter, setFilter] = useState<FilterValue>(selectOptions[0]);
  const [sortQueryParameter, setSortQueryParameter] = useQueryParameter(
    ExploreQueryParameters.orderDirection
  );
  useEffect(() => {
    if (sortQueryParameter) {
      setFilter(
        selectOptions.filter((option) => option.value === sortQueryParameter)[0]
      );
    }
  }, [sortQueryParameter]);
  const [pageIndex, setPageIndex] = useState(0);
  const OFFERS_PER_PAGE = 8;
  const useCollectionPayload = {
    first: OFFERS_PER_PAGE * 2,
    skip: OFFERS_PER_PAGE * pageIndex,
    orderDirection: filter.value,
    validFromDate: "1662847140",
    validUntilDate: "1662847140"
  };
  const { data } = useCollections({
    ...useCollectionPayload
  });

  const { isLteXS, isLteS } = useBreakpoints();

  const collections = useMemo(
    () => data && data.filter((item) => item.offers.length > 0),
    [data]
  );

  const currentAndNextPageOffers = useMemo(() => {
    if (data) {
      return data.length / 3;
    }
    return 1;
  }, [data]);

  return (
    <>
      <Grid>
        <Typography
          $fontSize="32px"
          fontWeight="600"
          margin="0.67em 0 0.67em 0"
        >
          Sellers
        </Typography>
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
              setFilter(option as typeof selectOptions[number]);
              setSortQueryParameter(option?.value || "");
            }}
          />
        </SelectFilterWrapper>
      </Grid>
      <ExploreContainer>
        <BreadcrumbsContainer>
          <Breadcrumbs
            steps={[
              {
                id: 0,
                label: "Explore",
                url: `${BosonRoutes.Explore}`,
                hightlighted: true
              },
              {
                id: 1,
                label: "All sellers",
                url: `${BosonRoutes.Sellers}`,
                hightlighted: false
              }
            ]}
            margin="-0.625rem 0 2rem 0"
          />
        </BreadcrumbsContainer>
        <CreatorsGrid $isLteS={isLteS} $isLteXS={isLteXS}>
          {collections &&
            collections.map((collection) => (
              <CollectionsCard key={collection.id} collection={collection} />
            ))}
        </CreatorsGrid>
      </ExploreContainer>
      <div>
        <Pagination
          defaultPage={pageIndex}
          isNextEnabled={(currentAndNextPageOffers || 0) >= 1 + 1}
          isPreviousEnabled={true}
          onChangeIndex={(index) => {
            setPageIndex(index);
          }}
        />
      </div>
    </>
  );
}

export default Collections;
