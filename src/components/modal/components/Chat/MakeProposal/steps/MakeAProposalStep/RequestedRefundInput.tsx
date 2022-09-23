import { BigNumber, utils } from "ethers";
import { useField, useFormikContext } from "formik";
import styled from "styled-components";

import { colors } from "../../../../../../../lib/styles/colors";
import { Offer } from "../../../../../../../lib/types/offer";
import { Input } from "../../../../../../form";
import ConvertedPrice from "../../../../../../price/ConvertedPrice";
import CurrencyIcon from "../../../../../../price/CurrencyIcon";
import { useConvertedPrice } from "../../../../../../price/useConvertedPrice";
import { MAX_PERCENTAGE_DECIMALS } from "../../../const";
import { FormModel } from "../../MakeProposalFormModel";

const RefundAmountWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  background: ${colors.lightGrey};
  border: 1px solid ${colors.border};
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
  inEscrow: string;
  inEscrowWithDecimals: string;
  exchangeToken: Offer["exchangeToken"];
}

export default function RequestedRefundInput({
  inEscrow,
  inEscrowWithDecimals,
  exchangeToken
}: Props) {
  const [refundAmountField] = useField<string>(
    FormModel.formFields.refundAmount.name
  );
  const decimals = Number(exchangeToken.decimals);
  const formatDecimalsToIntValue = (value: string | number): BigNumber => {
    return utils.parseUnits(
      typeof value === "number" ? value.toFixed(decimals) : value || "0",
      decimals
    );
  };
  const refundAmountWithoutDecimals: string = formatDecimalsToIntValue(
    refundAmountField.value
  ).toString();
  const currencySymbol = exchangeToken.symbol;
  const price = useConvertedPrice({
    value: refundAmountWithoutDecimals,
    decimals: exchangeToken.decimals,
    symbol: currencySymbol
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { setFieldValue, handleChange, setFieldTouched } =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useFormikContext<any>();
  return (
    <RefundAmountWrapper>
      <CurrencyIcon currencySymbol={currencySymbol} />
      <Input
        step="0.001"
        name={FormModel.formFields.refundAmount.name}
        type="number"
        onChange={(e: { target: { valueAsNumber: number } }) => {
          handleChange(e);
          const {
            target: { valueAsNumber: currentRefundAmount }
          } = e;
          const percentageFromInput = (
            (currentRefundAmount / Number(inEscrowWithDecimals)) *
            100
          ).toFixed(MAX_PERCENTAGE_DECIMALS);
          setFieldValue(
            FormModel.formFields.refundPercentage.name,
            percentageFromInput,
            true
          );
          setFieldTouched(FormModel.formFields.refundPercentage.name, true);
        }}
        onBlur={() => {
          const currentRefundAmount: string = refundAmountWithoutDecimals;
          const percentageFromInput = (
            (Number(currentRefundAmount) / Number(inEscrow)) *
            100
          ).toFixed(MAX_PERCENTAGE_DECIMALS);
          const refundAmountFromPercentage: string = (
            (Number(inEscrowWithDecimals) * Number(percentageFromInput)) /
            100
          ).toFixed(decimals);
          const percentageFromRoundedRefundAmount = (
            (Number(refundAmountFromPercentage) /
              Number(inEscrowWithDecimals)) *
            100
          ).toFixed(MAX_PERCENTAGE_DECIMALS);
          setFieldValue(
            FormModel.formFields.refundPercentage.name,
            percentageFromRoundedRefundAmount,
            true
          );
          setFieldTouched(FormModel.formFields.refundPercentage.name, true);
          if (
            refundAmountFromPercentage !==
            Number(refundAmountField.value).toFixed(decimals)
          ) {
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
