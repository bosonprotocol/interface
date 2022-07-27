import { useField } from "formik";
import styled from "styled-components";

import { colors } from "../../../../../../../lib/styles/colors";
import { Exchange } from "../../../../../../../lib/utils/hooks/useExchanges";
import { Select } from "../../../../../../form";
import Button from "../../../../../../ui/Button";
import Grid from "../../../../../../ui/Grid";
import Typography from "../../../../../../ui/Typography";
import RefundRequest from "./RefundRequest";
import ReturnRequest from "./ReturnRequest";

const ButtonsSection = styled.div`
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
`;

interface Props {
  onBackClick: () => void;
  onNextClick: () => void;
  isValid: boolean;
  exchange: Exchange;
}

export const proposals = [
  { label: "Refund", value: "refund" },
  { label: "Return and replace", value: "return" }
];

export default function MakeAProposalStep({
  exchange,
  onNextClick,
  onBackClick,
  isValid
}: Props) {
  const [proposalsTypesField] = useField<typeof proposals>("proposalsTypes");

  return (
    <>
      <Typography fontSize="2rem" fontWeight="600">
        Make a proposal
      </Typography>
      <Typography fontSize="1.25rem" color={colors.darkGrey}>
        Here you can make a proposal to the seller on how you would like the
        issue to be resolved. Note that this proposal is binding and if the
        seller agrees to it, the proposal will be implemented automatically.
      </Typography>
      <Grid flexDirection="column" margin="2rem 0 0 0" alignItems="flex-start">
        <Typography fontWeight="600" tag="p" fontSize="1.5rem">
          Type of proposals
        </Typography>
        <Select name="proposalsTypes" options={proposals} isMulti />
        <Grid
          flexDirection="column"
          alignItems="flex-start"
          padding="3.5rem 0 0 0"
          gap="2rem"
        >
          {proposalsTypesField.value.map((proposalType) => {
            if (proposalType.value === "refund") {
              return (
                <RefundRequest key={proposalType.value} exchange={exchange} />
              );
            }
            if (proposalType.value === "return") {
              return <ReturnRequest key={proposalType.value} />;
            }
            return null;
          })}
        </Grid>
      </Grid>
      <ButtonsSection>
        <Button
          theme="secondary"
          onClick={() => onNextClick()}
          disabled={!isValid}
        >
          Next
        </Button>
        <Button theme="outline" onClick={() => onBackClick()}>
          Back
        </Button>
      </ButtonsSection>
    </>
  );
}
