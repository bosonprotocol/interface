import { CheckCircle, FileText, HandsClapping } from "phosphor-react";
import React from "react";
import { generatePath } from "react-router-dom";
import styled from "styled-components";

import { BosonRoutes } from "../../../../lib/routing/routes";
import { breakpoint } from "../../../../lib/styles/breakpoint";
import { colors } from "../../../../lib/styles/colors";
import { Offer } from "../../../../lib/types/offer";
import { useKeepQueryParamsNavigate } from "../../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import Typography from "../../../ui/Typography";
import { ModalProps } from "../../ModalContext";

const ModalContainer = styled.div`
  position: relative;
  min-height: 31.25rem;
  background: ${colors.white};
  top: 50%;
  padding-top: 2.5rem;
  padding-bottom: 7.1875rem;
  max-width: 92.5rem;
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: -1.875rem;
  margin-top: -3.125rem;
  min-height: max-content;
`;

const ModalGrid = styled.div`
  display: grid;
  grid-gap: 1.5rem;
  padding-left: 2.5rem;
  padding-right: 4rem;
  grid-template-columns: 100%;
  ${breakpoint.m} {
    grid-template-columns: 32% 32% 32%;
  }
`;

const ModalGridColumns = styled.div`
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
  [data-columns-icon] {
    margin-bottom: 0.9375rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
  border-top: 0.0625rem solid ${colors.lightGrey};
  position: absolute;
  width: 100%;
  left: -2rem;
  width: calc(100% + 3.875rem);
  [data-button] {
    font-family: "Plus Jakarta Sans";
    font-weight: 600;
    font-size: 1rem;
    border: none;
    margin-top: 1.25rem;
  }
  [data-button-submit]:nth-of-type(1) {
    background-color: ${colors.green};
    padding: 1rem 2rem 1rem 2rem;
    margin-left: 4.375rem;
  }
  [data-button-back]:nth-of-type(2) {
    background: none;
    padding: 1rem 2rem 1rem 2rem;
    margin-right: 4.375rem;
  }
`;

interface Props {
  hideModal: NonNullable<ModalProps["hideModal"]>;
  exchange: NonNullable<Offer["exchanges"]>[number];
}

function DisputeModal({ hideModal, exchange }: Props) {
  console.log("exchange", exchange);
  const navigate = useKeepQueryParamsNavigate();

  const handleSubmitIssue = () => {
    navigate({
      pathname: generatePath(`${BosonRoutes.Dispute}/${exchange.id}`)
    });
  };
  return (
    <>
      <ModalContainer>
        <ModalGrid>
          <ModalGridColumns>
            <FileText size={24} color={colors.secondary} data-columns-icon />
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
              color={colors.darkGrey}
              fontWeight="400"
            >
              Message the Seller about the issue. Most problems are resolved by
              working with the Seller this way.
            </Typography>
          </ModalGridColumns>
          <ModalGridColumns data-modal-columns>
            <CheckCircle size={24} color={colors.secondary} data-columns-icon />
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
              color={colors.darkGrey}
              fontWeight="400"
            >
              If you still need help or the Seller has not responded, you can
              raise a dispute while the exchange is in the dispute period.
            </Typography>
          </ModalGridColumns>
          <ModalGridColumns data-modal-columns>
            <HandsClapping
              size={24}
              color={colors.secondary}
              data-columns-icon
            />
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
              color={colors.darkGrey}
              fontWeight="400"
            >
              Find a solution to your dispute with the seller. If you are unable
              to reach a resolution with the Seller, you always have the option
              to escalate to a 3rd party dispute resolver.
            </Typography>
          </ModalGridColumns>
        </ModalGrid>
        <ButtonContainer>
          <button data-button data-button-submit onClick={handleSubmitIssue}>
            Submit an issue
          </button>
          <button
            data-button
            data-button-back
            onClick={() => {
              hideModal();
            }}
          >
            Back
          </button>
        </ButtonContainer>
      </ModalContainer>
    </>
  );
}

export default DisputeModal;
