import { utils } from "ethers";
import { Info as InfoComponent, Warning } from "phosphor-react";
import { useState } from "react";
import styled from "styled-components";

import { colors } from "../../../../lib/styles/colors";
import { Exchange } from "../../../../lib/utils/hooks/useExchanges";
import { useCoreSDK } from "../../../../lib/utils/useCoreSdk";
import { ProposalItem } from "../../../../pages/chat/types";
import Button from "../../../ui/Button";
import Grid from "../../../ui/Grid";
import Typography from "../../../ui/Typography";
import { ModalProps } from "../../ModalContext";
import ExchangePreview from "./components/ExchangePreview";
import ProposalTypeSummary from "./components/ProposalTypeSummary";

const StyledGrid = styled(Grid)`
  background-color: ${colors.lightGrey};
`;
interface Props {
  exchange: Exchange;
  proposal: ProposalItem;

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

export default function ResolveDisputeModal({
  exchange,
  hideModal,
  proposal
}: Props) {
  const coreSDK = useCoreSDK();
  const [resolveDisputeError, setResolveDisputeError] = useState<Error | null>(
    null
  );
  return (
    <>
      <Grid justifyContent="space-between" padding="0 0 2rem 0">
        <ExchangePreview exchange={exchange} />
      </Grid>
      <ProposedSolution>Proposed solution</ProposedSolution>
      <ProposalTypeSummary exchange={exchange} proposal={proposal} />
      <Info>
        <InfoIcon />
        By accepting this proposal the dispute is resolved and the refund is
        implemented
      </Info>
      {resolveDisputeError && (
        <StyledGrid
          justifyContent="flex-start"
          gap="0.5rem"
          margin="1.5rem 0"
          padding="1.5rem"
        >
          <Warning color={colors.darkOrange} size={16} />
          <Typography fontWeight="600" $fontSize="1rem" lineHeight="1.5rem">
            There has been an error, please try again
          </Typography>
        </StyledGrid>
      )}
      <ButtonsSection>
        <Button
          theme="secondary"
          onClick={async () => {
            try {
              setResolveDisputeError(null);
              const signature = utils.splitSignature(proposal.signature);
              await coreSDK.resolveDispute({
                exchangeId: exchange.id,
                buyerPercent: proposal.percentageAmount,
                sigR: signature.r,
                sigS: signature.s,
                sigV: signature.v
              });
            } catch (error) {
              setResolveDisputeError(error as Error);
            }
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
