import { Form, Formik } from "formik";
import { ArrowLeft } from "phosphor-react";
import React, { CSSProperties, useState } from "react";
import styled from "styled-components";
import * as Yup from "yup";

import { Close } from "../../components/modal/header/styles";
import { getSellerCenterPath } from "../../components/seller/paths";
import MultiSteps from "../../components/step/MultiSteps";
import Grid from "../../components/ui/Grid";
import { colors } from "../../lib/styles/colors";
import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { DetailsStep } from "./steps/details/DetailsStep";
import { ExecuteStep } from "./steps/execute/ExecuteStep";
import { SelectProductStep } from "./steps/select-product/SelectProductStep";
import { DCLLayout } from "./styles";
const Background = styled.div`
  width: 100%;
`;

const StyledGrid = styled(Grid)`
  height: calc(48px + 1.1875rem * 2);
  position: relative;
  background: ${colors.white};
  border: 2px solid ${colors.border};
  + * {
    padding: 1.75rem 0 0 0;
  }
`;

const STEPS = [
  {
    name: "Select Product",
    steps: 1
  } as const,
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
  _0_SELECT_PRODUCT = "_0_SELECT_PRODUCT",
  _1_DETAILS = "_1_DETAILS",
  _2_EXECUTE = "_2_EXECUTE"
}

const stepToNumber = {
  [Step._0_SELECT_PRODUCT]: 0,
  [Step._1_DETAILS]: 1,
  [Step._2_EXECUTE]: 2
} as const;

const numberToStep = {
  0: Step._0_SELECT_PRODUCT,
  1: Step._1_DETAILS,
  2: Step._2_EXECUTE
} as const;

const validationSchemas = [
  Yup.object({
    step0: Yup.object({
      offerIds: Yup.array(Yup.string()).optional()
    })
  }),
  Yup.object({
    step1: Yup.object({
      location: Yup.string().oneOf(["own-land", "boson-land"])
    })
  }),
  Yup.object({
    step1: Yup.object({
      location: Yup.string().oneOf(["own-land", "boson-land"])
    }),
    step2: Yup.object({
      locationUrl: Yup.string()
    })
  })
];

const iconStyle: CSSProperties = {
  cursor: "pointer",
  margin: "1.1875rem",
  position: "absolute",
  top: 0
};
const iconSize = 48;

export const DCLPage: React.FC<DCLPageProps> = ({ offerIds }) => {
  const navigate = useKeepQueryParamsNavigate();
  const { isLteS } = useBreakpoints();
  const [currentStep, setCurrentStep] = useState<Step>(Step._1_DETAILS);
  const stepNumber = stepToNumber[currentStep];
  const validationSchema = validationSchemas[stepNumber];
  const goToNextStep = () => {
    setCurrentStep((prev) => {
      if (prev === Step._0_SELECT_PRODUCT) {
        return Step._1_DETAILS;
      }
      if (prev === Step._1_DETAILS) {
        return Step._2_EXECUTE;
      }
      return prev;
    });
  };
  const onClose = () =>
    navigate({
      pathname: getSellerCenterPath("Sales Channels")
    });
  return (
    <Background
      style={{
        background:
          Step._0_SELECT_PRODUCT === currentStep
            ? colors.lightGrey
            : colors.white
      }}
    >
      <Formik
        initialValues={{
          step0: {
            offerIds: offerIds
          },
          step1: {
            location: undefined
          },
          step2: {
            locationUrl: undefined
          }
        }}
        validationSchema={validationSchema}
        onSubmit={(...args) => {
          console.log("onSubmit", { ...args });
        }}
      >
        {({ ...rest }) => {
          console.log("form", { ...rest });
          return (
            <Form style={{ height: "100%" }}>
              <StyledGrid>
                {!isLteS && (
                  <ArrowLeft
                    style={{ ...iconStyle, position: "absolute" }}
                    size={iconSize}
                    onClick={() => {
                      if (currentStep === Step._0_SELECT_PRODUCT) {
                        navigate({
                          pathname: getSellerCenterPath("Sales Channels")
                        });
                      } else {
                        setCurrentStep((prev) => {
                          if (prev === Step._2_EXECUTE) {
                            return Step._1_DETAILS;
                          }
                          if (prev === Step._1_DETAILS) {
                            return Step._0_SELECT_PRODUCT;
                          }
                          return prev;
                        });
                      }
                    }}
                  />
                )}
                <DCLLayout width="100%">
                  <MultiSteps
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
                    position: "absolute",
                    right: 0
                  }}
                  size={iconSize}
                  onClick={() => {
                    onClose();
                  }}
                />
              </StyledGrid>
              {currentStep === Step._0_SELECT_PRODUCT ? (
                <SelectProductStep goToNextStep={goToNextStep} />
              ) : currentStep === Step._1_DETAILS ? (
                <DetailsStep goToNextStep={goToNextStep} />
              ) : currentStep === Step._2_EXECUTE ? (
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
