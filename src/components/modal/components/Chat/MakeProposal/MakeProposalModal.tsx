import * as Sentry from "@sentry/browser";
import { Form, Formik, FormikProps } from "formik";
import { useAccount } from "lib/utils/hooks/connection/connection";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import { FileWithEncodedData } from "../../../../../lib/utils/files";
import { Exchange } from "../../../../../lib/utils/hooks/useExchanges";
import { useSellers } from "../../../../../lib/utils/hooks/useSellers";
import { useCoreSDK } from "../../../../../lib/utils/useCoreSdk";
import { NewProposal } from "../../../../../pages/chat/types";
import { createProposal } from "../../../../../pages/chat/utils/create";
import MultiSteps from "../../../../step/MultiSteps";
import Grid from "../../../../ui/Grid";
import { useModal } from "../../../useModal";
import ExchangePreview from "../components/ExchangePreview";
import { FormModel, validationSchemaPerStep } from "./MakeProposalFormModel";
import DescribeProblemStep from "./steps/DescribeProblemStep";
import MakeAProposalStep, {
  proposals
} from "./steps/MakeAProposalStep/MakeAProposalStep";
import ReviewAndSubmitStep from "./steps/ReviewAndSubmitStep";

const StyledMultiSteps = styled(MultiSteps)`
  width: 100%;
`;
export interface MakeProposalModalProps {
  exchange: Exchange;
  sendProposal: (
    proposal: NewProposal,
    proposalFiles: FileWithEncodedData[]
  ) => Promise<void>;
  isCounterProposal?: boolean;
}

export default function MakeProposalModal({
  exchange,
  sendProposal,
  isCounterProposal
}: MakeProposalModalProps) {
  const { updateProps, store, hideModal } = useModal();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [submitError, setSubmitError] = useState<Error | null>(null);
  const coreSDK = useCoreSDK();
  const { account: address } = useAccount();
  const { data: sellers = [] } = useSellers(
    {
      assistant: address
    },
    {
      enabled: !!address
    }
  );

  const mySellerId = sellers[0]?.id || "";
  const iAmTheSeller = mySellerId === exchange.seller.id;
  const sellerOrBuyerId = iAmTheSeller ? exchange.seller.id : exchange.buyer.id;
  const validationSchema = validationSchemaPerStep[activeStep];

  const headerComponent = useMemo(() => {
    return isCounterProposal ? (
      <Grid justifyContent="space-evently">
        <StyledMultiSteps
          data={[
            { steps: 1, name: "Describe Problem" },
            { steps: 1, name: "Fill in counterproposal details" },
            { steps: 1, name: "Review & Submit" }
          ]}
          callback={(step) => {
            setActiveStep(step);
          }}
          active={activeStep}
          disableInactiveSteps
        />
      </Grid>
    ) : (
      <Grid justifyContent="space-evently">
        <StyledMultiSteps
          data={[
            { steps: 1, name: "Describe Problem" },
            { steps: 1, name: "Make a Proposal" },
            { steps: 1, name: "Review & Submit" }
          ]}
          callback={(step) => {
            setActiveStep(step);
          }}
          active={activeStep}
          disableInactiveSteps
        />
      </Grid>
    );
  }, [activeStep, isCounterProposal]);

  useEffect(() => {
    updateProps<"MAKE_PROPOSAL">({
      ...store,
      modalProps: {
        ...store.modalProps,
        headerComponent,
        activeStep
      }
    });
  }, [activeStep, headerComponent]); // eslint-disable-line
  return (
    <>
      <Grid justifyContent="space-between" padding="0 0 2rem 0">
        <ExchangePreview exchange={exchange} />
      </Grid>
      <Formik
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          try {
            setSubmitError(null);
            const { proposal, filesWithData } = await createProposal({
              isSeller: iAmTheSeller,
              sellerOrBuyerId,
              proposalFields: {
                description: values.description,
                upload: values.upload,
                proposalTypeName: values.proposalType?.label || "",
                refundPercentage: values.refundPercentage,
                disputeContext: []
              },
              exchangeId: exchange.id,
              coreSDK
            });
            sendProposal(proposal, filesWithData);
            hideModal();
          } catch (error) {
            console.error(error);
            Sentry.captureException(error);
            setSubmitError(error as Error);
          }
        }}
        initialValues={{
          [FormModel.formFields.description.name]: "",
          [FormModel.formFields.proposalType.name]: proposals[0],
          [FormModel.formFields.refundAmount.name]: "0",
          [FormModel.formFields.refundPercentage.name]: 0,
          [FormModel.formFields.upload.name]: [] as File[]
        }}
        validateOnMount
      >
        {(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          props: FormikProps<any>
        ) => {
          const isDescribeProblemOK = Object.keys(props.errors).length === 0;
          return (
            <Form>
              {activeStep === 0 ? (
                <DescribeProblemStep
                  onNextClick={() => setActiveStep((prev) => ++prev)}
                  isValid={isDescribeProblemOK}
                />
              ) : activeStep === 1 ? (
                <MakeAProposalStep
                  onNextClick={() => setActiveStep((prev) => ++prev)}
                  isValid={isDescribeProblemOK}
                  exchange={exchange}
                  isCounterProposal={isCounterProposal}
                />
              ) : (
                <ReviewAndSubmitStep
                  isValid={isDescribeProblemOK}
                  exchange={exchange}
                  submitError={submitError}
                  isModal
                  isCounterProposal={isCounterProposal}
                />
              )}
            </Form>
          );
        }}
      </Formik>
    </>
  );
}
