import { FieldArray } from "formik";
import { ArrowRight } from "phosphor-react";
import React from "react";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import { DisputeFormModel } from "../modal/components/DisputeModal/DisputeModalFormModel";
import { useCreateForm } from "../product/utils/useCreateForm";
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
`;

const TextContainer = styled.span`
  max-width: 31.25rem;
`;

const FieldArrayName = DisputeFormModel.formFields.getStarted.name;

function GetStarted({
  onClick,
  getStartedSteps
}: {
  onClick: (clickedStep: { label: string; id: 1 | 2 }) => void;
  getStartedSteps: Readonly<
    {
      label: string;
      id: 1 | 2;
    }[]
  >;
}) {
  const formValues = useCreateForm();

  return (
    <>
      <div>
        <Typography fontWeight="600" $fontSize="2rem">
          Get started
        </Typography>
        <Typography $fontSize="1.25rem" color={colors.darkGrey}>
          First, choose the issue you're facing with your redemption.
        </Typography>
      </div>
      <FieldArray
        name={FieldArrayName}
        render={() => (
          <div>
            {getStartedSteps.map((step) => (
              <div key={step.id}>
                <FormButton
                  type="submit"
                  onClick={() => {
                    formValues.setFieldValue(FieldArrayName, step.label);
                    onClick(step);
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

export default GetStarted;
