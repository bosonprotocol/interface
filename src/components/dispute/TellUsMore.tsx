import { FieldArray } from "formik";
import { ArrowRight } from "phosphor-react";
import React from "react";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import { useThisForm } from "../product/utils/useThisForm";
import Typography from "../ui/Typography";

const FormHeader = styled.div`
  margin-bottom: 3.125rem;
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

function TellUsMore({
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
      <FormHeader>
        <Typography fontWeight="600" fontSize="2rem">
          Tell us more about your problem
        </Typography>
        <Typography fontSize="1.25rem" color={colors.darkGrey}>
          Choose from one of the problems listed below
        </Typography>
      </FormHeader>
      <FieldArray
        name="friends"
        render={() => (
          <div>
            {buttonSteps[currentStep].map((step, index) => (
              <div key={index}>
                <FormButton
                  type="submit"
                  onClick={() => {
                    formValues.setFieldValue("tellUsMore", step);
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

export default TellUsMore;
