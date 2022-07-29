import { useField, useFormikContext } from "formik";
import styled from "styled-components";

import { Offer } from "../../../../../../../lib/types/offer";
import { Input } from "../../../../../../form";
import ConvertedPrice from "../../../../../../price/ConvertedPrice";
import CurrencyIcon from "../../../../../../price/CurrencyIcon";
import { useConvertedPrice } from "../../../../../../price/useConvertedPrice";
import { FormModel } from "../../MakeProposalFormModel";

const RefundAmountWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  background: #f1f3f9;
  border: 1px solid #5560720f;
  padding: 0 0 0 0.5rem;

  [data-currency] {
    all: unset;
    transform: scale(0.75);
    font-size: 1.25rem;
    font-weight: 600;
    -webkit-font-smoothing: antialiased;
    letter-spacing: -1px;
  }

  input {
    border: none;
    background: none;
    text-align: right;
  }

  [data-converted-price] * {
    font-size: 0.65625rem;
  }
`;

interface Props {
  address: string;
  inEscrowDecimals: string;
  exchangeToken: Offer["exchangeToken"];
}

export default function RequestedRefundInput({
  address,
  inEscrowDecimals,
  exchangeToken
}: Props) {
  const [refundAmountField] = useField(FormModel.formFields.refundAmount.name);
  const currencySymbol = exchangeToken.symbol;
  const price = useConvertedPrice({
    value: refundAmountField.value,
    decimals: exchangeToken.decimals,
    symbol: currencySymbol
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { setFieldValue, handleChange } = useFormikContext<any>();
  return (
    <RefundAmountWrapper>
      <CurrencyIcon currencySymbol={currencySymbol} address={address} />
      <Input
        step="0.001"
        name={FormModel.formFields.refundAmount.name}
        type="number"
        onChange={(e) => {
          handleChange(e);
          const {
            target: { valueAsNumber: currentRefundAmount }
          } = e;
          const percentageFromInput = (
            (currentRefundAmount / Number(inEscrowDecimals)) *
            100
          ).toFixed(3);
          setFieldValue(
            FormModel.formFields.refundPercentage.name,
            percentageFromInput,
            true
          );
        }}
        onBlur={() => {
          const currentRefundAmount = refundAmountField.value;
          const percentageFromInput = (
            (currentRefundAmount / Number(inEscrowDecimals)) *
            100
          ).toFixed(3);
          const refundAmountFromPercentage =
            (Number(inEscrowDecimals) * Number(percentageFromInput)) / 100;
          const percentageFromRoundedRefundAmount = (
            (refundAmountFromPercentage / Number(inEscrowDecimals)) *
            100
          ).toFixed(3);
          setFieldValue(
            FormModel.formFields.refundPercentage.name,
            percentageFromRoundedRefundAmount,
            true
          );
          if (refundAmountFromPercentage !== currentRefundAmount) {
            setFieldValue(
              FormModel.formFields.refundAmount.name,
              refundAmountFromPercentage,
              true
            );
          }
        }}
      />
      <ConvertedPrice price={price} withParethensis />
    </RefundAmountWrapper>
  );
}
