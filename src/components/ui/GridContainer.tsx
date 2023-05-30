import { CSSProperties } from "react";
import styled from "styled-components";

import { breakpoint } from "../../lib/styles/breakpoint";

export interface ItemsPerRow {
  xs: number;
  s: number;
  m: number;
  l: number;
  xl: number;
}

interface ColumnGapPerRow {
  xs: CSSProperties["columnGap"];
  s: CSSProperties["columnGap"];
  m: CSSProperties["columnGap"];
  l: CSSProperties["columnGap"];
  xl: CSSProperties["columnGap"];
}

interface RowGapPerRow {
  xs: CSSProperties["rowGap"];
  s: CSSProperties["rowGap"];
  m: CSSProperties["rowGap"];
  l: CSSProperties["rowGap"];
  xl: CSSProperties["rowGap"];
}

const GridContainer = styled.div<{
  itemsPerRow?: Partial<ItemsPerRow>;
  columnGapPerRow?: Partial<ColumnGapPerRow>;
  rowGapPerRow?: Partial<RowGapPerRow>;
  columnGap?: CSSProperties["columnGap"];
  rowGap?: CSSProperties["rowGap"];
}>`
  display: grid;
  grid-column-gap: ${({ columnGap }) => columnGap || "2rem"};
  grid-row-gap: ${({ rowGap }) => rowGap || "2rem"};

  grid-template-columns: repeat(1, minmax(0, 1fr));
  ${breakpoint.xs} {
    grid-template-columns: repeat(${({ itemsPerRow }) =>
      itemsPerRow?.xs || "2"}, minmax(0, 1fr))};
    grid-column-gap: ${({ columnGapPerRow }) => columnGapPerRow?.xs};
    grid-row-gap: ${({ rowGapPerRow }) => rowGapPerRow?.xs};
  }
  ${breakpoint.s} {
    grid-template-columns: repeat(${({ itemsPerRow }) =>
      itemsPerRow?.s || "3"}, minmax(0, 1fr))};
    grid-column-gap: ${({ columnGapPerRow }) => columnGapPerRow?.s};
    grid-row-gap: ${({ rowGapPerRow }) => rowGapPerRow?.s};
  }
  ${breakpoint.m} {
    grid-template-columns: repeat(${({ itemsPerRow }) =>
      itemsPerRow?.m || "3"}, minmax(0, 1fr))};
    grid-column-gap: ${({ columnGapPerRow }) => columnGapPerRow?.m};
    grid-row-gap: ${({ rowGapPerRow }) => rowGapPerRow?.m};
  }
  ${breakpoint.l} {
    grid-template-columns: repeat(${({ itemsPerRow }) =>
      itemsPerRow?.l || "3"}, minmax(0, 1fr))};
    grid-column-gap: ${({ columnGapPerRow }) => columnGapPerRow?.l};
    grid-row-gap: ${({ rowGapPerRow }) => rowGapPerRow?.l};
  }
  ${breakpoint.xl} {
    grid-template-columns: repeat(${({ itemsPerRow }) =>
      itemsPerRow?.xl || "3"}, minmax(0, 1fr))};
    grid-column-gap: ${({ columnGapPerRow }) => columnGapPerRow?.xl};
    grid-row-gap: ${({ rowGapPerRow }) => rowGapPerRow?.xl};
  }
`;

export default GridContainer;
