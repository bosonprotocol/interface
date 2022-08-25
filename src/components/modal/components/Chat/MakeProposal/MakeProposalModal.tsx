import { Form, Formik, FormikProps } from "formik";
import { ReactNode, useState } from "react";
import { useAccount } from "wagmi";
import * as Yup from "yup";

import { FileWithEncodedData } from "../../../../../lib/utils/files";
import { Exchange } from "../../../../../lib/utils/hooks/useExchanges";
import { useSellers } from "../../../../../lib/utils/hooks/useSellers";
import { useCoreSDK } from "../../../../../lib/utils/useCoreSdk";
import { validationOfFile } from "../../../../../pages/chat/components/UploadForm/const";
import { NewProposal } from "../../../../../pages/chat/types";
import { createProposal } from "../../../../../pages/chat/utils/create";
import Grid from "../../../../ui/Grid";
import { ModalProps } from "../../../ModalContext";
import ExchangePreview from "../components/ExchangePreview";
import { FormModel } from "./MakeProposalFormModel";
import DescribeProblemStep from "./steps/DescribeProblemStep";
import MakeAProposalStep from "./steps/MakeAProposalStep/MakeAProposalStep";
import ReviewAndSubmitStep from "./steps/ReviewAndSubmitStep";

interface Props {
  exchange: Exchange;
  activeStep: number;
  sendProposal: (
    proposal: NewProposal,
    proposalFiles: FileWithEncodedData[]
  ) => void;
  // modal props
  hideModal: NonNullable<ModalProps["hideModal"]>;
  headerComponent: ReactNode;
  setActiveStep: (step: number) => void;
}

const validationSchemaPerStep = [
  Yup.object({
    [FormModel.formFields.description.name]: Yup.string()
      .trim()
      .required(FormModel.formFields.description.requiredErrorMessage),
    [FormModel.formFields.upload.name]: validationOfFile({ isOptional: true })
  }),
  Yup.object({
    [FormModel.formFields.refundPercentage.name]: Yup.number()
      .moreThan(0, FormModel.formFields.refundPercentage.moreThanErrorMessage)
      .max(100, FormModel.formFields.refundPercentage.maxErrorMessage)
      .defined(FormModel.formFields.refundPercentage.emptyErrorMessage)
  }),
  Yup.object({})
];

export default function MakeProposalModal({
  exchange,
  hideModal,
  setActiveStep,
  sendProposal,
  activeStep
}: Props) {
  const [submitError, setSubmitError] = useState<Error | null>(null);
  const coreSDK = useCoreSDK();
  const { address } = useAccount();
  const { data: sellers } = useSellers({
    operator: address
  });
  const mySellerId = sellers?.[0]?.id || "";
  const iAmTheSeller = mySellerId === exchange.seller.id;
  const sellerOrBuyerId = iAmTheSeller ? exchange.seller.id : exchange.buyer.id;
  const validationSchema = validationSchemaPerStep[activeStep];
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
                proposalTypeName: values.proposalsTypes?.label || "",
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
          [FormModel.formFields.proposalsTypes.name]: null as unknown as {
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

          const isMakeAProposalOK =
            !props.errors[FormModel.formFields.refundPercentage.name];
          const isFormValid = isDescribeProblemOK && isMakeAProposalOK;
          return (
            <Form>
              {activeStep === 0 ? (
                <DescribeProblemStep
                  onNextClick={() => setActiveStep(1)}
                  isValid={isDescribeProblemOK}
                />
              ) : activeStep === 1 ? (
                <MakeAProposalStep
                  onBackClick={() => setActiveStep(0)}
                  onNextClick={() => setActiveStep(2)}
                  isValid={isMakeAProposalOK}
                  exchange={exchange}
                />
              ) : (
                <ReviewAndSubmitStep
                  onBackClick={() => setActiveStep(1)}
                  isValid={isFormValid}
                  exchange={exchange}
                  submitError={submitError}
                />
              )}
            </Form>
          );
        }}
      </Formik>
    </>
  );
}
