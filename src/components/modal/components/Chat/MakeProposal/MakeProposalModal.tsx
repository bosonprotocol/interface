import { Form, Formik, FormikProps } from "formik";
import { ReactNode } from "react";
import * as Yup from "yup";

import {
  FileWithEncodedData,
  getFilesWithEncodedData
} from "../../../../../lib/utils/files";
import { getOfferArtist } from "../../../../../lib/utils/hooks/offers/placeholders";
import { Exchange } from "../../../../../lib/utils/hooks/useExchanges";
import { validationOfFile } from "../../../../../pages/chat/components/UploadForm/const";
import { NewProposal } from "../../../../../pages/chat/types";
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
  const validationSchema = validationSchemaPerStep[activeStep];
  return (
    <>
      <Grid justifyContent="space-between" padding="2rem 0">
        <ExchangePreview exchange={exchange} />
      </Grid>
      <Formik
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          try {
            const artist = getOfferArtist(exchange.offer.metadata.name || "");
            const userName = artist || `Seller ID: ${exchange.seller.id}`; // TODO: change to get real username
            const proposal: NewProposal = {
              title: `${userName} made a proposal`,
              description: values[FormModel.formFields.description.name],
              proposals: values[FormModel.formFields.proposalsTypes.name].map(
                (proposalType) => {
                  return {
                    type: proposalType.label,
                    percentageAmount:
                      values[FormModel.formFields.refundPercentage.name] + "",
                    signature: ""
                  };
                }
              ),
              disputeContext: []
            };
            // TODO: sign proposals
            const proposalFiles = values[FormModel.formFields.upload.name];
            const filesWithData = await getFilesWithEncodedData(proposalFiles);

            sendProposal(proposal, filesWithData);
            hideModal();
          } catch (error) {
            console.error(error); // TODO: handle error case
          }
        }}
        initialValues={{
          [FormModel.formFields.description.name]: "",
          [FormModel.formFields.proposalsTypes.name]: [] as {
            label: string;
            value: string;
          }[],
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

          const isReturnProposal = !!props.values[
            FormModel.formFields.proposalsTypes.name
          ].find(
            (proposal: { label: string; value: string }) =>
              proposal.value === "return"
          );
          const isRefundProposal = !!props.values[
            FormModel.formFields.proposalsTypes.name
          ].find(
            (proposal: { label: string; value: string }) =>
              proposal.value === "refund"
          );
          const isMakeAProposalOK =
            (isRefundProposal &&
              !props.errors[FormModel.formFields.refundPercentage.name]) ||
            (!isRefundProposal && isReturnProposal);
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
                />
              )}
            </Form>
          );
        }}
      </Formik>
    </>
  );
}
