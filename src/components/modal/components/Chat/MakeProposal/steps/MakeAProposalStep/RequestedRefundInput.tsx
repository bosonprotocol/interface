import { BigNumber, utils } from "ethers";
import { useField, useFormikContext } from "formik";
import styled from "styled-components";

import { MAX_PERCENTAGE_DECIMALS } from "../../../../../../../lib/constants/percentages";
import { colors } from "../../../../../../../lib/styles/colors";
import { Offer } from "../../../../../../../lib/types/offer";
import { Input } from "../../../../../../form";
import { InputError } from "../../../../../../form/Input";
import ConvertedPrice from "../../../../../../price/ConvertedPrice";
import { useConvertedPrice } from "../../../../../../price/useConvertedPrice";
import { Grid } from "../../../../../../ui/Grid";
import { FormModel } from "../../MakeProposalFormModel";

const RefundAmountWrapper = styled.div`
  width: 100%;
  background: ${colors.greyLight};
  border: 1px solid ${colors.border};

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

const name = FormModel.formFields.refundAmount.name;
export default function RequestedRefundInput({
  inEscrow,
  inEscrowWithDecimals,
  exchangeToken
}: Props) {
  const [refundAmountField] = useField<string>(name);
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
  const { symbol: currencySymbol } = exchangeToken;
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
      <Grid flexDirection="column">
        <Grid flex="0 1 auto" flexWrap="wrap" justifyContent="flex-end">
          <Input
            style={{
              border: "none",
              paddingRight: "0",
              width: "min-content"
            }}
            size={5}
            step="0.001"
            hideError
            name={name}
            type="number"
            onChange={(e: { target: { valueAsNumber: number } }) => {
              try {
                formatDecimalsToIntValue(e.target.valueAsNumber).toString();
              } catch (err) {
                return;
              }
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
          {currencySymbol}
          <div style={{ minWidth: "43px", textAlign: "right" }}>
            <ConvertedPrice price={price} withParethensis />
          </div>
        </Grid>
        <InputError name={name} />
      </Grid>
    </RefundAmountWrapper>
  );
}
