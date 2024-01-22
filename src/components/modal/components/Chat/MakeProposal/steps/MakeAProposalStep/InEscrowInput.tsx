import { Formik } from "formik";
import styled from "styled-components";

import { colors } from "../../../../../../../lib/styles/colors";
import { Offer } from "../../../../../../../lib/types/offer";
import { Input } from "../../../../../../form";
import { InputError } from "../../../../../../form/Input";
import ConvertedPrice from "../../../../../../price/ConvertedPrice";
import { useConvertedPrice } from "../../../../../../price/useConvertedPrice";
import { Grid } from "../../../../../../ui/Grid";

const Wrapper = styled.div`
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
  exchangeToken: Offer["exchangeToken"];
  inEscrow: string;
}

export default function InEscrowInput({ exchangeToken, inEscrow }: Props) {
  const { symbol: currencySymbol } = exchangeToken;
  const price = useConvertedPrice({
    value: inEscrow,
    decimals: exchangeToken.decimals,
    symbol: currencySymbol
  });

  return (
    <Wrapper>
      <Formik
        initialValues={{
          inEscrow: price.price
        }}
        onSubmit={() => {
          //
        }}
      >
        <Grid flexDirection="column">
          <Grid flex="0 1 auto" flexWrap="wrap" justifyContent="flex-end">
            <Input
              style={{
                border: "none",
                paddingRight: "0",
                width: "min-content"
              }}
              hideError
              name="inEscrow"
              type="number"
              readOnly
            />
            {currencySymbol}
            <div style={{ minWidth: "43px", textAlign: "right" }}>
              <ConvertedPrice price={price} withParethensis />
            </div>
          </Grid>
          <InputError name="inEscrow" />
        </Grid>
      </Formik>
    </Wrapper>
  );
}
