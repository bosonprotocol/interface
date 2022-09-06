import styled from "styled-components";

import { colors } from "../../lib/styles/colors";

export const ProfileSectionWrapper = styled.div`
  max-width: 65.75rem;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 2rem;
  padding-right: 2rem;
  box-sizing: border-box;
`;

export const GrayWrapper = styled.div`
  background-color: ${colors.lightGrey};
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  padding: 4rem 0;
  &::before {
    content: "";
    position: absolute;
    top: 0px;
    width: 100%;
    height: 1px;
    box-shadow: 0px 0 10px rgba(0, 0, 0, 0.4);
    background: transparent;
  }
`;

export const BasicInfo = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 0rem;
`;

export const BannerImage = styled.img`
  height: 11.875rem;
  width: 100vw;
  object-fit: cover;
  z-index: -1;
  position: absolute;
  left: 0;
  right: 0;
`;

export const BannerImageLayer = styled.div`
  height: 11.875rem;
  position: relative;
`;

export const AvatarContainer = styled.div`
  display: flex;
  position: absolute;
  top: 50%;
  div {
    width: 10rem !important;
    height: 10rem !important;
    overflow: hidden;
  }
`;

export const AddressContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 1rem;
  flex-basis: 50%;
  img {
    width: 30px;
    height: 30px;
    margin-right: 5px;
  }
`;

export const AvatarEmptySpace = styled.div`
  min-width: 11rem;
`;

export const SocialIconContainer = styled.div`
  display: flex;
  svg {
    color: ${colors.secondary};
  }
`;

export const SocialIcon = styled.a<{ $isDisabled: boolean }>`
  margin-left: 1.5rem;
  cursor: ${({ $isDisabled }) => ($isDisabled ? "default" : "pointer")};
  pointer-events: ${({ $isDisabled }) => ($isDisabled ? "none" : "auto")};
`;

export const DetailShareWrapper = styled.div`
  position: relative;
  margin-left: 1.5rem;
  div:first-of-type {
    position: relative;
    top: auto;
    right: auto;
    button {
      padding: 0 !important;
      margin: 0;
    }
  }
`;

export const LoadingWrapper = styled.div`
  padding: 2rem;
  text-align: center;
  color: ${colors.secondary};
`;
