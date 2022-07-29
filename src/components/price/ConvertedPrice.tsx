import { useMemo } from "react";

import { CONFIG } from "../../lib/config";
import { IPrice } from "../../lib/utils/convertPrice";

interface Props {
  price: IPrice;
  withParethensis?: boolean;
  isExchange?: boolean; // TODO: remove this prop
}

export default function ConvertedPrice({
  price,
  withParethensis,
  isExchange
}: Props) {
  const ConvertedPriceComponent = useMemo(
    () =>
      price?.converted && (
        <small
          style={{ marginLeft: isExchange ? "-1rem" : "0" }}
          data-converted-price
        >
          {"   "}
          <span style={{ color: "#556072", opacity: "0.5" }}>
            {withParethensis ? "(" : ""}
            {CONFIG.defaultCurrency.symbol}
          </span>{" "}
          <span>
            {price.converted}
            {withParethensis ? ")" : ""}
          </span>
        </small>
      ),
    [price, isExchange, withParethensis]
  );
  return <>{ConvertedPriceComponent}</>;
}
