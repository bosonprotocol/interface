import { CreateOfferArgs } from "@bosonprotocol/common";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";

import { useCoreSDK } from "../useCoreSdk";
import { useIpfsStorage } from "./useIpfsStorage";

type RenderStatus = "idle" | "loading" | "success" | "error";

export function useRenderTemplate(offerId: string, templateUrl: string) {
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
          const offerData = await coreSDK.getOfferById(offerId);
          const result = await coreSDK.renderContractualAgreement(
            template,
            buildOfferData(offerData)
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
  }, [templateUrl, offerId, renderStatus, ipfsMetadataStorage, coreSDK]);
  return { renderStatus, renderResult };
}

function buildOfferData(offerData: Record<string, unknown>): CreateOfferArgs {
  return {
    price: offerData.price as string,
    sellerDeposit: offerData.sellerDeposit as string,
    agentId: offerData.agentId as string,
    buyerCancelPenalty: offerData.buyerCancelPenalty as string,
    quantityAvailable: offerData.quantityAvailable as string,
    validFromDateInMS: BigNumber.from(offerData.validFromDate)
      .mul(1000)
      .toString(),
    validUntilDateInMS: BigNumber.from(offerData.validUntilDate)
      .mul(1000)
      .toString(),
    voucherRedeemableFromDateInMS: BigNumber.from(
      offerData.voucherRedeemableFromDate
    )
      .mul(1000)
      .toString(),
    voucherRedeemableUntilDateInMS: BigNumber.from(
      offerData.voucherRedeemableUntilDate
    )
      .mul(1000)
      .toString(),
    fulfillmentPeriodDurationInMS: BigNumber.from(
      offerData.fulfillmentPeriodDuration
    )
      .mul(1000)
      .toString(),
    resolutionPeriodDurationInMS: BigNumber.from(
      offerData.resolutionPeriodDuration
    )
      .mul(1000)
      .toString(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    exchangeToken: (offerData as any).exchangeToken.address as string,
    disputeResolverId: offerData.disputeResolverId as string,
    metadataHash: offerData.metadataHash as string,
    metadataUri: offerData.metadataUri as string
  };
}
