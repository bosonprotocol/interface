import { Info as InfoComponent } from "phosphor-react";
import styled from "styled-components";

import { colors } from "../../../../lib/styles/colors";
import { Exchange } from "../../../../lib/utils/hooks/useExchanges";
import { ProposalMessage } from "../../../../pages/chat/types";
import Button from "../../../ui/Button";
import Grid from "../../../ui/Grid";
import { ModalProps } from "../../ModalContext";
import ExchangePreview from "./components/ExchangePreview";
import ProposalTypeSummary from "./components/ProposalTypeSummary";

interface Props {
  exchange: Exchange;
  proposal: ProposalMessage["value"]["proposals"][number];

  // modal props
  hideModal: NonNullable<ModalProps["hideModal"]>;
  title: ModalProps["title"];
}

const ProposedSolution = styled.h4`
  font-size: 1.25rem;
  font-weight: 600;
`;

const Info = styled.div`
  padding: 1.5rem;
  background-color: ${colors.lightGrey};
  margin: 2rem 0;
  color: ${colors.darkGrey};
  display: flex;
  align-items: center;
`;

const InfoIcon = styled(InfoComponent)`
  margin-right: 1.1875rem;
`;

const ButtonsSection = styled.div`
  border-top: 2px solid ${colors.border};
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
`;

export default function ResolveDispute({
  exchange,
  hideModal,
  proposal
}: Props) {
  return (
    <>
      <Grid justifyContent="space-between" padding="2rem 0">
        <ExchangePreview exchange={exchange} />
      </Grid>
      <ProposedSolution>Proposed solution</ProposedSolution>
      <ProposalTypeSummary exchange={exchange} proposal={proposal} />
      <Info>
        <InfoIcon />
        By accepting this proposal the dispute is resolved and the refund is
        implemented
      </Info>
      <ButtonsSection>
        <Button
          theme="secondary"
          onClick={() => {
            // TODO: implement
            console.log("accept proposal");
          }}
        >
          Accept proposal
        </Button>
        <Button theme="blankOutline" onClick={() => hideModal()}>
          Back
        </Button>
      </ButtonsSection>
    </>
  );
}
