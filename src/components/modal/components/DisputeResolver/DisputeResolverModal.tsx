import { useState } from "react";

import { useCoreSDK } from "../../../../lib/utils/useCoreSdk";
import { Spinner } from "../../../loading/Spinner";
import Grid from "../../../ui/Grid";
import Typography from "../../../ui/Typography";
import { useModal } from "../../useModal";
import {
  AmountWrapper,
  CTAButton,
  Input,
  InputWrapper
} from "../SellerFinance/FinancesStyles";

interface Props {
  exchangeId: string;
}

export default function DisputeResolverModal({ exchangeId }: Props) {
  const [disputePercentage, setDisputePercentage] = useState<string>("0");
  const [isSubmitingDispute, setIsSubmitingDispute] = useState<boolean>(false);
  const [isValidValue, setIsValidValue] = useState<boolean>(true);
  const [disputeError, setDisputeError] = useState<unknown>(null);

  const { hideModal } = useModal();
  const coreSDK = useCoreSDK();

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.valueAsNumber || 0;
    setIsValidValue(false);
    setDisputeError(null);
    if (value <= 0 || value > 100) {
      setIsValidValue(true);
    }
    setDisputePercentage(value.toFixed(2));
  };

  const handleSolveDispute = async () => {
    try {
      setIsSubmitingDispute(true);
      await coreSDK.decideDispute(
        exchangeId,
        parseFloat(disputePercentage) * 100
      );
      setIsSubmitingDispute(false);
      hideModal();
    } catch (error) {
      setDisputeError("Error submitting the dispute.");
    }
  };

  return (
    <Grid flexDirection="column" alignItems="flex-start" gap="1.5rem">
      <Typography tag="p" margin="0" $fontSize="0.75rem" fontWeight="bold">
        Choose Amount To Deposit:
      </Typography>
      <AmountWrapper>
        <InputWrapper $hasError={!!disputeError || isValidValue}>
          <Input type="number" min={0} max={100} onChange={handleChangeValue} />
          <div>
            <Typography $fontSize="0.875rem" margin="0" fontWeight="bold">
              %
            </Typography>
          </div>
        </InputWrapper>
      </AmountWrapper>
      <Grid>
        <div />
        <CTAButton
          theme="primary"
          size="small"
          onClick={handleSolveDispute}
          disabled={isValidValue}
        >
          {isSubmitingDispute ? (
            <Spinner size={20} />
          ) : (
            <Typography
              tag="p"
              margin="0"
              $fontSize="0.75rem"
              fontWeight="bold"
            >
              Resolve
            </Typography>
          )}
        </CTAButton>
      </Grid>
    </Grid>
  );
}
