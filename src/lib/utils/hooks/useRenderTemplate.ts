import { CreateOfferArgs } from "@bosonprotocol/common";
import { offers, subgraph } from "@bosonprotocol/react-kit";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";

import { ProgressStatus } from "../../types/progressStatus";
import { useCoreSDK } from "../useCoreSdk";
import { useIpfsStorage } from "./useIpfsStorage";

type OfferFieldsFragment = subgraph.OfferFieldsFragment;
type AdditionalOfferMetadata = offers.AdditionalOfferMetadata;

export function useRenderTemplate(
  offerId: string | undefined,
  offerData: OfferFieldsFragment | undefined,
  templateUrl: string
) {
  const [renderStatus, setRenderStatus] = useState<ProgressStatus>(
    ProgressStatus.IDLE
  );
  const [renderResult, setRenderResult] = useState<string>("");
  const ipfsMetadataStorage = useIpfsStorage();
  const coreSDK = useCoreSDK();

  useEffect(() => {
    async function fetchTemplate() {
      setRenderStatus(ProgressStatus.LOADING);
      if (ipfsMetadataStorage && coreSDK) {
        try {
          const rawTemplate = await ipfsMetadataStorage.get<Uint8Array>(
            templateUrl,
            false
          );
          const template = Buffer.from(rawTemplate).toString("utf-8");
          let theOfferData = offerData;
          // If the offerData is not specified, retrieve the data from offerId
          if (!offerData) {
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
          const result = await coreSDK.renderContractualAgreement(
            template,
            offerArgs,
            offerMetadata
          );
          setRenderResult(result);
          setRenderStatus(ProgressStatus.SUCCESS);
        } catch (e) {
          console.error(e);
          setRenderStatus(ProgressStatus.ERROR);
        }
      }
    }
    if (
      renderStatus !== ProgressStatus.SUCCESS &&
      renderStatus !== ProgressStatus.ERROR
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
      fulfillmentPeriodDurationInMS: BigNumber.from(
        offerFields.fulfillmentPeriodDuration
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
      metadataUri: offerFields.metadataUri as string
    },
    offerMetadata: {
      // TODO: to be completed in next PR (temporary fix to restore compatibility with CC)
      sellerContactMethod: "TBD",
      disputeResolverContactMethod: "TBD",
      escalationDeposit: "0",
      escalationResponsePeriodInSec: "0",
      sellerTradingName: "TBD",
      returnPeriodInDays: 0
    }
  };
}
