import { useField } from "formik";
import styled from "styled-components";

import { colors } from "../../../../../../lib/styles/colors";
import { Exchange } from "../../../../../../lib/utils/hooks/useExchanges";
import Button from "../../../../../ui/Button";
import Grid from "../../../../../ui/Grid";
import Typography from "../../../../../ui/Typography";
import ProposalTypeSummary from "../../components/ProposalTypeSummary";

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
  const [descriptionField] = useField({
    name: "description"
  });
  const [uploadField] = useField<File[]>({
    name: "upload"
  });
  const [refundField] = useField<boolean>({
    name: "refund"
  });
  const [refundPercentageField] = useField<string>({
    name: "refundPercentage"
  });
  const [returnField] = useField<File[]>({
    name: "return"
  });
  return (
    <>
      <Typography fontSize="2rem" fontWeight="600">
        Review & Submit
      </Typography>
      <Typography fontWeight="600" tag="p" fontSize="1.5rem">
        Description
      </Typography>
      <Typography tag="p">{descriptionField.value}</Typography>
      <div>
        {uploadField.value.map((file) => {
          return <p>{file.name}</p>;
        })}
      </div>
      <Typography fontSize="1.25rem" color={colors.darkGrey}></Typography>
      <Grid flexDirection="column" margin="2rem 0" alignItems="flex-start">
        <Typography fontWeight="600" tag="p" fontSize="1.5rem">
          Resolution proposal
        </Typography>
        <Grid flexDirection="column" gap="2rem">
          {refundField.value && (
            <ProposalTypeSummary
              exchange={exchange}
              proposal={{
                type: "Refund Request",
                percentageAmount: refundPercentageField.value,
                signature: "0x"
              }}
            />
          )}
          {returnField.value && (
            <ProposalTypeSummary
              exchange={exchange}
              proposal={{
                type: "Return and Replace",
                percentageAmount: "0",
                signature: "0x"
              }}
            />
          )}
        </Grid>
      </Grid>
      <ButtonsSection>
        <Button theme="secondary" type="submit" disabled={!isValid}>
          Sign & Submit
        </Button>

        <Button theme="outline" onClick={() => onBackClick()}>
          Back
        </Button>
      </ButtonsSection>
    </>
  );
}
