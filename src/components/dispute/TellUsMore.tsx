import { FieldArray } from "formik";
import { defaultFontFamily } from "lib/styles/fonts";
import { useDisputeForm } from "pages/dispute-centre/const";
import { ArrowRight } from "phosphor-react";
import React from "react";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import { DisputeFormModel } from "../modal/components/DisputeModal/DisputeModalFormModel";
import Grid from "../ui/Grid";
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
  font-family: ${defaultFontFamily};
  padding-bottom: 1.5rem;
  text-align: left;
  margin-top: 1.5rem;
  font-weight: 600;
`;

const TextContainer = styled.span`
  max-width: 31.25rem;
`;
const FieldArrayName = DisputeFormModel.formFields.tellUsMore.name;

function TellUsMore({
  setCurrentStep,
  currentStep,
  tellUsMoreSteps
}: {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  currentStep: number;
  tellUsMoreSteps: Readonly<
    {
      label: string;
      id: number;
    }[]
  >;
}) {
  const formValues = useDisputeForm();

  return (
    <>
      <Grid
        margin="0 0 3.125rem 0"
        flexDirection="column"
        alignItems="flex-start"
      >
        <Typography fontWeight="600" $fontSize="2rem">
          Tell us more about your problem
        </Typography>
        <Typography $fontSize="1.25rem" color={colors.darkGrey}>
          Choose from one of the problems listed below
        </Typography>
      </Grid>
      <FieldArray
        name={FieldArrayName}
        render={() => (
          <div>
            {tellUsMoreSteps.map((step) => (
              <div key={step.id}>
                <FormButton
                  type="submit"
                  onClick={() => {
                    formValues.setFieldValue(FieldArrayName, step.label);
                    setCurrentStep(currentStep + 1);
                  }}
                >
                  <TextContainer>{step.label}</TextContainer>{" "}
                  <ArrowRight size={17} />
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
