import { useMemo } from "react";

import { CONFIG } from "../../lib/config";
import { displayFloat } from "../../lib/utils/calcPrice";
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
          <span>
            {withParethensis ? "(" : ""}
            {CONFIG.defaultCurrency.symbol}
          </span>{" "}
          <span>
            {displayFloat(price?.converted, {
              fixed: 2
            })}
            {withParethensis ? ")" : ""}
          </span>
        </small>
      ),
    [price, isExchange, withParethensis]
  );
  return <>{ConvertedPriceComponent}</>;
}
