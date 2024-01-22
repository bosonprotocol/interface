import styled from "styled-components";

import { colors } from "../../../../../../lib/styles/colors";
// import { Exchange } from "../../../../../../lib/utils/hooks/useExchanges";
import UploadForm from "../../../../../../pages/chat/components/UploadForm/UploadForm";
import { Textarea } from "../../../../../form";
import BosonButton from "../../../../../ui/BosonButton";
import { Grid } from "../../../../../ui/Grid";
import { Typography } from "../../../../../ui/Typography";
import { FormModel } from "../MakeProposalFormModel";

const ButtonsSection = styled.div`
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
`;

const TextArea = styled(Textarea)`
  width: 100%;
  resize: none;
`;

interface Props {
  onNextClick: () => void;
  isValid: boolean;
}

export default function DescribeProblemStep({ onNextClick, isValid }: Props) {
  return (
    <>
      <Typography fontSize="2rem" fontWeight="600">
        Add documents to support your case
      </Typography>
      <Typography fontSize="1.25rem" color={colors.darkGrey}>
        You may provide any information or attach any files that support your
        case.
      </Typography>
      <Grid flexDirection="column" margin="2rem 0" alignItems="flex-start">
        <Typography fontWeight="600" tag="p">
          Message*
        </Typography>
        <TextArea
          name={FormModel.formFields.description.name}
          rows={5}
          placeholder="Provide additional information about the problem you faced with your order"
        />
      </Grid>
      <UploadForm />
      <ButtonsSection>
        <BosonButton
          variant="primaryFill"
          onClick={() => onNextClick()}
          disabled={!isValid}
        >
          Next
        </BosonButton>
      </ButtonsSection>
    </>
  );
}
