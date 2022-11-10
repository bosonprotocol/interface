import { useContext, useMemo } from "react";

import ConvertionRateContext from "../../../components/convertion-rate/ConvertionRateContext";
import { CONFIG } from "../../config";
import { calcPercentage, calcPrice } from "../calcPrice";
import { convertPrice } from "../convertPrice";
import { Exchange } from "./useExchanges";

export default function useRefundData(exchange: Exchange, price: string) {
  const { store } = useContext(ConvertionRateContext);
  const { offer } = exchange;

  const priceValue = useMemo(
    () => calcPrice(price, offer.exchangeToken.decimals),
    [price, offer.exchangeToken.decimals]
  );
  const priceConverted = useMemo(
    () =>
      convertPrice({
        price: priceValue,
        symbol: offer.exchangeToken.symbol,
        currency: CONFIG.defaultCurrency,
        rates: store.rates,
        fixed: store.fixed
      }),
    [priceValue, store.rates, store.fixed, offer.exchangeToken.symbol]
  );

  const penalty = calcPercentage(offer, "buyerCancelPenalty");
  const penaltyPrice = useMemo(
    () =>
      calcPrice(
        (Number(price) * penalty.percentage).toString(),
        offer.exchangeToken.decimals
      ),
    [price, penalty.percentage, offer.exchangeToken.decimals]
  );
  const penaltyConverted = useMemo(
    () =>
      convertPrice({
        price: penaltyPrice,
        symbol: offer.exchangeToken.symbol,
        currency: CONFIG.defaultCurrency,
        rates: store.rates,
        fixed: store.fixed
      }),
    [penaltyPrice, store.rates, store.fixed, offer.exchangeToken.symbol]
  );

  const refundPrice = useMemo(
    () =>
      calcPrice(
        (
          Number(price) -
          (Number(price) * Number(penalty.percentage || 0)) / 100
        ).toString(),
        offer.exchangeToken.decimals
      ),
    [price, offer.exchangeToken.decimals, penalty.percentage]
  );
  const refundConverted = useMemo(
    () =>
      convertPrice({
        price: refundPrice.toString(),
        symbol: offer.exchangeToken.symbol,
        currency: CONFIG.defaultCurrency,
        rates: store.rates,
        fixed: store.fixed
      }),
    [refundPrice, store.rates, store.fixed, offer.exchangeToken.symbol]
  );

  return {
    currency: offer.exchangeToken.symbol,
    price: {
      value: priceValue,
      show: !!priceConverted,
      converted: {
        value: priceConverted.converted,
        currency: priceConverted.currency.symbol
      }
    },
    penalty: {
      value: penalty.percentage,
      show: !!penaltyConverted,
      converted: {
        value: penaltyConverted.converted,
        currency: penaltyConverted.currency.symbol
      }
    },
    refund: {
      value: refundPrice,
      show: !!refundConverted,
      converted: {
        value: refundConverted.converted,
        currency: refundConverted.currency.symbol
      }
    }
  };
}
