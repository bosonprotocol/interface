import { EvaluationMethod } from "@bosonprotocol/common";
import { offers, productV1, subgraph } from "@bosonprotocol/react-kit";
import * as Sentry from "@sentry/browser";
import { Form, Formik } from "formik";
import React from "react";
import toast from "react-hot-toast";
import { generatePath } from "react-router-dom";
import uuid from "react-uuid";

import { UrlParameters } from "../../../../lib/routing/parameters";
import { ProductRoutes } from "../../../../lib/routing/routes";
import { useCreateOffers } from "../../../../lib/utils/hooks/offer/useCreateOffers";
import { useKeepQueryParamsNavigate } from "../../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { useCoreSDK } from "../../../../lib/utils/useCoreSdk";
import Yup from "../../../../lib/validation/index";
import { ExtendedOffer } from "../../../../pages/explore/WithAllOffers";
import { CoreTermsOfSaleDates } from "../../../product/coreTermsOfSale/CoreTermsOfSaleDates";
import {
  commonCoreTermsOfSaleValidationSchema,
  TOKEN_CRITERIA
} from "../../../product/utils";
import SuccessTransactionToast from "../../../toasts/SuccessTransactionToast";
import BosonButton from "../../../ui/BosonButton";
import Typography from "../../../ui/Typography";
import { useModal } from "../../useModal";

interface RelistOfferModalProps {
  offer: ExtendedOffer;
  onRelistedSuccessfully?: () => void;
}

const validationSchema = Yup.object({
  offerValidityPeriod:
    commonCoreTermsOfSaleValidationSchema["offerValidityPeriod"],

  redemptionPeriod: commonCoreTermsOfSaleValidationSchema["redemptionPeriod"]
});

type RelistType = Yup.InferType<typeof validationSchema>;

export const RelistOfferModal: React.FC<RelistOfferModalProps> = ({
  offer,
  onRelistedSuccessfully
}) => {
  const coreSDK = useCoreSDK();
  const { showModal, hideModal } = useModal();
  const navigate = useKeepQueryParamsNavigate();
  const { mutateAsync: createOffers } = useCreateOffers();
  return (
    <Formik<RelistType>
      initialValues={{
        offerValidityPeriod: [],
        redemptionPeriod: []
      }}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        try {
          const validFromDate = values.offerValidityPeriod[0]
            .toDate()
            .getTime();
          const validUntilDate = values.offerValidityPeriod[1]
            .toDate()
            .getTime();
          const voucherRedeemableFromDate = values.redemptionPeriod[0]
            .toDate()
            .getTime();
          const voucherRedeemableUntilDate = values.redemptionPeriod[1]
            .toDate()
            .getTime();
          const isMultiVariant = (offer.additional?.variants?.length ?? []) > 1;
          const { condition } = offer;
          const isTokenGated = !!condition;
          const offersToCreate: offers.CreateOfferArgs[] = [];
          const productUuid = uuid();
          for (const variant of offer.additional?.variants ?? []) {
            const metadataUuid = uuid();
            const originalMetadata = (await coreSDK.getMetadata(
              variant.metadataHash
            )) as productV1.ProductV1Metadata;
            const redeemableAtValue = originalMetadata.attributes.find(
              (attribute) => attribute.trait_type === "Redeemable At"
            )?.value;
            const origin = redeemableAtValue;
            const metadataAsString = JSON.stringify(originalMetadata);
            const metadata = JSON.parse(
              metadataAsString
                .replaceAll(
                  `${origin}/#/license/${originalMetadata.uuid}`,
                  `${origin}/#/license/${metadataUuid}`
                )
                .replaceAll(
                  `${origin}/#/variant-uuid/${originalMetadata.uuid}`,
                  `${origin}/#/variant-uuid/${metadataUuid}`
                )
                .replaceAll(
                  `${origin}/#/offer-uuid/${originalMetadata.uuid}`,
                  `${origin}/#/offer-uuid/${metadataUuid}`
                )
            ) as productV1.ProductV1Metadata;
            const metadataHash = await coreSDK.storeMetadata({
              ...metadata,
              uuid: metadataUuid,
              attributes: [
                ...metadata.attributes.filter(
                  (attribute) =>
                    attribute.trait_type !== "Redeemable Until" &&
                    attribute.display_type !== "date"
                ),
                {
                  trait_type: "Redeemable Until",
                  value: voucherRedeemableUntilDate.toString(),
                  display_type: "date"
                }
              ],
              exchangePolicy: {
                ...metadata.exchangePolicy,
                uuid: Date.now().toString()
              },
              product: {
                ...metadata.product,
                uuid: productUuid
              }
            });
            const offerData = {
              price: variant.price.toString(),
              sellerDeposit: variant.sellerDeposit.toString(),
              buyerCancelPenalty: variant.buyerCancelPenalty.toString(),
              quantityAvailable: variant.quantityAvailable.toString(),
              voucherRedeemableFromDateInMS:
                voucherRedeemableFromDate.toString(),
              voucherRedeemableUntilDateInMS: voucherRedeemableUntilDate,
              voucherValidDurationInMS: variant.voucherValidDuration.toString(),
              validFromDateInMS: validFromDate.toString(),
              validUntilDateInMS: validUntilDate.toString(),
              disputePeriodDurationInMS: (
                Number(variant.disputePeriodDuration) * 1000
              ).toString(),
              resolutionPeriodDurationInMS:
                variant.resolutionPeriodDuration.toString(),
              exchangeToken: variant.exchangeToken?.address,
              disputeResolverId: variant.disputeResolverId,
              agentId: variant.agentId, // no agent
              metadataUri: `ipfs://${metadataHash}`,
              metadataHash: metadataHash
            };
            offersToCreate.push(offerData);
          }
          const handleOpenSuccessModal = (
            offerInfo: subgraph.OfferFieldsFragment
          ) => {
            if (!offerInfo.metadata) {
              return;
            }
            const onViewMyItem = () => {
              hideModal();
              const id = productUuid;
              const pathname = generatePath(ProductRoutes.ProductDetail, {
                [UrlParameters.uuid]: id
              });
              navigate({ pathname });
            };
            showModal(
              "PRODUCT_CREATE_SUCCESS",
              {
                title: `Offer ${offerInfo.id}`,
                name: offerInfo.metadata.name,
                message: "You have successfully relisted:",
                image: offerInfo.metadata.image,
                price: offerInfo.price,
                offer: offerInfo,
                hasMultipleVariants: isMultiVariant,
                onViewMyItem
              },
              "auto"
            );
          };

          await createOffers({
            isMultiVariant,
            offersToCreate,
            tokenGatedInfo: isTokenGated
              ? {
                  maxCommits: condition.maxCommits,
                  minBalance: condition.threshold,
                  tokenContract: condition.tokenAddress,
                  tokenCriteria:
                    condition.method === EvaluationMethod.SpecificToken
                      ? TOKEN_CRITERIA[1]
                      : TOKEN_CRITERIA[0],
                  tokenId: condition.tokenId,
                  tokenType: condition.tokenType
                }
              : null,
            conditionDecimals: Number(offer.exchangeToken.decimals),
            onCreatedOffersWithVariants: ({ firstOffer }) => {
              toast((t) => (
                <SuccessTransactionToast
                  t={t}
                  action={`Relisted offer with variants: ${firstOffer?.metadata?.name}`}
                  onViewDetails={() => {
                    handleOpenSuccessModal(
                      firstOffer || ({} as subgraph.OfferFieldsFragment)
                    );
                  }}
                />
              ));
            },
            onCreatedSingleOffers: ({ offer: createdOffer }) => {
              toast((t) => (
                <SuccessTransactionToast
                  t={t}
                  action={`Relisted offer: ${createdOffer?.metadata?.name}`}
                  onViewDetails={() => {
                    handleOpenSuccessModal(
                      createdOffer || ({} as subgraph.OfferFieldsFragment)
                    );
                  }}
                />
              ));
            }
          });
          onRelistedSuccessfully?.();
        } catch (error) {
          showModal("TRANSACTION_FAILED", {
            errorMessage: "Something went wrong",
            detailedErrorMessage:
              "Please try again or try disconnecting and reconnecting your wallet before relisting the offer"
          });
          console.error(error);
          Sentry.captureException(error);
        }
      }}
    >
      {({ isValid }) => {
        return (
          <Form>
            <Typography tag="p" margin="0 0 2rem 0">
              Relisting an offer duplicates all its contents except for the IDs,
              Offer Validity period, and Redemption period as they may be in the
              past, so you will need to define them here.
            </Typography>
            <CoreTermsOfSaleDates />
            <BosonButton type="submit" disabled={!isValid}>
              Relist Offer
            </BosonButton>
          </Form>
        );
      }}
    </Formik>
  );
};
