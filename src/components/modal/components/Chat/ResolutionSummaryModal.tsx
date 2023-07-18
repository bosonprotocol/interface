import { Info as InfoComponent } from "phosphor-react";
import styled from "styled-components";

import { colors } from "../../../../lib/styles/colors";
import { Exchange } from "../../../../lib/utils/hooks/useExchanges";
import { ProposalItem } from "../../../../pages/chat/types";
import Grid from "../../../ui/Grid";
import { DisputeSplit } from "./components/DisputeSplit";
import ExchangePreview from "./components/ExchangePreview";
import ProposalTypeSummary from "./components/ProposalTypeSummary";

interface Props {
  exchange: Exchange;
  proposal: Pick<ProposalItem, "percentageAmount" | "type">;
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

export function ResolutionSummaryModal({ exchange, proposal }: Props) {
  return (
    <>
      <Grid justifyContent="space-between" padding="0 0 2rem 0">
        <ExchangePreview exchange={exchange} />
      </Grid>
      <ProposedSolution>Proposed solution</ProposedSolution>
      <div style={{ marginBottom: "3.44rem" }}>
        <ProposalTypeSummary exchange={exchange} proposal={proposal} />
      </div>
      <DisputeSplit exchange={exchange} proposal={proposal} />
      <Info>
        <InfoIcon />
        The third party dispute resolver has decided on the outcome of this
        dispute. The dispute has been resolved and the exchange has been
        finalised.
      </Info>
    </>
  );
}
