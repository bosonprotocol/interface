import { Form, Formik, FormikProps } from "formik";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useAccount } from "wagmi";

import { FileWithEncodedData } from "../../../../../lib/utils/files";
import { Exchange } from "../../../../../lib/utils/hooks/useExchanges";
import { useSellers } from "../../../../../lib/utils/hooks/useSellers";
import { useCoreSDK } from "../../../../../lib/utils/useCoreSdk";
import { NewProposal } from "../../../../../pages/chat/types";
import { createProposal } from "../../../../../pages/chat/utils/create";
import MultiSteps from "../../../../step/MultiSteps";
import Grid from "../../../../ui/Grid";
import { ModalProps } from "../../../ModalContext";
import { useModal } from "../../../useModal";
import ExchangePreview from "../components/ExchangePreview";
import { FormModel, validationSchemaPerStep } from "./MakeProposalFormModel";
import DescribeProblemStep from "./steps/DescribeProblemStep";
import MakeAProposalStep from "./steps/MakeAProposalStep/MakeAProposalStep";
import ReviewAndSubmitStep from "./steps/ReviewAndSubmitStep";

const StyledMultiSteps = styled(MultiSteps)`
  width: 100%;
`;
interface Props {
  exchange: Exchange;
  sendProposal: (
    proposal: NewProposal,
    proposalFiles: FileWithEncodedData[]
  ) => void;
  // modal props
  hideModal: NonNullable<ModalProps["hideModal"]>;
}

export default function MakeProposalModal({
  exchange,
  hideModal,
  sendProposal
}: Props) {
  const { updateProps, store } = useModal();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [submitError, setSubmitError] = useState<Error | null>(null);
  const coreSDK = useCoreSDK();
  const { address } = useAccount();
  const { data: sellers = [] } = useSellers({
    assistant: address
  });

  const mySellerId = sellers[0]?.id || "";
  const iAmTheSeller = mySellerId === exchange.seller.id;
  const sellerOrBuyerId = iAmTheSeller ? exchange.seller.id : exchange.buyer.id;
  const validationSchema = validationSchemaPerStep[activeStep];

  const headerComponent = useMemo(
    () => (
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
    ),
    [activeStep]
  );

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
            setSubmitError(error as Error);
          }
        }}
        initialValues={{
          [FormModel.formFields.description.name]: "",
          [FormModel.formFields.proposalType.name]: null as unknown as {
            label: string;
            value: string;
          },
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
                  onNextClick={() => setActiveStep(1)}
                  isValid={isDescribeProblemOK}
                />
              ) : activeStep === 1 ? (
                <MakeAProposalStep
                  onNextClick={() => setActiveStep(2)}
                  isValid={isDescribeProblemOK}
                  exchange={exchange}
                  onSkip={() => {
                    setActiveStep(2);
                  }}
                  isModal
                />
              ) : (
                <ReviewAndSubmitStep
                  isValid={isDescribeProblemOK}
                  exchange={exchange}
                  submitError={submitError}
                  isModal
                />
              )}
            </Form>
          );
        }}
      </Formik>
    </>
  );
}
