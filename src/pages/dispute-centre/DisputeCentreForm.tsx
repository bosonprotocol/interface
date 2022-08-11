import { FieldArray, Form } from "formik";
import { ArrowRight, Info, MagnifyingGlass } from "phosphor-react";
import React from "react";
import styled from "styled-components";

import { Input, Select } from "../../components/form";
import DocumentsUploader from "../../components/form/DocumentsUploader";
import Typography from "../../components/ui/Typography";
import { colors } from "../../lib/styles/colors";

function DisputeCentreForm({
  setCurrentStep,
  currentStep
}: {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  currentStep: number;
}) {
  const buttonSteps = [
    ["Item was not delivered or delivered late", "Item is not as described"],
    [
      "The item received is a different colour, model, version, or size",
      "The item has a different design or material",
      "The item is damaged or is missing parts",
      "The item was advertised as authentic but is not authentic",
      "The condition of the item is misrepresented (e.g., the item is described as new but is used)",
      "Other ..."
    ]
  ];

  const FlexContainer = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
  `;

  const FormButton = styled.button`
    border: none;
    background: none;
    color: ${colors.secondary};
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
    border-bottom: 1px solid ${colors.lightGrey};
    padding: 0;
    font-size: 1rem;
    font-family: "Plus Jakarta Sans";
    padding-bottom: 1.5rem;
    text-align: left;
    margin-top: 1.5rem;
    font-weight: 600;
    [text-container] {
      max-width: 31.25rem;
    }
  `;

  const FormHeader = styled.div`
    margin-bottom: 3.125rem;
  `;

  const DocumentsHeader = styled.div`
    margin-bottom: 3.125rem;
  `;

  const InputContainer = styled.div`
    position: relative;
    margin-bottom: 5rem;
    margin-top: 0.75rem;
    input {
      background: ${colors.lightGrey};
      border: none;
      padding: 1rem;
      width: 100%;
      padding-left: 2.8125rem;
      font-size: 1rem;
      font-weight: 400;
    }
    svg {
      position: absolute;
      left: 1.25rem;
      top: 50%;
      transform: translateY(-50%);
      color: ${colors.darkGrey};
    }
  `;

  const UploadContainer = styled.div`
    div:nth-of-type(1) {
      display: flex;
      align-items: center;
      svg {
        color: ${colors.darkGrey};
      }
    }
  `;

  const NextButton = styled.button`
    border: none;
    background: ${colors.lightGrey};
    color: ${colors.secondary};
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    border: none;
    padding: 16px 32px 16px 32px;
    font-size: 1rem;
    font-family: "Plus Jakarta Sans";
    text-align: left;
    margin-top: 1.5rem;
    font-weight: 600;
    width: min-content;
  `;

  const SkipButton = styled.button`
    border: none;
    color: ${colors.secondary};
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    border: none;
    padding: 16px 32px 16px 32px;
    font-size: 1rem;
    font-family: "Plus Jakarta Sans";
    text-align: left;
    margin-top: 1.5rem;
    font-weight: 600;
    width: min-content;
    background: none;
  `;

  return (
    <Form>
      {currentStep === 1 && (
        <FormHeader>
          <Typography fontWeight="600" fontSize="2rem">
            Tell us more about your problem
          </Typography>
          <Typography fontSize="1.25rem" color={colors.darkGrey}>
            Choose from one of the problems listed below
          </Typography>
        </FormHeader>
      )}
      {currentStep + 1 <= buttonSteps.length && (
        <FieldArray
          name="friends"
          render={() => (
            <div>
              {buttonSteps[currentStep].map((step, index) => (
                <div key={index}>
                  <FormButton
                    type="button"
                    onClick={() => {
                      setCurrentStep(currentStep + 1);
                    }}
                  >
                    <span text-container>{step}</span> <ArrowRight size={17} />
                  </FormButton>
                </div>
              ))}
            </div>
          )}
        />
      )}
      {currentStep + 1 === buttonSteps.length + 1 && (
        <div>
          <DocumentsHeader>
            <Typography fontWeight="600" fontSize="2rem">
              Add documents to support your case
            </Typography>
            <Typography fontSize="1.25rem" color={colors.darkGrey}>
              You may provide any information or attach any files that can
              support your case.
            </Typography>
          </DocumentsHeader>
          <Typography fontSize="1rem" color={colors.black} fontWeight="600">
            Message
          </Typography>
          <InputContainer>
            <Input
              placeholder="Write a message or description here"
              name="documentMessage"
            />
            <MagnifyingGlass size={21} />
          </InputContainer>
          <UploadContainer>
            <Typography fontSize="1rem" color={colors.black} fontWeight="600">
              Upload documents <Info size={12} />
            </Typography>
            <Typography
              fontSize="0.75rem"
              color={colors.darkGrey}
              fontWeight="400"
            >
              File format: PDF, PNG, JPG
            </Typography>
            <Typography
              fontSize="0.75rem"
              color={colors.darkGrey}
              fontWeight="400"
            >
              Max. file size: 2MB
            </Typography>
            <DocumentsUploader />
          </UploadContainer>
          <NextButton
            type="button"
            onClick={() => {
              setCurrentStep(currentStep + 1);
            }}
          >
            Next
          </NextButton>
        </div>
      )}
      {currentStep + 1 === buttonSteps.length + 2 && (
        <div>
          <DocumentsHeader>
            <Typography fontWeight="600" fontSize="2rem">
              Make a proposal
            </Typography>
            <Typography fontSize="1.25rem" color={colors.darkGrey}>
              Here you can make a proposal to the seller on how you would like
              the issue to be resolved. Note that this proposal is binding and
              if the seller agrees to it, the proposal will be implemented
              automatically.
            </Typography>
          </DocumentsHeader>
          <Typography fontSize="1.5rem" color={colors.black} fontWeight="600">
            Type of proposal
          </Typography>
          <div>&nbsp;</div>
          <Select
            placeholder="Choose the type of proposal"
            name="proposalType"
            options={[
              {
                value: "first",
                label: "Refund"
              }
            ]}
            isClearable
          />
          <FlexContainer>
            <NextButton
              type="button"
              onClick={() => {
                setCurrentStep(currentStep + 1);
              }}
            >
              Next
            </NextButton>
            <SkipButton
              type="button"
              onClick={() => {
                setCurrentStep(currentStep + 1);
              }}
            >
              Skip
            </SkipButton>
          </FlexContainer>
        </div>
      )}
      {currentStep + 1 === buttonSteps.length + 3 && (
        <div>formularz końcowy</div>
      )}
    </Form>
  );
}

export default DisputeCentreForm;
