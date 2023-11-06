import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { BigNumber } from "ethers";
import groupBy from "lodash/groupBy";
import { useCallback, useMemo } from "react";
dayjs.extend(isBetween);

import { subgraph } from "@bosonprotocol/react-kit";

import { Offer } from "../../../lib/types/offer";
import { getDateTimestamp } from "../../../lib/utils/getDateTimestamp";
import { saveItemInStorage } from "../../../lib/utils/hooks/localstorage/useLocalStorage";
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
          const now = dayjs();
          const validUntilDate = dayjs(getDateTimestamp(offer?.validUntilDate));
          const isNotExpired = validUntilDate.isAfter(now);
          return isNotExpired && !offer.voided;
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

  const offersBackedFn = useCallback(
    (fund: subgraph.FundsEntityFieldsFragment): number | null => {
      let result = null;
      const backedFund = calcOffersBacked[fund.token.symbol];
      if (fund.availableAmount && backedFund) {
        result = Number(
          ((Number(fund.availableAmount) / Number(backedFund)) * 100).toFixed(2)
        );
        result = Number.isNaN(result) ? 0 : result;
      }
      return result;
    },
    [calcOffersBacked]
  );

  const offersBacked = useMemo(
    () =>
      funds?.map((fund) => ({
        token: fund?.token?.symbol,
        value: offersBackedFn(fund)
      })),
    [funds, offersBackedFn]
  );

  const displayWarning = useMemo(() => {
    const anyValue = offersBacked.find(
      (v) => v?.value !== null && Number(v?.value) < THRESHOLD
    );
    const shouldDisplay = anyValue !== undefined;
    saveItemInStorage("shouldDisplayOfferBackedWarning", shouldDisplay);
    return shouldDisplay;
  }, [offersBacked]);

  if (exchangesTokensData.isLoading || sellerLockedFunds.isLoading) {
    return {
      offersBacked: [],
      calcOffersBacked: {},
      sellerLockedFunds: {},
      threshold: THRESHOLD,
      displayWarning,
      offersBackedFn
    };
  }

  return {
    offersBacked,
    calcOffersBacked,
    sellerLockedFunds,
    threshold: THRESHOLD,
    displayWarning,
    offersBackedFn
  };
}
