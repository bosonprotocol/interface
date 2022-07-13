import styled from "styled-components";

import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";

const ImageContainer = styled.div`
  position: relative;
  [data-testid="statuses"] {
    position: absolute;
    top: 1rem;
    right: -1rem;
    margin: 0 auto;
    justify-content: center;
    z-index: ${zIndex.OfferStatus};
    border-radius: 0;
  }
`;

const OfferWrapper = styled.div`
  padding: 0;
  ${breakpoint.s} {
    padding: 0 2rem;
  }
  ${breakpoint.m} {
    padding: 0 6rem;
  }
  ${breakpoint.l} {
    padding: 0 8rem;
  }
  ${breakpoint.xl} {
    padding: 0 10rem;
  }
  > div:first-child {
    padding-top: 1rem;
  }
  > div:not(:last-child) {
    margin-bottom: 4rem;
  }
  > div:last-child {
    padding-bottom: 4rem;
  }
`;

const OfferGrid = styled.div`
  position: relative;
  display: grid;

  grid-column-gap: 1em;
  grid-row-gap: 1rem;
  grid-template-columns: repeat(1, 1fr);
  ${breakpoint.s} {
    grid-column-gap: 3rem;
    grid-row-gap: 3rem;
    grid-template-columns: repeat(2, 1fr);
  }
  > div {
    max-width: 100%;
  }
`;

const MainOfferGrid = styled.div`
  position: relative;
  display: grid;

  grid-column-gap: 1em;
  grid-row-gap: 2rem;
  grid-template-columns: repeat(1, 100%);
  grid-template-rows: 2fr;

  ${breakpoint.s} {
    grid-column-gap: 3rem;
    grid-row-gap: 3rem;
    grid-template-columns: repeat(2, 50%);
    grid-template-rows: 1fr;
  }
  > div {
    max-width: 100%;
    &:first-child {
      width: -webkit-fill-available;
      max-width: 50vw;
      margin: 0 auto;
    }
  }
`;

const StatusContainer = styled.div`
  width: 100%;
  position: absolute;
`;

const DarkerBackground = styled.div`
  padding: 2rem 0;
  max-width: 100%;
  background-color: ${colors.lightGrey};
  position: relative;
  > div:not(:last-child) {
    margin-bottom: 2rem;
  }

  &:before,
  &:after {
    content: "";
    width: 100rem;
    top: 0;
    bottom: 0;
    position: absolute;
    background-color: ${colors.lightGrey};
    z-index: -1;
  }
  &:before {
    right: -100rem;
  }
  &:after {
    left: -100rem;
  }
`;
const LightBackground = styled.div`
  max-width: 100%;
  background-color: ${colors.white};
  position: relative;
`;
const WidgetContainer = styled.div`
  width: 100%;
  max-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  iframe {
    max-width: 100%;
  }
`;

export {
  DarkerBackground,
  ImageContainer,
  LightBackground,
  MainOfferGrid,
  OfferGrid,
  OfferWrapper,
  StatusContainer,
  WidgetContainer
};
