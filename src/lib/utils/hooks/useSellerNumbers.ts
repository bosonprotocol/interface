import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useMemo } from "react";

import {
  ExtendedOffer,
  ExtendedSeller
} from "../../../pages/explore/WithAllOffers";
import { getDateTimestamp } from "../getDateTimestamp";
import useProducts from "./product/useProducts";
dayjs.extend(isBetween);

interface ReturnProps {
  numbers: {
    exchanges: number;
    products: number;
  };
  isError: boolean;
  isLoading: boolean;
  products: ExtendedSeller[];
}
export default function useSellerNumbers(sellerId: string): ReturnProps {
  const {
    sellers: sellersProducts,
    isError,
    isLoading
  } = useProducts(
    {
      productsFilter: {
        sellerId
      }
    },
    {
      enableCurationList: false,
      withNumExchanges: true
    }
  );

  const products = useMemo(() => {
    return (sellersProducts.filter((s) => s.id === sellerId) || []).map(
      (sellerProducts) => {
        sellerProducts.products = sellerProducts.products?.reduce(
          (acc, elem) => {
            const isHasBeenBought = !!elem.exchanges?.length;
            const nowDate = dayjs();

            const isFullyVoided = elem.additional?.variants.every((variant) => {
              return !!variant.voidedAt;
            });

            // all products that are not fully voided and still have valid variants/offers
            const isStillHaveValid =
              !isFullyVoided &&
              elem.additional?.variants.some((variant) => {
                const validFromDateParsed = dayjs(
                  Number(variant?.validFromDate) * 1000
                );
                const validUntilDateParsed = dayjs(
                  Number(variant?.validUntilDate) * 1000
                );
                return nowDate.isBetween(
                  validFromDateParsed,
                  validUntilDateParsed,
                  "day",
                  "[]"
                );
              });

            // all products that have been fully voided, only and only if there exist at least 1 exchange for at least 1 of the variants/offer (whatever the status of this exchange)
            const isFullyVoidedAndBought = isFullyVoided && isHasBeenBought;

            // all products where all variants are not yet valid
            const isAllVariantsInProductNotValidYet =
              elem.additional?.variants.every((variant) => {
                return dayjs(getDateTimestamp(variant?.validFromDate)).isAfter(
                  nowDate
                );
              });

            // all products where all variants are expired, only and only if there exist at least 1 exchange for at least 1 offer (whatever the status of this exchange)
            const isAllVariantsInProductAreExpiredAndBought =
              elem.additional?.variants.every((variant) => {
                return dayjs(
                  getDateTimestamp(variant?.validUntilDate)
                ).isBefore(nowDate);
              }) && isHasBeenBought;

            if (
              isStillHaveValid ||
              isFullyVoidedAndBought ||
              isAllVariantsInProductNotValidYet ||
              isAllVariantsInProductAreExpiredAndBought
            ) {
              acc.push(elem);
            }
            return acc;
          },
          [] as ExtendedOffer[]
        );
        // REASSIGN OFFERS for compatibility with previous code
        sellerProducts.offers = sellerProducts.products;
        return sellerProducts;
      }
    );
  }, [sellerId, sellersProducts]);

  return {
    numbers: {
      exchanges: sellersProducts?.[0]?.numExchanges ?? 0,
      products: (products?.[0]?.products || [])?.length || 0
    },
    isError,
    isLoading,
    products
  };
}
