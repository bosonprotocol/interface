import { useField } from "formik";
import styled from "styled-components";

import { colors } from "../../../../../../lib/styles/colors";
import { Exchange } from "../../../../../../lib/utils/hooks/useExchanges";
import { useChatContext } from "../../../../../../pages/chat/ChatProvider/ChatContext";
import UploadedFiles from "../../../../../form/Upload/UploadedFiles";
import Button from "../../../../../ui/Button";
import Grid from "../../../../../ui/Grid";
import Typography from "../../../../../ui/Typography";
import InitializeChatWithSuccess from "../../components/InitializeChatWithSuccess";
import ProposalTypeSummary from "../../components/ProposalTypeSummary";
import { PERCENTAGE_FACTOR } from "../../const";
import { FormModel } from "../MakeProposalFormModel";
import { proposals } from "./MakeAProposalStep/MakeAProposalStep";

const ButtonsSection = styled.div`
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
`;

interface Props {
  onBackClick: () => void;
  isValid: boolean;
  exchange: Exchange;
}

export default function ReviewAndSubmitStep({
  onBackClick,
  isValid,
  exchange
}: Props) {
  const { bosonXmtp } = useChatContext();

  const [descriptionField] = useField<string>({
    name: FormModel.formFields.description.name
  });
  const [uploadField, , uploadFieldHelpers] = useField<File[]>({
    name: FormModel.formFields.upload.name
  });
  const [proposalsTypesField] = useField<typeof proposals>({
    name: FormModel.formFields.proposalsTypes.name
  });

  const [refundPercentageField] = useField<string>({
    name: FormModel.formFields.refundPercentage.name
  });

  const isChatInitialized = !!bosonXmtp;
  return (
    <>
      <Typography $fontSize="2rem" fontWeight="600">
        Review & Submit
      </Typography>
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
      <Typography $fontSize="1.25rem" color={colors.darkGrey}></Typography>
      <Grid flexDirection="column" margin="2rem 0" alignItems="flex-start">
        <Typography fontWeight="600" tag="p" $fontSize="1.5rem">
          Resolution proposal
        </Typography>
        <Grid flexDirection="column" gap="2rem">
          {proposalsTypesField.value.map((proposalType) => {
            if (proposalType.value === "refund") {
              return (
                <ProposalTypeSummary
                  key={proposalType.value}
                  exchange={exchange}
                  proposal={{
                    type: proposalType.label,
                    percentageAmount: (
                      Number(refundPercentageField.value) * PERCENTAGE_FACTOR
                    ).toString(),
                    signature: ""
                  }}
                />
              );
            }
            return null;
          })}
        </Grid>
      </Grid>
      <InitializeChatWithSuccess />
      <ButtonsSection>
        <Button
          theme="secondary"
          type="submit"
          disabled={!isValid || !isChatInitialized}
        >
          Sign & Submit
        </Button>

        <Button theme="outline" onClick={() => onBackClick()}>
          Back
        </Button>
      </ButtonsSection>
    </>
  );
}
