import styled from "styled-components";

import Grid from "../../components/ui/Grid";
import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";

const ImageContainer = styled.div`
  position: relative;
  [data-testid="statuses"] {
    position: absolute;
    right: 0.25rem;
    top: 0.35rem;
    margin: 0 auto;
    justify-content: center;
    z-index: ${zIndex.OfferStatus};
  }
`;

const OfferWrapper = styled(Grid)`
  margin-bottom: 2rem;
  padding: 0 2rem;
  ${breakpoint.l} {
    padding: 0 12rem;
  }

  > div {
    flex: 1 0 50%;
  }
`;

const StatusContainer = styled.div`
  width: 100%;
  position: absolute;
`;

const StatusSubContainer = styled.div`
  max-width: 700px;
  width: 700px;
  position: relative;
  margin: 0 auto;

  ${breakpoint.m} {
    width: initial;
  }
`;

const DarkerBackground = styled.div`
  background-color: ${colors.lightGrey};
  position: relative;

  &:before,
  &:after {
    content: "";
    width: 100rem;
    top: 0;
    bottom: 0;
    position: absolute;
    background-color: ${colors.lightGrey};
  }
  &:before {
    right: -100rem;
  }
  &:after {
    left: -100rem;
  }
`;

export {
  DarkerBackground,
  ImageContainer,
  OfferWrapper,
  StatusContainer,
  StatusSubContainer
};
