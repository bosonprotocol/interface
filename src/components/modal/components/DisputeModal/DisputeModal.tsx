import { CheckCircle, FileText, HandsClapping, X } from "phosphor-react";
import React from "react";
import styled from "styled-components";

import { breakpoint } from "../../../../lib/styles/breakpoint";
import { colors } from "../../../../lib/styles/colors";
import { zIndex } from "../../../../lib/styles/zIndex";
import Typography from "../../../ui/Typography";

const ModalBackground = styled.div<{
  $isModalOpened?: boolean;
}>`
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: ${zIndex.Modal};
  display: ${({ $isModalOpened }) => ($isModalOpened ? "block" : "none")};
`;

const ModalContainer = styled.div`
  position: absolute;
  width: 70vw;
  min-height: 500px;
  background: ${colors.white};
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding-top: 2.5rem;
  padding-bottom: 2.5rem;
  top: calc(50vh - 10px);
  max-width: 1120px;
  div {
    svg {
      color: ${colors.secondary};
    }
  }
`;

const ModalHeader = styled.div`
  margin-bottom: 3.125rem;
  position: relative;
  padding-left: 2.5rem;
  padding-right: 2.5rem;
  border-bottom: 0.0625rem solid ${colors.lightGrey};
  display: flex;
  justify-content: space-between;
  padding-bottom: 1.5rem;
  > svg {
    color: ${colors.black};
  }
  button {
    background: none;
    border: none;
    padding: none;
    margin: none;
  }
`;

const ModalGrid = styled.div`
  display: grid;

  grid-gap: 24px;
  padding-left: 2.5rem;
  padding-right: 4rem;
  grid-template-columns: 100%;
  ${breakpoint.m} {
    grid-template-columns: 32% 32% 32%;
  }
  > div {
    background-color: ${colors.lightGrey};
    padding: 1.5625rem;
    grid-gap: 0.3125rem;
    position: relative;
    &:nth-of-type(1) {
      &:after {
        background-color: ${colors.lightGrey};
        content: "";
        bottom: calc(-100% + 1px);
        width: 100%;
        top: unset;
        clip-path: polygon(50% 10%, 0 0, 100% 0);
        height: 100%;
        position: absolute;
        left: 0;
        ${breakpoint.m} {
          clip-path: polygon(0 0, 0% 100%, 13% 49%);
          background-color: ${colors.lightGrey};
          content: "";
          height: 100%;
          width: 6.25rem;
          position: absolute;
          right: -6.1875rem;
          top: 0;
          bottom: unset;
          left: unset;
        }
      }
    }
    &:nth-of-type(2) {
      &:before {
        clip-path: polygon(50% 10%, 0 0, 100% 0);
        background-color: ${colors.white};
        content: "";
        height: 100%;
        width: 100%;
        position: absolute;
        left: 0;
        top: -0.0625rem;
        ${breakpoint.m} {
          clip-path: polygon(0 0, 0% 100%, 13% 49%);
          background-color: ${colors.white};
          content: "";
          height: 100%;
          width: 6.25rem;
          position: absolute;
          left: -0.0625rem;
          top: 0;
        }
      }
      &:after {
        background-color: ${colors.lightGrey};
        content: "";
        bottom: calc(-100% + 0.0625rem);
        width: 100%;
        top: unset;
        clip-path: polygon(50% 10%, 0 0, 100% 0);
        height: 100%;
        position: absolute;
        left: 0;
        ${breakpoint.m} {
          clip-path: polygon(0 0, 0% 100%, 13% 49%);
          background-color: ${colors.lightGrey};
          content: "";
          height: 100%;
          width: 6.25rem;
          position: absolute;
          right: -6.1875rem;
          top: 0;
          bottom: unset;
          left: unset;
        }
      }
    }
    &:nth-of-type(3) {
      &:before {
        clip-path: polygon(50% 10%, 0 0, 100% 0);
        background-color: ${colors.white};
        content: "";
        height: 100%;
        width: 100%;
        position: absolute;
        left: 0;
        top: -0.0625rem;
        ${breakpoint.m} {
          clip-path: polygon(0 0, 0% 100%, 13% 49%);
          background-color: ${colors.white};
          content: "";
          height: 100%;
          width: 6.25rem;
          position: absolute;
          left: -0.0625rem;
          top: 0;
        }
      }
    }
    svg {
      margin-bottom: 0.9375rem;
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 2rem 2.5rem 2rem 2.5rem;
  margin-top: 1.5rem;
  border-top: 0.0625rem solid ${colors.lightGrey};
  button:nth-of-type(1) {
    background-color: ${colors.green};
    padding: 1rem 2rem 1rem 2rem;
    font-weight: 600;
    font-size: 1rem;
    border: none;
  }
  button:nth-of-type(2) {
    background: none;
    padding: 1rem 2rem 1rem 2rem;
    font-weight: 600;
    font-size: 1rem;
    border: none;
  }
`;

interface Props {
  isModalOpened: boolean;
  setIsModalOpened: (p: boolean) => void;
}

function DisputeModal({ isModalOpened, setIsModalOpened }: Props) {
  return (
    <ModalBackground $isModalOpened={isModalOpened}>
      <ModalContainer>
        <ModalHeader>
          <Typography
            margin="0"
            fontSize="1.5rem"
            color={colors.black}
            fontWeight="600"
          >
            Raise a problem
          </Typography>
          <button
            onClick={() => {
              setIsModalOpened(!isModalOpened);
            }}
          >
            <X size={24} />
          </button>
        </ModalHeader>
        <ModalGrid>
          <div>
            <FileText size={24} />
            <Typography
              margin="0"
              fontSize="1.25rem"
              color={colors.black}
              fontWeight="600"
            >
              Explain your problem
            </Typography>
            <Typography
              margin="0"
              fontSize="1rem"
              color={colors.black}
              fontWeight="400"
            >
              Message the Seller about the issue. Most problems are resolved by
              working with the Seller this way.
            </Typography>
          </div>
          <div>
            <CheckCircle size={24} />
            <Typography
              margin="0"
              fontSize="1.25rem"
              color={colors.black}
              fontWeight="600"
            >
              Submit Dispute
            </Typography>
            <Typography
              margin="0"
              fontSize="1rem"
              color={colors.black}
              fontWeight="400"
            >
              If you still need help or the Seller has not responded, you can
              raise a dispute while the exchange is in the dispute period.
            </Typography>
          </div>
          <div>
            <HandsClapping size={24} />
            <Typography
              margin="0"
              fontSize="1.25rem"
              color={colors.black}
              fontWeight="600"
            >
              Take action
            </Typography>
            <Typography
              margin="0"
              fontSize="1rem"
              color={colors.black}
              fontWeight="400"
            >
              Find a solution to your dispute with the seller. If you are unable
              to reach a resolution with the Seller, you always have the option
              to escalate to a 3rd party dispute resolver.
            </Typography>
          </div>
        </ModalGrid>
        <ButtonContainer>
          <button>Submit an issue</button>
          <button>Back</button>
        </ButtonContainer>
      </ModalContainer>
    </ModalBackground>
  );
}

export default DisputeModal;
