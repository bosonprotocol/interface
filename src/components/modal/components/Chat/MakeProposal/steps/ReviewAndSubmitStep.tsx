import { useField, useFormikContext } from "formik";
import styled from "styled-components";

import { colors } from "../../../../../../lib/styles/colors";
import { Exchange } from "../../../../../../lib/utils/hooks/useExchanges";
import { useChatContext } from "../../../../../../pages/chat/ChatProvider/ChatContext";
import SimpleError from "../../../../../error/SimpleError";
import UploadedFiles from "../../../../../form/Upload/UploadedFiles";
import { Spinner } from "../../../../../loading/Spinner";
import BosonButton from "../../../../../ui/BosonButton";
import Grid from "../../../../../ui/Grid";
import Typography from "../../../../../ui/Typography";
import InitializeChatWithSuccess from "../../components/InitializeChatWithSuccess";
import ProposalTypeSummary from "../../components/ProposalTypeSummary";
import { PERCENTAGE_FACTOR } from "../../const";
import { FormModel } from "../MakeProposalFormModel";
import { RefundLabel } from "./MakeAProposalStep/MakeAProposalStep";

const ButtonsSection = styled.div`
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
`;

const StyledButtonsSection = styled(BosonButton)<{ isModal: boolean }>`
  background: ${({ isModal }) => !isModal && "transparent"};
  border-color: ${({ isModal }) => !isModal && colors.orange};
  border: ${({ isModal }) => !isModal && `2px solid ${colors.orange}`};
  color: ${({ isModal }) => !isModal && colors.orange};
  &:hover {
    background: ${({ isModal }) => !isModal && colors.orange};
    border-color: ${({ isModal }) => !isModal && colors.orange};
    border: ${({ isModal }) => !isModal && `2px solid ${colors.orange}`};
    color: ${({ isModal }) => !isModal && colors.white};
  }
`;

interface Props {
  isValid: boolean;
  exchange: Exchange;
  submitError: Error | null;
  isModal?: boolean;
  isCounterProposal?: boolean;
}

export default function ReviewAndSubmitStep({
  isValid,
  exchange,
  submitError,
  isModal = false,
  isCounterProposal
}: Props) {
  const { bosonXmtp } = useChatContext();
  const { isSubmitting } = useFormikContext();
  const [descriptionField] = useField<string>({
    name: FormModel.formFields.description.name
  });
  const [uploadField, , uploadFieldHelpers] = useField<File[]>({
    name: FormModel.formFields.upload.name
  });
  const [proposalTypeField] = useField<string>({
    name: FormModel.formFields.proposalType.name
  });
  const [refundPercentageField] = useField<string>({
    name: FormModel.formFields.refundPercentage.name
  });
  const isChatInitialized = !!bosonXmtp;
  return (
    <>
      <Typography $fontSize="2rem" fontWeight="600">
        {isCounterProposal ? "Counterproposal overview" : "Review & Submit"}
      </Typography>
      {!isCounterProposal && (
        <>
          <Typography fontWeight="600" tag="p" $fontSize="1.5rem">
            Description
          </Typography>
          <Typography tag="p">{descriptionField.value}</Typography>
          <UploadedFiles
            files={uploadField.value}
            handleRemoveFile={(index) => {
              const files = uploadField.value.filter((_, idx) => idx !== index);
              uploadFieldHelpers.setValue(files);
            }}
          />
        </>
      )}
      {proposalTypeField.value && (
        <>
          <Grid flexDirection="column" margin="2rem 0" alignItems="flex-start">
            <Typography fontWeight="600" tag="p" $fontSize="1.5rem">
              Resolution proposal
            </Typography>
            <Grid flexDirection="column" gap="2rem">
              <ProposalTypeSummary
                exchange={exchange}
                proposal={{
                  type: RefundLabel,
                  percentageAmount: (
                    Number(refundPercentageField.value) * PERCENTAGE_FACTOR
                  ).toString(),
                  signature: ""
                }}
              />
            </Grid>
          </Grid>
          <InitializeChatWithSuccess />
        </>
      )}
      {submitError && (
        <SimpleError
          errorMessage={
            submitError &&
            submitError.message === "message too big" &&
            uploadField.value.length
              ? "There has been an error, please reduce the number of images or send smaller ones"
              : ""
          }
        />
      )}
      <ButtonsSection>
        <StyledButtonsSection
          variant="primaryFill"
          type="submit"
          isModal={isModal}
          disabled={
            !isValid ||
            (!isChatInitialized && !!proposalTypeField.value) ||
            isSubmitting
          }
        >
          {isModal ? "Send proposal" : "Raise dispute"}
          {isSubmitting && <Spinner />}
        </StyledButtonsSection>
      </ButtonsSection>
    </>
  );
}
