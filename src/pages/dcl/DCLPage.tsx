import { Form, Formik } from "formik";
import { ArrowLeft } from "phosphor-react";
import React, { CSSProperties, useEffect, useState } from "react";
import styled from "styled-components";

import { useLayoutContext } from "../../components/layout/Context";
import { Close } from "../../components/modal/header/styles";
import { getSellerCenterPath } from "../../components/seller/paths";
import MultiSteps from "../../components/step/MultiSteps";
import Grid from "../../components/ui/Grid";
import { colors } from "../../lib/styles/colors";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { DetailsStep } from "./steps/details/DetailsStep";
import { ExecuteStep } from "./steps/execute/ExecuteStep";
import { DCLLayout } from "./styles";
import { FormType, validationSchema } from "./validationSchema";
const Background = styled.div`
  width: 100%;
`;

const StyledGrid = styled(Grid)`
  height: calc(48px + 1.1875rem * 2);
  position: relative;
  background: ${colors.white};
  + * {
    padding-top: 1.75rem;
  }
`;

const STEPS = [
  {
    name: "Details",
    steps: 1
  } as const,
  {
    name: "Execute",
    steps: 1
  } as const
];

interface DCLPageProps {
  offerIds?: string[];
}

enum Step {
  _0_DETAILS = "_0_DETAILS",
  _1_EXECUTE = "_1_EXECUTE"
}

const stepToNumber = {
  [Step._0_DETAILS]: 0,
  [Step._1_EXECUTE]: 1
} as const;

const numberToStep = {
  0: Step._0_DETAILS,
  1: Step._1_EXECUTE
} as const;

const iconStyle: CSSProperties = {
  cursor: "pointer",
  margin: "1.1875rem",
  position: "absolute",
  top: 0,
  color: colors.darkGrey
};
const iconSize = 32;

export const DCLPage: React.FC<DCLPageProps> = () => {
  const { setFullWidth, fullWidth } = useLayoutContext();
  const navigate = useKeepQueryParamsNavigate();
  const [currentStep, setCurrentStep] = useState<Step>(Step._0_DETAILS);
  const goToNextStep = () => {
    setCurrentStep((prev) => {
      if (prev === Step._0_DETAILS) {
        return Step._1_EXECUTE;
      }
      return prev;
    });
  };

  const onClose = () =>
    navigate({
      pathname: getSellerCenterPath("Sales Channels")
    });
  useEffect(() => {
    return () => {
      fullWidth && setFullWidth(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Background
      style={{
        background: colors.white
      }}
    >
      <Formik<FormType>
        initialValues={{
          location: ""
        }}
        validationSchema={validationSchema}
        onSubmit={() => {
          //
        }}
      >
        {() => {
          return (
            <Form style={{ height: "100%" }}>
              <StyledGrid>
                <ArrowLeft
                  style={{ ...iconStyle }}
                  size={iconSize}
                  onClick={() => {
                    if (currentStep === Step._0_DETAILS) {
                      onClose();
                    } else {
                      setCurrentStep((prev) => {
                        if (prev === Step._1_EXECUTE) {
                          return Step._0_DETAILS;
                        }
                        return prev;
                      });
                    }
                  }}
                />

                <DCLLayout width="100%">
                  <MultiSteps
                    hideArrows
                    data={STEPS}
                    active={stepToNumber[currentStep]}
                    callback={(stepInNumber) => {
                      const nextStep =
                        numberToStep[stepInNumber as keyof typeof numberToStep];
                      setCurrentStep(nextStep);
                    }}
                    disableInactiveSteps
                  />
                </DCLLayout>
                <Close
                  style={{
                    ...iconStyle,
                    right: 0
                  }}
                  size={iconSize}
                  onClick={() => {
                    onClose();
                  }}
                />
              </StyledGrid>
              {currentStep === Step._0_DETAILS ? (
                <DetailsStep goToNextStep={goToNextStep} />
              ) : currentStep === Step._1_EXECUTE ? (
                <ExecuteStep handleOnClose={onClose} />
              ) : (
                <div>Something went wrong, please try again...</div>
              )}
            </Form>
          );
        }}
      </Formik>
    </Background>
  );
};
