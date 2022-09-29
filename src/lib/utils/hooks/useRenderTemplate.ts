import { CreateOfferArgs } from "@bosonprotocol/common";
import { subgraph } from "@bosonprotocol/react-kit";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";

import { useCoreSDK } from "../useCoreSdk";
import { useIpfsStorage } from "./useIpfsStorage";

type RenderStatus = "idle" | "loading" | "success" | "error";
type OfferFieldsFragment = subgraph.OfferFieldsFragment;

export function useRenderTemplate(
  offerId: string | undefined,
  offerData: OfferFieldsFragment | undefined,
  templateUrl: string
) {
  const [renderStatus, setRenderStatus] = useState<RenderStatus>("idle");
  const [renderResult, setRenderResult] = useState<string>("");
  const ipfsMetadataStorage = useIpfsStorage();
  const coreSDK = useCoreSDK();

  useEffect(() => {
    async function fetchTemplate() {
      console.log("fetchTemplate");
      setRenderStatus("loading");
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
          const result = await coreSDK.renderContractualAgreement(
            template,
            // Convert offer fields format to offer data format
            buildOfferData(theOfferData as OfferFieldsFragment)
          );
          setRenderResult(result);
          setRenderStatus("success");
        } catch (e) {
          console.error(e);
          setRenderStatus("error");
        }
      }
    }
    if (renderStatus !== "success" && renderStatus !== "error") {
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

function buildOfferData(offerFields: OfferFieldsFragment): CreateOfferArgs {
  return {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    exchangeToken: (offerFields as any).exchangeToken.address as string,
    disputeResolverId: offerFields.disputeResolverId as string,
    metadataHash: offerFields.metadataHash as string,
    metadataUri: offerFields.metadataUri as string
  };
}
