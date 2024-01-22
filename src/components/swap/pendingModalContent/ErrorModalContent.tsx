import QuestionHelper from "components/questionHelper";
import Button from "components/ui/Button";
import { ColumnCenter } from "components/ui/column";
import { Grid } from "components/ui/Grid";
import { Typography } from "components/ui/Typography";
import { Warning } from "phosphor-react";

import { PendingModalContainer } from ".";

export enum PendingModalError {
  TOKEN_APPROVAL_ERROR,
  PERMIT_ERROR,
  CONFIRMATION_ERROR,
  WRAP_ERROR
}

interface ErrorModalContentProps {
  errorType: PendingModalError;
  onRetry: () => void;
}

function getErrorContent(errorType: PendingModalError) {
  switch (errorType) {
    case PendingModalError.TOKEN_APPROVAL_ERROR:
      return {
        title: <>Token approval failed</>,
        label: <>Why are approvals required?</>,
        tooltipText: (
          <>
            This provides the Uniswap protocol access to your token for trading.
            For security, this will expire after 30 days.
          </>
        )
      };
    case PendingModalError.PERMIT_ERROR:
      return {
        title: <>Permit approval failed</>,
        label: <>Why are permits required?</>,
        tooltipText: (
          <>
            Permit2 allows token approvals to be shared and managed across
            different applications.
          </>
        )
      };
    case PendingModalError.CONFIRMATION_ERROR:
      return {
        title: <>Swap failed</>
      };
    case PendingModalError.WRAP_ERROR:
      return {
        title: <>Wrap failed</>
      };
  }
}

export function ErrorModalContent({
  errorType,
  onRetry
}: ErrorModalContentProps) {
  const { title, label, tooltipText } = getErrorContent(errorType);

  return (
    <PendingModalContainer gap="lg">
      <Warning
        data-testid="pending-modal-failure-icon"
        strokeWidth={1}
        // color={theme.accentFailure}
        size="48px"
      />
      <ColumnCenter gap="md">
        <Typography>{title}</Typography>
        <Grid justifyContent="center">
          {label && <Typography color="textSecondary">{label}</Typography>}
          {tooltipText && <QuestionHelper text={tooltipText} />}
        </Grid>
      </ColumnCenter>
      <Grid justifyContent="center">
        <Button
          style={{
            marginLeft: "24px",
            marginRight: "24px",
            marginBottom: "16px"
          }}
          onClick={onRetry}
        >
          <>Retry</>
        </Button>
      </Grid>
    </PendingModalContainer>
  );
}
