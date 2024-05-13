import { ProductV1Metadata, subgraph } from "@bosonprotocol/react-kit";
import { useConfigContext } from "components/config/ConfigContext";
import { Token } from "components/convertion-rate/ConvertionRateContext";
import { ethers } from "ethers";
import { CONFIG } from "lib/config";
import { Offer } from "lib/types/offer";
import { useChainId } from "lib/utils/hooks/connection/connection";
import { useDisputeResolver } from "lib/utils/hooks/useDisputeResolver";
import { buildCondition } from "pages/create-product/utils/buildCondition";
import { extractOfferTimestamps } from "pages/create-product/utils/dataValidator";
import { getTermsOfExchange } from "pages/create-product/utils/getTermsOfExchange";
import { getDisputeResolverContactMethod } from "pages/create-product/utils/helpers";
import { getDigitalMetadatas } from "pages/create-product/utils/productDigital";
import { SupportedJuridiction } from "pages/create-product/utils/types";
import { useCallback, useMemo } from "react";

import { useForm } from "../../../lib/utils/hooks/useForm";
import { ProductTypeTypeValues } from "./const";

type UsePreviewOfferProps = {
  isMultiVariant: boolean;
  seller?: subgraph.SellerFieldsFragment;
  overrides?: Partial<{
    decimals: number;
    offerImg: string;
    visuals_images: string[];
  }>;
};

export const usePreviewOffers = ({
  isMultiVariant,
  seller,
  overrides = {}
}: UsePreviewOfferProps): Offer[] => {
  const { values } = useForm();
  const chainId = useChainId();
  const { config } = useConfigContext();
  const disputeResolverId = config.envConfig.defaultDisputeResolverId;
  const { disputeResolver } = useDisputeResolver(disputeResolverId);
  const escalationResponsePeriod =
    disputeResolver?.escalationResponsePeriod || "0";

  const { tokenGating } = values;
  const commonTermsOfSale = isMultiVariant
    ? values.variantsCoreTermsOfSale
    : values.coreTermsOfSale;

  const {
    offerValidityPeriod,
    redemptionPeriod,
    infiniteExpirationOffers,
    voucherValidDurationInDays
  } = commonTermsOfSale;

  const {
    voucherRedeemableFromDateInMS,
    voucherRedeemableUntilDateInMS,
    voucherValidDurationInMS,
    validFromDateInMS,
    validUntilDateInMS
  } = extractOfferTimestamps({
    offerValidityPeriod,
    redemptionPeriod,
    infiniteExpirationOffers: !!infiniteExpirationOffers,
    voucherValidDurationInDays
  });

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
      const productV1Seller = {
        name: values.createYourProfile.name,
        description: values.createYourProfile.description
      };
      const shipping: ProductV1Metadata["shipping"] = {
        id: "shipping",
        defaultVersion: 1,
        countryOfOrigin: "",
        supportedJurisdictions:
          values.shippingInfo.jurisdiction.length > 0
            ? values.shippingInfo.jurisdiction
                .filter((v) => v.time && v.region)
                .reduce(
                  (prev, current) => {
                    const { region, time } = current;
                    if (
                      !region ||
                      region.length === 0 ||
                      !time ||
                      time.length === 0
                    ) {
                      return prev;
                    } else {
                      return [
                        ...prev,
                        {
                          id: `${region}-${time}`,
                          label: region,
                          deliveryTime: time
                        }
                      ];
                    }
                  },
                  [] as Array<SupportedJuridiction & { id: string }>
                )
            : undefined,
        returnPeriodInDays: values.shippingInfo.returnPeriod.toString(),
        redemptionPoint: values.shippingInfo.redemptionPointUrl
      };
      const product = {
        title: values.productInformation.productTitle,
        description: values.productInformation.description,
        ...(overrides.visuals_images && {
          visuals_images: overrides.visuals_images.map((ipfsLink) => ({
            url: ipfsLink
          }))
        }),
        shipping
      };

      const offer = {
        price: priceBN.toString(),
        sellerDeposit,
        protocolFee: "0",
        agentFee: "0",
        agentId: "0",
        buyerCancelPenalty: buyerCancellationPenaltyValue,
        quantityAvailable: quantityAvailable.toString(),
        quantityInitial: quantityAvailable.toString(),
        validFromDate: Math.floor(validFromDateInMS / 1000).toString(),
        validUntilDate: Math.floor(validUntilDateInMS / 1000).toString(),
        voucherRedeemableFromDate: Math.floor(
          voucherRedeemableFromDateInMS / 1000
        ).toString(),
        voucherRedeemableUntilDate: voucherRedeemableUntilDateInMS
          ? Math.floor(voucherRedeemableUntilDateInMS / 1000).toString()
          : "0",
        disputePeriodDuration: `${
          parseInt(values.termsOfExchange.disputePeriod) * 24 * 3600
        }`, // day to sec
        voucherValidDuration: voucherValidDurationInMS
          ? Math.floor(voucherValidDurationInMS / 1000).toString()
          : "0",
        resolutionPeriodDuration: `${
          parseInt(CONFIG.defaultDisputeResolutionPeriodDays) * 24 * 3600
        }`, // day to sec
        metadataUri: "not-uploaded-yet", // can't be empty
        metadataHash: "not-uploaded-yet", // can't be empty
        voidedAt: null,
        disputeResolverId,
        exchanges: [],
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
          name:
            values.productType.productType === ProductTypeTypeValues.phygital
              ? values.productInformation.bundleName
              : values.productInformation.productTitle,
          description:
            values.productType.productType === ProductTypeTypeValues.phygital
              ? values.productInformation.bundleDescription
              : values.productInformation.description,
          type:
            values.productType.productType === ProductTypeTypeValues.phygital
              ? subgraph.MetadataType.BUNDLE
              : subgraph.MetadataType.PRODUCT_V1,
          ...(values.productType.productType ===
            ProductTypeTypeValues.phygital && {
            items: [
              {
                type: subgraph.ItemMetadataType.ITEM_PRODUCT_V1,
                product,
                productV1Seller,
                shipping
              },
              ...getDigitalMetadatas({ chainId, values })
            ]
          }),
          product,
          ...(overrides.offerImg && { image: overrides.offerImg }),
          animationUrl: values.productAnimation?.[0]?.src,
          shipping,
          exchangePolicy: {
            sellerContactMethod: CONFIG.defaultSellerContactMethod,
            disputeResolverContactMethod: getDisputeResolverContactMethod(),
            template: values.termsOfExchange.exchangePolicy.value,
            label: values.termsOfExchange.exchangePolicy.label
          },
          productV1Seller
        },
        condition
      } as unknown as Offer;
      return offer;
    },
    [
      chainId,
      config.envConfig.defaultTokens,
      config.envConfig.nativeCoin?.decimals,
      disputeResolver,
      disputeResolverId,
      escalationResponsePeriod,
      overrides.decimals,
      overrides.offerImg,
      overrides.visuals_images,
      seller,
      tokenGating,
      validFromDateInMS,
      validUntilDateInMS,
      values,
      voucherRedeemableFromDateInMS,
      voucherRedeemableUntilDateInMS,
      voucherValidDurationInMS
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
