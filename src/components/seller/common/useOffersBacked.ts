import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { BigNumber } from "ethers";
import groupBy from "lodash/groupBy";
import { useMemo } from "react";
dayjs.extend(isBetween);

import { Offer } from "../../../lib/types/offer";
import { SellerExchangeProps } from "../../../lib/utils/hooks/useSellerDeposit";
import { WithSellerDataProps } from "./WithSellerData";

export default function useOffersBacked({
  funds: fundsData,
  exchangesTokens: exchangesTokensData,
  sellerDeposit: sellerDepositData
}: Pick<WithSellerDataProps, "funds" | "exchangesTokens" | "sellerDeposit">) {
  const THRESHOLD = 15;

  const { funds } = fundsData;
  const { data: exchangesTokens } = exchangesTokensData;
  const { data: sellersData } = sellerDepositData;

  const calcOffersBacked = useMemo(() => {
    const offersBackedByGroup: { [key: string]: string } = {};
    if (!Array.isArray(exchangesTokens) || !exchangesTokens.length) {
      return offersBackedByGroup;
    }
    exchangesTokens?.forEach((exchangeToken) => {
      const key = exchangeToken?.symbol;
      const notExpiredAndNotVoidedOffers = exchangeToken?.offers?.filter(
        (offer: Offer) => {
          const validUntilDateParsed = dayjs(
            Number(offer?.validUntilDate) * 1000
          );
          const validFromDateParsed = dayjs(
            Number(offer?.validFromDate) * 1000
          );
          const isNotExpired = dayjs().isBetween(
            validFromDateParsed,
            validUntilDateParsed,
            "day",
            "[]"
          );
          return isNotExpired && !offer.voidedAt;
        }
      );
      const sumValue = notExpiredAndNotVoidedOffers?.reduce((acc, data) => {
        const { sellerDeposit, quantityAvailable } = data;
        acc = acc
          ? BigNumber.from(acc)
              .add(
                BigNumber.from(sellerDeposit).mul(
                  BigNumber.from(quantityAvailable)
                )
              )
              .toString()
          : BigNumber.from(sellerDeposit)
              .mul(BigNumber.from(quantityAvailable))
              .toString();
        return acc;
      }, "");
      offersBackedByGroup[key] = sumValue;
    });
    return offersBackedByGroup;
  }, [exchangesTokens]);

  const sellerLockedFunds = useMemo(() => {
    const lockedFundsByGroup: { [key: string]: string } = {};
    if (
      !sellersData?.exchanges ||
      !Array.isArray(sellersData?.exchanges) ||
      !sellersData?.exchanges.length
    ) {
      return lockedFundsByGroup;
    }

    const noFinalized =
      sellersData.exchanges?.filter(
        (exchange: SellerExchangeProps) => !exchange?.finalizedDate
      ) ?? [];

    const groupedBySymbol = groupBy(
      noFinalized,
      (exchange: SellerExchangeProps) => exchange?.offer?.exchangeToken?.symbol
    );
    Object.keys(groupedBySymbol).forEach((key) => {
      const element = groupedBySymbol[key];
      const sum = element.reduce((acc, elem) => {
        acc = acc
          ? BigNumber.from(acc)
              .add(BigNumber.from(elem.offer.sellerDeposit))
              .toString()
          : elem.offer.sellerDeposit;
        return acc;
      }, "");
      lockedFundsByGroup[key] = sum;
    });
    return lockedFundsByGroup;
  }, [sellersData]);

  const offersBacked = useMemo(
    () =>
      funds?.map((fund) => {
        let result = null;
        if (fund.availableAmount && calcOffersBacked[fund.token.symbol]) {
          result = Number(
            (
              (Number(fund.availableAmount) /
                Number(calcOffersBacked[fund.token.symbol])) *
              100
            ).toFixed(2)
          );
        }
        return result;
      }),
    [calcOffersBacked, funds]
  );

  if (exchangesTokensData.isLoading || sellerLockedFunds.isLoading) {
    return {
      offersBacked: [],
      calcOffersBacked: {},
      sellerLockedFunds: {},
      threshold: THRESHOLD
    };
  }

  return {
    offersBacked,
    calcOffersBacked,
    sellerLockedFunds,
    threshold: THRESHOLD
  };
}
