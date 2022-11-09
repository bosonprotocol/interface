import { useState } from "react";
import styled from "styled-components";

import { colors } from "../../../../lib/styles/colors";
import { useCoreSDK } from "../../../../lib/utils/useCoreSdk";
import { Spinner } from "../../../loading/Spinner";
import Grid from "../../../ui/Grid";
import Typography from "../../../ui/Typography";
import { useModal } from "../../useModal";
import { CTAButton } from "../SellerFinance/FinancesStyles";

interface Props {
  exchangeId: string;
}

export default function DisputeResolverRefuseModal({ exchangeId }: Props) {
  const [isSubmitingDispute, setIsSubmitingDispute] = useState<boolean>(false);
  const [disputeError, setDisputeError] = useState<string | null>(null);

  const { hideModal } = useModal();
  const coreSDK = useCoreSDK();

  const handleRefuseDispute = async () => {
    try {
      setIsSubmitingDispute(true);
      await coreSDK.refuseEscalatedDispute(exchangeId);
      setIsSubmitingDispute(false);
      hideModal();
    } catch (error) {
      setDisputeError("Error refusing the dispute.");
      console.error("error", error);
    }
  };

  return (
    <Grid flexDirection="column" alignItems="flex-start" gap="1.5rem">
      <Typography tag="p" margin="0" $fontSize="0.75rem" fontWeight="600">
        Confirm that you refuse to provide a decision for the dispute with ID:{" "}
        {exchangeId}
      </Typography>

      <Grid>
        <div />
        <CTAButton theme="primary" size="small" onClick={handleRefuseDispute}>
          {isSubmitingDispute ? (
            <Spinner size={20} />
          ) : (
            <Typography
              tag="p"
              margin="0"
              $fontSize="0.875rem"
              fontWeight="600"
            >
              Refuse
            </Typography>
          )}
        </CTAButton>
      </Grid>
      {disputeError && <ErrorMessage>{disputeError}</ErrorMessage>}
    </Grid>
  );
}

const ErrorMessage = styled.span`
  font-size: 1rem;
  color: ${colors.red};
`;
