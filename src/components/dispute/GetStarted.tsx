import { FieldArray } from "formik";
import { ArrowRight } from "phosphor-react";
import React from "react";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import { useThisForm } from "../product/utils/useThisForm";
import Typography from "../ui/Typography";

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

function GetStarted({
  setCurrentStep,
  currentStep,
  buttonSteps
}: {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  currentStep: number;
  buttonSteps: string[][];
}) {
  const formValues = useThisForm();

  return (
    <>
      <div get-started="true">
        <Typography fontWeight="600" fontSize="2rem">
          Get started
        </Typography>
        <Typography fontSize="1.25rem" color={colors.darkGrey}>
          First, choose the issue you're facing with your redemption.
        </Typography>
      </div>
      <FieldArray
        name="friends"
        render={() => (
          <div>
            {buttonSteps[currentStep].map((step, index) => (
              <div key={index}>
                <FormButton
                  type="submit"
                  onClick={() => {
                    formValues.setFieldValue("getStarted", step);
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
    </>
  );
}

export default GetStarted;
