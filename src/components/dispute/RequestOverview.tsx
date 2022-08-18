import { Check, Image, X } from "phosphor-react";
import React from "react";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import { useThisForm } from "../product/utils/useThisForm";
import Typography from "../ui/Typography";

const DocumentsHeader = styled.div`
  margin-bottom: 3.125rem;
`;

const RequestOverviewList = styled.ul`
  list-style-type: none;
  padding-left: 0;
  margin-left: 0;
  svg {
    margin-right: 5px;
    fill: ${colors.black};
    color: ${colors.black};
  }
  span {
    margin-right: 0.625rem;
    color: ${colors.black};
  }
`;

const ImageOverview = styled.div`
  display: flex;
  max-width: 290px;
  justify-content: space-between;
  background-color: ${colors.lightGrey};
  margin-right: 0.625rem;
  margin-bottom: 0.625rem;
  padding: 1rem 2.75rem 1rem 3.125rem;
  align-items: center;
  position: relative;
  svg {
    position: absolute;
    top: 1.1875rem;
    &:nth-of-type(1) {
      left: 1.25rem;
      color: ${colors.black};
    }
    &:nth-of-type(2) {
      right: 1.25rem;
      color: ${colors.darkGrey};
    }
  }
`;

const SubmitButton = styled.button`
  border: none;
  background: ${colors.green};
  color: ${colors.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border: none;
  padding: 1rem 2rem 1rem 2rem;
  font-size: 1rem;
  font-family: "Plus Jakarta Sans";
  text-align: left;
  margin-top: 1.5rem;
  font-weight: 600;
  width: min-content;
`;

const FlexContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

const SkipButton = styled.button`
  border: none;
  color: ${colors.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border: none;
  padding: 1rem 2rem 1rem 2rem;
  font-size: 1rem;
  font-family: "Plus Jakarta Sans";
  text-align: left;
  margin-top: 1.5rem;
  font-weight: 600;
  width: min-content;
  background: none;
`;

function RequestOverview({
  setCurrentStep,
  currentStep
}: {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  currentStep: number;
}) {
  const formValues = useThisForm();
  return (
    <div>
      <DocumentsHeader>
        <Typography
          fontWeight="600"
          fontSize="2rem"
          style={{ marginBottom: "30px" }}
        >
          Request overview
        </Typography>
        <Typography fontSize="1.25rem" color={colors.black} fontWeight={"600"}>
          Dispute Category
        </Typography>
        <RequestOverviewList>
          <li>
            <Check size={14} weight="bold" />
            {formValues.values?.tellUsMore}
          </li>
          <li>
            <Check size={14} weight="bold" />
            {formValues.values?.getStarted}
          </li>
        </RequestOverviewList>
        <Typography
          fontSize="1.25rem"
          color={colors.black}
          fontWeight={"600"}
          style={{ marginBottom: "15px" }}
        >
          Additional information
        </Typography>
        <Typography
          fontSize="1rem"
          color={colors.darkGrey}
          style={{ marginBottom: "30px" }}
        >
          {formValues.values?.documentMessage}
        </Typography>
        {formValues.values?.file &&
          formValues.values?.file.map((file: File) => (
            <ImageOverview>
              <Image size={20} />
              {file.name}
              <X size={20} />
            </ImageOverview>
          ))}
        <Typography fontSize="1.25rem" color={colors.black} fontWeight={"600"}>
          Resolution Proposal
        </Typography>
        <RequestOverviewList>
          <li>
            <Check size={14} weight="bold" />
            {formValues.values?.proposalType.label}
          </li>
          <li>
            <Check size={14} weight="bold" />
            <span>{formValues.values?.inEscrow} ETH</span>
            <span>${formValues.values?.refundAmount}</span>
            <span>{formValues.values?.refundPercent}%</span>
          </li>
        </RequestOverviewList>
      </DocumentsHeader>
      <FlexContainer>
        <SubmitButton type="submit">Submit</SubmitButton>
        <SkipButton
          type="button"
          onClick={() => {
            setCurrentStep(currentStep - 1);
          }}
        >
          Back
        </SkipButton>
      </FlexContainer>
    </div>
  );
}

export default RequestOverview;
