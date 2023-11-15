import { CreateOfferArgs } from "@bosonprotocol/common";
import { offers, subgraph } from "@bosonprotocol/react-kit";
import * as Sentry from "@sentry/browser";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";

import { useCoreSDK } from "../useCoreSdk";
import { useIpfsStorage } from "./useIpfsStorage";

type OfferFieldsFragment = subgraph.OfferFieldsFragment;
type AdditionalOfferMetadata = offers.AdditionalOfferMetadata;
type ProductV1MetadataFields = subgraph.ProductV1MetadataEntity;

enum ExtendedProgressStatus {
  IDLE = "idle",
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error",
  TRY_WITH_OFFER_ID = "try_with_offer_id"
}

export function useRenderTemplate(
  offerId: string | undefined,
  offerData: OfferFieldsFragment | undefined,
  templateUrl: string
) {
  const [renderStatus, setRenderStatus] = useState<ExtendedProgressStatus>(
    ExtendedProgressStatus.IDLE
  );
  const [renderResult, setRenderResult] = useState<string>("");
  const ipfsMetadataStorage = useIpfsStorage();
  const coreSDK = useCoreSDK();

  useEffect(() => {
    async function fetchTemplate() {
      setRenderStatus(ExtendedProgressStatus.LOADING);
      if (ipfsMetadataStorage && coreSDK) {
        try {
          const rawTemplate = await ipfsMetadataStorage.get<Uint8Array>(
            templateUrl,
            false
          );
          const template = Buffer.from(rawTemplate).toString("utf-8");
          let theOfferData = offerData;
          if (
            offerData?.id &&
            renderStatus === ExtendedProgressStatus.TRY_WITH_OFFER_ID
          ) {
            theOfferData = await coreSDK.getOfferById(offerData["id"]);
          } else if (!offerData) {
            if (!offerId) {
              throw new Error("OfferData or OfferId needs to be defined");
            }
            // Get the offer fields from subgraph
            theOfferData = await coreSDK.getOfferById(offerId);
          }
          // Convert offer fields format to offer data format
          const { offerArgs, offerMetadata } = buildOfferData(
            theOfferData as OfferFieldsFragment
          );
          try {
            const result = await coreSDK.renderContractualAgreement(
              template,
              offerArgs,
              offerMetadata
            );
            setRenderResult(result);
            setRenderStatus(ExtendedProgressStatus.SUCCESS);
          } catch (innerError) {
            if (
              innerError instanceof offers.InvalidOfferDataError &&
              offerData?.id &&
              !offerId &&
              renderStatus !== ExtendedProgressStatus.TRY_WITH_OFFER_ID
            ) {
              setRenderStatus(ExtendedProgressStatus.TRY_WITH_OFFER_ID); // if using the offerData we got an error, we'll fetch the offer and try again
            } else {
              throw innerError;
            }
          }
        } catch (error) {
          console.error(error);
          Sentry.captureException(error);
          setRenderStatus(ExtendedProgressStatus.ERROR);
        }
      }
    }
    if (
      renderStatus === ExtendedProgressStatus.IDLE ||
      renderStatus === ExtendedProgressStatus.TRY_WITH_OFFER_ID
    ) {
      fetchTemplate();
    }
  }, [
    templateUrl,
    offerId,
    offerData,
    renderStatus,
    ipfsMetadataStorage,
    coreSDK
  ]);
  return { renderStatus, renderResult };
}

function buildOfferData(offerFields: OfferFieldsFragment): {
  offerArgs: CreateOfferArgs;
  offerMetadata: AdditionalOfferMetadata;
} {
  return {
    offerArgs: {
      price: offerFields.price as string,
      sellerDeposit: offerFields.sellerDeposit as string,
      agentId: offerFields.agentId as string,
      buyerCancelPenalty: offerFields.buyerCancelPenalty as string,
      quantityAvailable: offerFields.quantityAvailable as string,
      validFromDateInMS: BigNumber.from(offerFields.validFromDate)
        .mul(1000)
        .toString(),
      validUntilDateInMS: BigNumber.from(offerFields.validUntilDate)
        .mul(1000)
        .toString(),
      voucherRedeemableFromDateInMS: BigNumber.from(
        offerFields.voucherRedeemableFromDate
      )
        .mul(1000)
        .toString(),
      voucherRedeemableUntilDateInMS: BigNumber.from(
        offerFields.voucherRedeemableUntilDate
      )
        .mul(1000)
        .toString(),
      voucherValidDurationInMS: BigNumber.from(offerFields.voucherValidDuration)
        .mul(1000)
        .toString(),
      disputePeriodDurationInMS: BigNumber.from(
        offerFields.disputePeriodDuration
      )
        .mul(1000)
        .toString(),
      resolutionPeriodDurationInMS: BigNumber.from(
        offerFields.resolutionPeriodDuration
      )
        .mul(1000)
        .toString(),
      exchangeToken: offerFields.exchangeToken.address as string,
      disputeResolverId: offerFields.disputeResolverId as string,
      metadataHash: offerFields.metadataHash as string,
      metadataUri: offerFields.metadataUri as string,
      collectionIndex: offerFields.collectionIndex as string
    },
    offerMetadata: {
      sellerContactMethod:
        (offerFields.metadata as ProductV1MetadataFields)?.exchangePolicy
          ?.sellerContactMethod || "undefined",
      disputeResolverContactMethod:
        (offerFields.metadata as ProductV1MetadataFields)?.exchangePolicy
          ?.disputeResolverContactMethod || "undefined",
      escalationDeposit:
        offerFields.disputeResolutionTerms.buyerEscalationDeposit,
      escalationResponsePeriodInSec:
        offerFields.disputeResolutionTerms.escalationResponsePeriod,
      sellerTradingName:
        (offerFields.metadata as ProductV1MetadataFields)?.productV1Seller
          ?.name || "undefined",
      returnPeriodInDays:
        (offerFields.metadata as ProductV1MetadataFields)?.shipping
          ?.returnPeriodInDays || 0
    }
  };
}
