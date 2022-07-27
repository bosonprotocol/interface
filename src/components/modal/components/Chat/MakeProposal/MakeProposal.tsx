import { Form, Formik, FormikProps } from "formik";
import { ReactNode } from "react";
import * as Yup from "yup";

import { Exchange } from "../../../../../lib/utils/hooks/useExchanges";
import { NewProposal } from "../../../../../pages/chat/types";
import Grid from "../../../../ui/Grid";
import { ModalProps } from "../../../ModalContext";
import ExchangePreview from "../components/ExchangePreview";
import DescribeProblemStep from "./steps/DescribeProblemStep";
import MakeAProposalStep from "./steps/MakeAProposalStep/MakeAProposalStep";
import ReviewAndSubmitStep from "./steps/ReviewAndSubmitStep";

interface Props {
  exchange: Exchange;
  activeStep: number;
  sendProposal: (proposal: NewProposal) => void;
  // modal props
  hideModal: NonNullable<ModalProps["hideModal"]>;
  headerComponent: ReactNode;
  setActiveStep: (step: number) => void;
}

export default function MakeProposal({
  exchange,
  hideModal,
  setActiveStep,
  sendProposal,
  activeStep
}: Props) {
  const reqMessage = "This field is required";

  const validationSchema = Yup.object({
    description: Yup.string().trim().required(reqMessage),
    refundPercentage: Yup.number()
      .moreThan(0, "The percentage should be more than 0")
      .max(100, "The percentage should be less than or equal to 100")
  });
  return (
    <>
      <Grid justifyContent="space-between" padding="2rem 0">
        <ExchangePreview exchange={exchange} />
      </Grid>
      <Formik
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          console.log("submit", values);

          const { upload } = values;
          const files = upload as File[];
          const promises: Promise<string | ArrayBuffer | null>[] = [];
          for (const file of files) {
            promises.push(
              new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function () {
                  resolve(reader.result);
                };
                reader.onerror = function (error) {
                  reject(error);
                };
              })
            );
          }
          const filesInfo = await Promise.all(promises);

          const proposal: NewProposal = {
            title: "Proposal",
            description: values.description,
            additionalInformation: "",
            additionalInformationFiles: files.map((file, index) => ({
              name: file.name,
              url: filesInfo[index]?.toString() || ""
            })),
            proposals: []
          };
          console.log("proposal", proposal);

          sendProposal(proposal);

          hideModal();
        }}
        initialValues={{
          description: "",
          proposals: [],
          refund: false,
          refundAmount: 0,
          refundPercentage: 0,
          return: false,
          upload: []
        }}
        validateOnMount
      >
        {(props: FormikProps<any>) => {
          // TODO: remove any
          console.log(props);
          const isDescribeProblemOK = !props.errors["description"];
          const isMakeAProposalOK =
            (!!props.values["refund"] && !props.errors["refundPercentage"]) ||
            !!props.values["return"];
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
