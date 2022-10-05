import { Currencies, CurrencyLogo } from "@bosonprotocol/react-kit";
import { BigNumber } from "ethers";
import { useState } from "react";
import styled from "styled-components";

import { colors } from "../../../../lib/styles/colors";
import { useCoreSDK } from "../../../../lib/utils/useCoreSdk";
import { Spinner } from "../../../loading/Spinner";
import { useConvertedPrice } from "../../../price/useConvertedPrice";
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
  currencySymbol: string;
  value: string;
  decimals: string;
}

export default function DisputeResolverDecideModal({
  exchangeId,
  currencySymbol,
  value,
  decimals
}: Props) {
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

    if (value <= 0 || value > 100 || !/^\d+(\.\d{1,2})?$/.test(`${value}`)) {
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

  const price = useConvertedPrice({
    value,
    decimals,
    symbol: currencySymbol
  });

  const refundAmmount = useConvertedPrice({
    value: BigNumber.from(value)
      .mul(BigNumber.from(parseFloat(disputePercentage) * 100))
      .div(BigNumber.from(10000))
      .toString(),
    decimals,
    symbol: currencySymbol
  });
  return (
    <Grid flexDirection="column" alignItems="flex-start" gap="1.5rem">
      <Typography tag="p" margin="0" $fontSize="0.75rem" fontWeight="bold">
        Enter refund amount the buyer should receive (as a percentage of the
        item price):
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
        <MaxLimit>
          <>
            Max Limit {price.price}
            <CurrencyLogo currency={currencySymbol as Currencies} size={18} />
          </>
        </MaxLimit>
      </AmountWrapper>
      <Grid>
        <div>
          <RefundAmount>
            Refund Amount: {price.price && `${refundAmmount.price}`}{" "}
            <CurrencyLogo currency={currencySymbol as Currencies} size={18} />
          </RefundAmount>
        </div>
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
              $fontSize="0.873rem"
              fontWeight="bold"
            >
              Confirm Decision
            </Typography>
          )}
        </CTAButton>
      </Grid>
    </Grid>
  );
}

const RefundAmount = styled.span`
  font-weight: 600;
  font-size: 0.75rem;
  line-height: 150%;
  color: ${colors.white};
  svg {
    vertical-align: bottom;
    margin-left: 0.25rem;
  }
`;

const MaxLimit = styled.span`
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 15px;
  text-align: right;
  color: ${colors.white};
  opacity: 0.4;
  svg {
    vertical-align: bottom;
    margin-left: 0.25rem;
  }
`;
