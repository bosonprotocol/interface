import { Form, Formik } from "formik";
import { ReactNode, useState } from "react";

import { Exchange } from "../../../../../lib/utils/hooks/useExchanges";
import { ProposalMessage } from "../../../../../pages/chat/types";
import Grid from "../../../../ui/Grid";
import { ModalProps } from "../../../ModalContext";
import ExchangePreview from "../components/ExchangePreview";
import DescribeProblemStep from "./steps/DescribeProblemStep";
import MakeAProposalStep from "./steps/MakeAProposalStep";
import ReviewAndSubmitStep from "./steps/ReviewAndSubmitStep";

interface Props {
  exchange: Exchange;
  activeStep: number;
  sendProposal: (proposal: ProposalMessage["value"]) => void;
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
  const [proposal, setProposal] = useState<ProposalMessage["value"]>({
    title: `Proposal`,
    description: "",
    additionalInformation: "",
    proposals: [],
    additionalInformationFiles: []
  });

  return (
    <>
      <Grid justifyContent="space-between" padding="2rem 0">
        <ExchangePreview exchange={exchange} />
      </Grid>
      <Formik
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

          const proposal: ProposalMessage["value"] = {
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
          upload: []
        }}
      >
        <Form>
          {activeStep === 0 ? (
            <DescribeProblemStep
              onNextClick={() => setActiveStep(1)}
              setProposal={setProposal}
              proposal={proposal}
            />
          ) : activeStep === 1 ? (
            <MakeAProposalStep onNextClick={() => setActiveStep(2)} />
          ) : (
            <ReviewAndSubmitStep onBackClick={() => setActiveStep(1)} />
          )}
        </Form>
      </Formik>
    </>
  );
}
