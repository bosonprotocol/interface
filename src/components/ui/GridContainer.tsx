import { CSSProperties } from "react";
import styled, { css } from "styled-components";

import { breakpoint } from "../../lib/styles/breakpoint";

export interface ItemsPerRow {
  xs: number;
  s: number;
  m: number;
  l: number;
  xl: number;
}

export interface ColumnGapPerRow {
  xs: CSSProperties["columnGap"];
  s: CSSProperties["columnGap"];
  m: CSSProperties["columnGap"];
  l: CSSProperties["columnGap"];
  xl: CSSProperties["columnGap"];
}

export interface RowGapPerRow {
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
  defaultSize?: string;
}>`
  display: grid;
  grid-column-gap: ${({ columnGap }) => columnGap || "2rem"};
  grid-row-gap: ${({ rowGap }) => rowGap || "2rem"};
  ${({
    defaultSize = "minmax(0, 1fr)",
    itemsPerRow,
    columnGapPerRow,
    rowGapPerRow
  }) => css`
    grid-template-columns: repeat(1, ${defaultSize});
    ${breakpoint.xs} {
      grid-template-columns: repeat(${() =>
        itemsPerRow?.xs || "2"}, ${defaultSize})};
      grid-column-gap: ${() => columnGapPerRow?.xs};
      grid-row-gap: ${() => rowGapPerRow?.xs};
    }
    ${breakpoint.s} {
      grid-template-columns: repeat(${() =>
        itemsPerRow?.s || "3"}, ${defaultSize})};
      grid-column-gap: ${() => columnGapPerRow?.s};
      grid-row-gap: ${() => rowGapPerRow?.s};
    }
    ${breakpoint.m} {
      grid-template-columns: repeat(${() =>
        itemsPerRow?.m || "3"}, ${defaultSize})};
      grid-column-gap: ${() => columnGapPerRow?.m};
      grid-row-gap: ${() => rowGapPerRow?.m};
    }
    ${breakpoint.l} {
      grid-template-columns: repeat(${() =>
        itemsPerRow?.l || "3"}, ${defaultSize})};
      grid-column-gap: ${() => columnGapPerRow?.l};
      grid-row-gap: ${() => rowGapPerRow?.l};
    }
    ${breakpoint.xl} {
      grid-template-columns: repeat(${() =>
        itemsPerRow?.xl || "3"}, ${defaultSize})};
      grid-column-gap: ${() => columnGapPerRow?.xl};
      grid-row-gap: ${() => rowGapPerRow?.xl};
    }
  `}
`;

export default GridContainer;
