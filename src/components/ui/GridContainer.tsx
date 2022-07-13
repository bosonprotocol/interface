import styled from "styled-components";

import { breakpoint } from "../../lib/styles/breakpoint";

export interface ItemsPerRow {
  xs: number;
  s: number;
  m: number;
  l: number;
  xl: number;
}

const GridContainer = styled.div<{ itemsPerRow?: Partial<ItemsPerRow> }>`
  display: grid;
  grid-column-gap: 2rem;
  grid-row-gap: 2rem;

  grid-template-columns: repeat(1, minmax(0, 1fr));
  ${breakpoint.xs} {
    grid-template-columns: repeat(${({ itemsPerRow }) =>
      itemsPerRow?.xs || "2"}, minmax(0, 1fr))};
  }
  ${breakpoint.s} {
    grid-template-columns: repeat(${({ itemsPerRow }) =>
      itemsPerRow?.s || "3"}, minmax(0, 1fr))};
  }
  ${breakpoint.m} {
    grid-template-columns: repeat(${({ itemsPerRow }) =>
      itemsPerRow?.m || "3"}, minmax(0, 1fr))};
  }
  ${breakpoint.l} {
    grid-template-columns: repeat(${({ itemsPerRow }) =>
      itemsPerRow?.l || "3"}, minmax(0, 1fr))};
  }
  ${breakpoint.xl} {
    grid-template-columns: repeat(${({ itemsPerRow }) =>
      itemsPerRow?.xl || "3"}, minmax(0, 1fr))};
  }
`;

export default GridContainer;
