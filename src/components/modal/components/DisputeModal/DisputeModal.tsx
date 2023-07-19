import { Chats, FilePlus, Handshake } from "phosphor-react";
import React from "react";
import { generatePath } from "react-router-dom";
import styled from "styled-components";

import { DrCenterRoutes } from "../../../../lib/routing/drCenterRoutes";
import { UrlParameters } from "../../../../lib/routing/parameters";
import { breakpoint } from "../../../../lib/styles/breakpoint";
import { colors } from "../../../../lib/styles/colors";
import { goToViewMode, ViewMode } from "../../../../lib/viewMode";
import Typography from "../../../ui/Typography";

const ModalGrid = styled.div`
  display: grid;
  grid-gap: 1.5rem;
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

const SubmitStyledButton = styled.button`
  font-family: "Plus Jakarta Sans";
  font-weight: 600;
  font-size: 1rem;
  border: none;
  margin-top: 1.25rem;
  background-color: ${colors.green};
  padding: 1rem 2rem 1rem 2rem;
`;

interface Props {
  exchangeId?: string;
}

function DisputeModal({ exchangeId }: Props) {
  const handleSubmitIssue = () => {
    if (exchangeId) {
      return goToViewMode(
        ViewMode.DR_CENTER,
        generatePath(DrCenterRoutes.DisputeId, {
          [UrlParameters.exchangeId]: exchangeId
        })
      );
    }
  };
  return (
    <>
      <Typography fontWeight="600" $fontSize="1.25rem">
        How does the dispute process work?
      </Typography>
      <Typography
        $fontSize="1.25rem"
        color={colors.darkGrey}
        marginTop="0.5rem"
        marginBottom="2rem"
      >
        When a buyer raises a dispute they can either create a proposal right
        away or you can propose a solution to them. When an acceptable solution
        for both parties is found the dispute will be resolved. If there is no
        acceptable solution, the buyer can escalate and the dispute will be
        resolved by a 3rd party.
      </Typography>
      <ModalGrid>
        <ModalGridColumns>
          <Chats size={24} color={colors.secondary} data-columns-icon />
          <Typography
            margin="0"
            $fontSize="1.25rem"
            color={colors.black}
            fontWeight="600"
          >
            Dispute raised by the buyer
          </Typography>
        </ModalGridColumns>
        <ModalGridColumns data-modal-columns>
          <FilePlus size={24} color={colors.secondary} data-columns-icon />
          <Typography
            margin="0"
            $fontSize="1.25rem"
            color={colors.black}
            fontWeight="600"
          >
            Proposal created and solution found
          </Typography>
        </ModalGridColumns>
        <ModalGridColumns data-modal-columns>
          <Handshake size={24} color={colors.secondary} data-columns-icon />
          <Typography
            margin="0"
            $fontSize="1.25rem"
            color={colors.black}
            fontWeight="600"
          >
            Dispute resolved or escalated
          </Typography>
        </ModalGridColumns>
      </ModalGrid>
      {exchangeId && (
        <SubmitStyledButton onClick={handleSubmitIssue}>
          Submit an issue
        </SubmitStyledButton>
      )}
    </>
  );
}

export default DisputeModal;
