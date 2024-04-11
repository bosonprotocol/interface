import { useField, useFormikContext } from "formik";
import { useAccount } from "lib/utils/hooks/connection/connection";
import { useEffect } from "react";
import styled from "styled-components";

import { colors } from "../../../../../../../lib/styles/colors";
import { useBuyers } from "../../../../../../../lib/utils/hooks/useBuyers";
import { Exchange } from "../../../../../../../lib/utils/hooks/useExchanges";
import { Select } from "../../../../../../form";
import BosonButton from "../../../../../../ui/BosonButton";
import { Grid } from "../../../../../../ui/Grid";
import { Typography } from "../../../../../../ui/Typography";
import { FormModel } from "../../MakeProposalFormModel";
import RefundRequest from "./RefundRequest";

const ButtonsSection = styled.div`
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
`;

interface Props {
  onNextClick: () => void;
  isValid: boolean;
  exchange: Exchange;
  isCounterProposal?: boolean;
}

export const RefundLabel = "Refund";
export const proposals = [{ label: RefundLabel, value: "refund" }];

export default function MakeAProposalStep({
  exchange,
  onNextClick,
  isValid,
  isCounterProposal
}: Props) {
  const { account: address } = useAccount();
  const { data: buyers = [] } = useBuyers(
    {
      wallet: address
    },
    {
      enabled: !!address
    }
  );
  const myBuyerId = buyers[0]?.id;
  const iAmTheBuyer = myBuyerId === exchange?.buyer.id;
  const counterPartyText = iAmTheBuyer ? "seller" : "buyer";
  const [proposalTypeField] = useField<(typeof proposals)[0]>(
    FormModel.formFields.proposalType.name
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { setFieldTouched, setFieldValue } = useFormikContext<any>();

  useEffect(() => {
    setFieldTouched(FormModel.formFields.proposalType.name, true);
  }, [setFieldTouched]);

  useEffect(() => {
    if (!proposalTypeField.value) {
      setFieldValue(FormModel.formFields.refundPercentage.name, "0", true);
    }
  }, [proposalTypeField.value, setFieldValue]);
  const proposalOrCounterProposal = isCounterProposal
    ? "counterproposal"
    : "proposal";
  return (
    <>
      <Typography fontSize="2rem" fontWeight="600">
        Make a {proposalOrCounterProposal}
      </Typography>
      <Typography fontSize="1.25rem" color={colors.darkGrey}>
        Here you can make a {proposalOrCounterProposal} to the{" "}
        {counterPartyText} on how you would like the issue to be resolved. Note
        that this proposal is binding and if the &nbsp;{counterPartyText} agrees
        to it, the proposal will be implemented automatically.
      </Typography>
      <Grid flexDirection="column" margin="2rem 0 0 0" alignItems="flex-start">
        <Typography fontWeight="600" tag="p" fontSize="1.5rem">
          Proposal type
        </Typography>
        <Select
          name={FormModel.formFields.proposalType.name}
          options={proposals}
          disabled
        />
        {typeof proposalTypeField.value !== "string" &&
          proposalTypeField.value?.label === "Refund" && (
            <Grid
              flexDirection="column"
              alignItems="flex-start"
              padding="3.5rem 0 0 0"
              gap="2rem"
            >
              <RefundRequest exchange={exchange} iAmTheBuyer={iAmTheBuyer} />
            </Grid>
          )}
      </Grid>
      <ButtonsSection>
        <BosonButton
          type="button"
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
