import { BigNumber } from "ethers";
import { useEffect, useState } from "react";

import { CONFIG } from "../../config";
import { useCoreSDK } from "../useCoreSdk";
import { useIpfsStorage } from "./useIpfsStorage";

type RenderStatus = "idle" | "loading" | "success" | "error";

// Create a mocked structure with offer data (as the coreSDK does not provide a method to pass offerId AND a template)
const mockOfferData = {
  price: "0",
  sellerDeposit: "0",
  agentId: "0",
  buyerCancelPenalty: "0",
  quantityAvailable: "0",
  validFromDateInMS: "0",
  validUntilDateInMS: "0",
  voucherRedeemableFromDateInMS: "0",
  voucherRedeemableUntilDateInMS: "0",
  fulfillmentPeriodDurationInMS: "0",
  resolutionPeriodDurationInMS: "0",
  exchangeToken: "0x0000000000000000000000000000000000000000",
  disputeResolverId: "0",
  metadataUri: "",
  metadataHash: ""
};

export function useRenderTemplate(offerId: string) {
  const [renderStatus, setRenderStatus] = useState<RenderStatus>("idle");
  const [renderResult, setRenderResult] = useState<string>("");
  const ipfsMetadataStorage = useIpfsStorage();
  const coreSDK = useCoreSDK();
  const templateUrl = CONFIG.rNFTLicenseTemplate as string; // TODO: get the template from the offer metadata

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
          const result = await coreSDK.renderContractualAgreement(template, {
            ...mockOfferData,
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
            metadataHash: offerData.metadataHash,
            metadataUri: offerData.metadataUri
          });
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
