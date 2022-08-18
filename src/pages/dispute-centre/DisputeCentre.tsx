import { Formik } from "formik";
import { useState } from "react";
import styled from "styled-components";

import Ethereum from "../../assets/Ethereum.svg";
import {
  disputeCentreInitialValues,
  disputeCentreValidationSchemaAdditionalInformation,
  disputeCentreValidationSchemaGetStarted,
  disputeCentreValidationSchemaMakeProposal,
  disputeCentreValidationSchemaTellUsMore
} from "../../components/product/utils";
import MultiSteps from "../../components/step/MultiSteps";
import Typography from "../../components/ui/Typography";
import { colors } from "../../lib/styles/colors";
import { useExchanges } from "../../lib/utils/hooks/useExchanges";
import MockImage from "../offers/mock/image1.jpg";
import DisputeCentreForm from "./DisputeCentreForm";

const DISPUTE_STEPS = [
  {
    name: "Choose isue",
    steps: 1
  } as const,
  {
    name: "Describe problem",
    steps: 1
  } as const,
  {
    name: "Additional details",
    steps: 1
  } as const,
  {
    name: "Make a proposal",
    steps: 1
  } as const,
  {
    name: "Review & Submit",
    steps: 1
  } as const
];

const ItemWidget = styled.div``;

const DisputeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background: ${colors.lightGrey};
`;

const GetStartedBox = styled.div`
  width: 41.75rem;
  padding: 2rem;
  margin-top: 1rem;
  background: ${colors.white};
  margin-bottom: 3.125rem;
  height: max-content;
  [get-started] {
    padding-bottom: 3.125rem;
  }
`;

const MultiStepsContainer = styled.div`
  padding-bottom: 0.5rem;
`;

const ItemPreview = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  width: 41.75rem;
  background-color: ${colors.white};
  margin-top: 2rem;
  padding: 2rem;
  [data-container-first] {
    display: flex;
    flex-direction: row;
    div {
      margin-left: 1rem;
      display: flex;
      justify-content: center;
      flex-direction: column;
      div {
        margin-left: 0;
        margin-bottom: 0.3125rem;
      }
    }
    img {
      height: 5rem;
      width: 5rem;
    }
    span {
      display: flex;
      img {
        height: 1rem;
        width: 1rem;
        border-radius: 50%;
        margin-right: 0.3125rem;
      }
    }
  }
  [data-container-second] {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    span {
      display: flex;
      &:nth-of-type(1) {
        margin-left: -0.3125rem;
      }
    }
  }
`;

function DisputeCentre() {
  const [currentStep, setCurrentStep] = useState(0);

  const {
    data: exchanges,
    isError,
    isLoading
  } = useExchanges(
    {
      id: "1",
      disputed: null
    },
    {
      enabled: !!"1"
    }
  );

  const handleSubmit = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log("submit");
    }
  };

  const handleClickStep = (val: number) => {
    if (val < currentStep) {
      setCurrentStep(val);
    }
  };

  const validationSchema = [
    disputeCentreValidationSchemaGetStarted,
    disputeCentreValidationSchemaTellUsMore,
    disputeCentreValidationSchemaAdditionalInformation,
    disputeCentreValidationSchemaMakeProposal
  ];

  console.log(currentStep);

  return (
    <>
      <MultiStepsContainer>
        <MultiSteps
          data={DISPUTE_STEPS}
          active={currentStep}
          callback={handleClickStep}
        />
      </MultiStepsContainer>
      <DisputeContainer>
        <ItemPreview>
          <div data-container-first>
            <img src={MockImage} img-large alt="item thumbnail" />
            <div text-container>
              <Typography
                fontWeight="600"
                fontSize="1.25rem"
                color={colors.black}
              >
                FEWO SHOE EPIC
              </Typography>
              <span>
                <img src={MockImage} alt="item small thumbnail" />
                <Typography
                  fontWeight="600"
                  fontSize="0.75rem"
                  color={colors.secondary}
                >
                  FEWOCiOUS x RTFKT
                </Typography>
              </span>
            </div>
          </div>
          <div data-container-second>
            <span>
              <img src={Ethereum} alt="Ethereum logo" />
              <Typography
                color={colors.black}
                fontSize="1.25rem"
                fontWeight="600"
              >
                1.3
              </Typography>
            </span>
            <span>
              <Typography
                color={colors.darkGrey}
                fontSize="0.75rem"
                fontWeight="400"
                opacity="0.5"
              >
                $
              </Typography>
              <Typography
                color={colors.darkGrey}
                fontSize="0.75rem"
                fontWeight="400"
              >
                2,524.69
              </Typography>
            </span>
          </div>
        </ItemPreview>
        <GetStartedBox>
          <ItemWidget>
            <Formik
              initialValues={disputeCentreInitialValues}
              onSubmit={handleSubmit}
              validationSchema={validationSchema[currentStep]}
            >
              {(formikProps) => (
                <DisputeCentreForm
                  setCurrentStep={setCurrentStep}
                  currentStep={currentStep}
                  {...formikProps}
                />
              )}
            </Formik>
          </ItemWidget>
        </GetStartedBox>
      </DisputeContainer>
    </>
  );
}

export default DisputeCentre;
