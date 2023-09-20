import { subgraph } from "@bosonprotocol/react-kit";
import { useConfigContext } from "components/config/ConfigContext";
import { Token } from "components/convertion-rate/ConvertionRateContext";
import { ethers } from "ethers";
import { CONFIG } from "lib/config";
import { Offer } from "lib/types/offer";
import { useDisputeResolver } from "lib/utils/hooks/useDisputeResolver";
import { buildCondition } from "pages/create-product/utils/buildCondition";
import { getTermsOfExchange } from "pages/create-product/utils/getTermsOfExchange";
import { getDisputeResolverContactMethod } from "pages/create-product/utils/helpers";
import { useCallback, useMemo } from "react";

import { useCreateForm } from "./useCreateForm";

type UsePreviewOfferProps = {
  isMultiVariant: boolean;
  seller?: subgraph.SellerFieldsFragment;
  overrides?: Partial<{
    decimals: number;
  }>;
};

export const usePreviewOffers = ({
  isMultiVariant,
  seller,
  overrides = {}
}: UsePreviewOfferProps): Offer[] => {
  const { values } = useCreateForm();
  const { config } = useConfigContext();
  const disputeResolverId = config.envConfig.defaultDisputeResolverId;
  const { disputeResolver } = useDisputeResolver(disputeResolverId);
  const escalationResponsePeriod =
    disputeResolver?.escalationResponsePeriod || "0";

  const { tokenGating } = values;
  const commonTermsOfSale = isMultiVariant
    ? values.variantsCoreTermsOfSale
    : values.coreTermsOfSale;

  const validFromDateInMS = commonTermsOfSale.offerValidityPeriod[0]
    .toDate()
    .getTime();
  const validUntilDateInMS = commonTermsOfSale.offerValidityPeriod[1]
    .toDate()
    .getTime();
  const voucherRedeemableFromDateInMS = commonTermsOfSale.redemptionPeriod[0]
    .toDate()
    .getTime();
  const voucherRedeemableUntilDateInMS = commonTermsOfSale.redemptionPeriod[1]
    .toDate()
    .getTime();
  const exchangeDate = Date.now().toString();
  const buildOffer = useCallback(
    ({
      quantityAvailable,
      price,
      exchangeSymbol
    }: {
      quantityAvailable: number;
      price: number;
      exchangeSymbol: string | undefined;
    }) => {
      const exchangeToken = config.envConfig.defaultTokens?.find(
        (n: Token) => n.symbol === exchangeSymbol
      );

      const decimals =
        overrides.decimals ?? Number(exchangeToken?.decimals || 18);
      const condition =
        tokenGating.tokenType && values.productType?.tokenGatedOffer === "true"
          ? buildCondition(tokenGating, decimals)
          : undefined;
      const fee =
        disputeResolver && exchangeToken?.address
          ? disputeResolver.fees.find(
              (f: {
                feeAmount: string;
                tokenAddress: string;
                tokenName: string;
                token: {
                  address: string;
                  decimals: string;
                  symbol: string;
                  name: string;
                };
              }) => f.tokenAddress === exchangeToken.address
            )
          : undefined;
      const escalationDeposit = fee?.feeAmount || "0";
      const { priceBN, buyerCancellationPenaltyValue, sellerDeposit } =
        getTermsOfExchange({
          termsOfExchange: values.termsOfExchange,
          price,
          decimals
        });
      const offer = {
        price: priceBN.toString(),
        sellerDeposit,
        protocolFee: "0",
        agentFee: "0",
        agentId: "0",
        buyerCancelPenalty: buyerCancellationPenaltyValue,
        quantityAvailable: quantityAvailable.toString(),
        quantityInitial: quantityAvailable.toString(),
        validFromDate: (validFromDateInMS / 1000).toString(),
        validUntilDate: (validUntilDateInMS / 1000).toString(),
        voucherRedeemableFromDate: (
          voucherRedeemableFromDateInMS / 1000
        ).toString(),
        voucherRedeemableUntilDate: (
          voucherRedeemableUntilDateInMS / 1000
        ).toString(),
        disputePeriodDuration: `${
          parseInt(values.termsOfExchange.disputePeriod) * 24 * 3600
        }`, // day to sec
        voucherValidDuration: "0", // we use redeemableFrom/redeemableUntil so should be 0
        resolutionPeriodDuration: `${
          parseInt(CONFIG.defaultDisputeResolutionPeriodDays) * 24 * 3600
        }`, // day to sec
        metadataUri: "not-uploaded-yet", // can't be empty
        metadataHash: "not-uploaded-yet", // can't be empty
        voidedAt: null,
        disputeResolverId,
        exchanges: [
          {
            committedDate: exchangeDate,
            redeemedDate: exchangeDate
          }
        ],
        seller,
        exchangeToken: exchangeToken || {
          // this 'or' should never occurr
          address: ethers.constants.AddressZero,
          decimals: config.envConfig.nativeCoin?.decimals || "",
          name: values.coreTermsOfSale.currency.value || "",
          symbol: values.coreTermsOfSale.currency.value || ""
        },
        isValid: false,
        disputeResolutionTerms: {
          buyerEscalationDeposit: escalationDeposit,
          escalationResponsePeriod: escalationResponsePeriod
        },
        metadata: {
          shipping: {
            returnPeriodInDays: parseInt(values.shippingInfo.returnPeriod)
          },
          exchangePolicy: {
            sellerContactMethod: CONFIG.defaultSellerContactMethod,
            disputeResolverContactMethod: getDisputeResolverContactMethod(),
            template: values.termsOfExchange.exchangePolicy.value,
            label: values.termsOfExchange.exchangePolicy.label
          },
          productV1Seller: {
            name: values.createYourProfile.name
          }
        },
        condition: condition
      } as unknown as Offer;
      return offer;
    },
    [
      config.envConfig.defaultTokens,
      config.envConfig.nativeCoin?.decimals,
      disputeResolver,
      disputeResolverId,
      escalationResponsePeriod,
      exchangeDate,
      overrides.decimals,
      seller,
      tokenGating,
      validFromDateInMS,
      validUntilDateInMS,
      values.coreTermsOfSale.currency.value,
      values.createYourProfile.name,
      values.productType?.tokenGatedOffer,
      values.shippingInfo.returnPeriod,
      values.termsOfExchange,
      voucherRedeemableFromDateInMS,
      voucherRedeemableUntilDateInMS
    ]
  );
  const offerData: Offer[] = useMemo(() => {
    if (isMultiVariant) {
      const { variants = [] } = values.productVariants;

      return variants.map((variant) => {
        return buildOffer({
          price: variant.price || 0,
          quantityAvailable: variant.quantity,
          exchangeSymbol: variant.currency.value
        });
      });
    }

    return [
      buildOffer({
        price: values.coreTermsOfSale.price || 0,
        quantityAvailable: values.coreTermsOfSale.quantity,
        exchangeSymbol: values.coreTermsOfSale.currency.value
      })
    ];
  }, [
    buildOffer,
    isMultiVariant,
    values.coreTermsOfSale.currency.value,
    values.coreTermsOfSale.price,
    values.coreTermsOfSale.quantity,
    values.productVariants
  ]);
  return offerData;
};
