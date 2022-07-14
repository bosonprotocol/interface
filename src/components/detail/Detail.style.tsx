import { IoIosInformationCircleOutline } from "react-icons/io";
import styled from "styled-components";

import frameImage from "../../assets/frame.png";
import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import { LinkWithQuery } from "../linkStoreFields/LinkStoreFields";
import { buttonText } from "../ui/styles";

export const ChartWrapper = styled.div`
  canvas {
    max-width: 100%;
  }
`;

export const CtaModalTitle = styled.div`
  margin: 0;
  border-bottom: 2px solid ${colors.border};
  padding: 2rem 2.5rem;
  ${breakpoint.s} {
    padding: 2 3rem;
  }
  * {
    margin: 0;
  }
`;

export const CtaModalContent = styled.div`
  margin: 2rem;
  ${breakpoint.s} {
    margin: 3rem;
  }
`;

export const Labels = styled.div`
  display: flex;
  margin-left: 1rem;
`;

export const Label = styled.div<{ $background: string; $color: string }>`
  background: ${(props) => props.$background || colors.lightGrey};
  color: ${(props) => props.$color || colors.darkGrey};
  padding: 0.5rem 1rem;
  font-family: "Plus Jakarta Sans";
  font-style: normal;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.5;
  text-transform: lowercase;
  &:first-letter {
    text-transform: uppercase;
  }
`;
export const CommitStepWrapper = styled.div`
  overflow: hidden;
  margin: 1rem 0;
  display: grid;
  grid-template-columns: 1fr;
  justify-content: space-between;

  grid-template-columns: repeat(1, minmax(0, 1fr));
  grid-row-gap: 1rem;
  grid-column-gap: 1rem;
  ${breakpoint.m} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  svg {
    fill: var(--secondary);
  }
`;

export const CommitStep = styled.div`
  position: relative;
  padding: 1rem;
  background: ${colors.lightGrey};
  &:not(:last-child) {
    &:before {
      position: absolute;
      content: "";
      width: 0;
      height: 0;

      bottom: -1rem;
      left: 50%;
      transform: translate(-50%, 0);
      border-left: 30rem solid transparent;
      border-right: 30rem solid transparent;
      border-top: 1rem solid ${colors.lightGrey};
    }

    &:after {
      position: absolute;
      content: "";
      width: 0;
      height: 0;

      bottom: -2rem;
      left: 50%;
      transform: translate(-50%, 0);
      border-left: 30rem solid transparent;
      border-right: 30rem solid transparent;
      border-top: 1rem solid ${colors.white};
      z-index: 1;
    }
  }
  ${breakpoint.m} {
    &:not(:first-child) {
      padding-left: 2rem;
    }
    &:not(:last-child) {
      &:before {
        position: absolute;
        content: "";
        width: 0;
        height: 0;

        top: 50%;
        bottom: 0;
        right: -1rem;
        left: initial;
        transform: translate(0%, -50%);
        border-top: 10rem solid transparent;
        border-left: 1rem solid ${colors.lightGrey};
        border-bottom: 10rem solid transparent;
        border-right: none;
      }

      &:after {
        position: absolute;
        content: "";
        width: 0;
        height: 0;

        top: 50%;
        bottom: 0;
        right: -2rem;
        left: initial;
        transform: translate(0%, -50%);
        border-top: 10rem solid transparent;
        border-left: 1rem solid ${colors.white};
        border-bottom: 10rem solid transparent;
        border-right: none;
        z-index: 1;
      }
    }
  }
`;

export const LearnMore = styled(LinkWithQuery)`
  all: unset;
  display: flex;
  align-items: center;
  cursor: pointer;
  ${() => buttonText};
  color: var(--secondary);

  transition: all 150ms ease-in-out;
  > svg {
    transition: all 150ms ease-in-out;
    transform: translateX(0);
  }
  &:hover {
    color: ${colors.black};
    > svg {
      transform: translateX(5px);
      fill: ${colors.black};
    }
  }
`;

export const PopperWrapper = styled.div`
  position: relative;
`;

export const Popper = styled.div`
  position: absolute;
  background: ${colors.white};
  color: ${colors.black};
  padding: 1rem;
  z-index: ${zIndex.Popper};
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1), 0px 0px 8px rgba(0, 0, 0, 0.1),
    0px 0px 16px rgba(0, 0, 0, 0.1), 0px 0px 32px rgba(0, 0, 0, 0.1);

  bottom: -1rem;

  left: 0;
  min-width: 65vw;
  transform: translate(-5rem, 100%);

  ${breakpoint.s} {
    left: 50%;
    min-width: 25rem;
    transform: translate(-50%, 100%);
  }

  &:after {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-left: 0.5rem solid transparent;
    border-right: 0.5rem solid transparent;
    border-bottom: 0.55rem solid ${colors.white};
    top: 0;

    left: 0.75rem;
    transform: translate(5rem, -0.5rem);
    ${breakpoint.s} {
      left: 50%;
      transform: translate(-50%, -0.5rem);
    }
  }
`;

export const ModalBackground = styled.div`
  overflow: hidden;
  margin: 2rem -2rem -2rem -2rem;
  padding: 2rem;
  background-color: ${colors.black};
  background-image: url(${frameImage});

  background-repeat: no-repeat;
  background-position: bottom right;
  padding-right: 2rem;
  padding-bottom: 20rem;

  ${breakpoint.s} {
    padding-right: 15rem;
    padding-bottom: 12rem;
  }
  color: ${colors.white};
`;

export const ShareWrapper = styled.div`
  display: flex;
  flex-direction: column;

  ${breakpoint.s} {
    position: relative;
  }
  ${breakpoint.m} {
    position: absolute;
    max-width: 5rem;
    right: -5rem;
    top: 0;
  }
  ${breakpoint.xl} {
  }
`;

export const Notify = styled.div<{ $show: boolean }>`
  transform: ${({ $show }) => ($show ? "translateY(0)" : "translateY(10rem)")};

  transition: transform 500ms ease-in-out;
  position: fixed;
  z-index: ${zIndex.Notification};
  bottom: 1rem;
  right: 1rem;

  color: ${colors.white};
  background: ${colors.blue};
  padding: 0 1rem;
`;

export const ImageContainer = styled.div`
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

export const ImageWrapper = styled.div`
  position: relative;

  img {
    width: 100%;
  }
`;

export const GlideWrapper = styled.div`
  &:after {
    content: "";
    position: absolute;
    height: 100%;
    width: 4rem;
    z-index: ${zIndex.Carousel};
    top: 0;
    bottom: 0;
    right: 0;
    background: linear-gradient(
      -90deg,
      ${colors.lightGrey} 0%,
      transparent 100%
    );
    pointer-events: none;
  }
`;

export const GlideSlide = styled.div`
  overflow: hidden;
`;

export const InfoIcon = styled(IoIosInformationCircleOutline).attrs({
  fill: colors.bosonSkyBlue
})`
  position: relative;
  right: 2px;
  font-size: 27px;
`;

export const InfoIconTextWrapper = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
`;

export const Tabs = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 30%;
`;

export const Tab = styled("button")<{ $isSelected: boolean }>`
  all: unset;
  cursor: pointer;
  background-color: ${(props) =>
    props.$isSelected ? colors.blue : colors.lightGrey};
  padding: 0.5rem;
  font-family: "Plus Jakarta Sans";
  font-style: normal;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: ${(props) => (props.$isSelected ? colors.white : colors.black)};
  width: 200px;
  max-width: 100%;
  text-align: center;
`;

export const Toggle = styled.div`
  border: 1px solid ${colors.bosonSkyBlue};
  color: ${colors.bosonSkyBlue};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0.75rem;
  gap: 0.25rem;
  margin-bottom: 2rem;
`;

export const DetailWrapper = styled.div`
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

export const DetailGrid = styled.div`
  position: relative;
  display: grid;

  grid-column-gap: 1em;
  grid-row-gap: 1rem;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  ${breakpoint.s} {
    grid-column-gap: 3rem;
    grid-row-gap: 3rem;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  > div {
    max-width: 100%;
  }
`;

export const MainDetailGrid = styled.div`
  position: relative;
  display: grid;

  grid-column-gap: 1em;
  grid-row-gap: 2rem;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  grid-template-rows: 2fr;

  ${breakpoint.s} {
    grid-column-gap: 3rem;
    grid-row-gap: 3rem;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: 1fr;
  }
  > div {
    max-width: 100%;
  }
`;

export const StatusContainer = styled.div`
  width: 100%;
  position: absolute;
`;

export const DarkerBackground = styled.div`
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

export const LightBackground = styled.div`
  max-width: 100%;
  background-color: ${colors.white};
  position: relative;
`;

export const WidgetContainer = styled.div`
  width: 100%;
  max-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  iframe {
    max-width: 100%;
  }
`;
