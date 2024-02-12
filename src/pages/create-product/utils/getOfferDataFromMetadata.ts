import { AnyMetadata, CoreSDK, offers } from "@bosonprotocol/react-kit";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);

import { Token } from "components/convertion-rate/ConvertionRateContext";
import { BigNumber, ethers } from "ethers";

import { DappConfig } from "../../../lib/config";

type GetOfferDataFromMetadataProps = {
  coreSDK: CoreSDK;
  config: DappConfig;
  priceBN: BigNumber;
  sellerDeposit: BigNumber | string;
  buyerCancellationPenaltyValue: BigNumber | string;
  quantityAvailable: number;
  voucherRedeemableFromDateInMS: number;
  voucherRedeemableUntilDateInMS: number;
  voucherValidDurationInMS: number;
  validFromDateInMS: number;
  validUntilDateInMS: number;
  disputePeriodDurationInMS: number;
  resolutionPeriodDurationInMS: number;
  exchangeToken: Token | undefined;
};
export async function getOfferDataFromMetadata(
  metadata: AnyMetadata,
  {
    coreSDK,
    config,
    priceBN,
    sellerDeposit,
    buyerCancellationPenaltyValue,
    quantityAvailable,
    voucherRedeemableFromDateInMS,
    voucherRedeemableUntilDateInMS,
    voucherValidDurationInMS,
    validFromDateInMS,
    validUntilDateInMS,
    disputePeriodDurationInMS,
    resolutionPeriodDurationInMS,
    exchangeToken
  }: GetOfferDataFromMetadataProps
): Promise<offers.CreateOfferArgs> {
  const metadataHash = await coreSDK.storeMetadata(metadata);

  const offerData: offers.CreateOfferArgs = {
    price: priceBN.toString(),
    sellerDeposit: sellerDeposit.toString(),
    buyerCancelPenalty: buyerCancellationPenaltyValue.toString(),
    quantityAvailable: quantityAvailable,
    voucherRedeemableFromDateInMS: voucherRedeemableFromDateInMS.toString(),
    voucherRedeemableUntilDateInMS: voucherRedeemableUntilDateInMS.toString(),
    voucherValidDurationInMS: voucherValidDurationInMS.toString(),
    validFromDateInMS: validFromDateInMS.toString(),
    validUntilDateInMS: validUntilDateInMS.toString(),
    disputePeriodDurationInMS: disputePeriodDurationInMS.toString(),
    resolutionPeriodDurationInMS: resolutionPeriodDurationInMS.toString(),
    exchangeToken: exchangeToken?.address || ethers.constants.AddressZero,
    disputeResolverId: config.envConfig.defaultDisputeResolverId,
    agentId: 0, // no agent
    metadataUri: `ipfs://${metadataHash}`,
    metadataHash: metadataHash,
    collectionIndex: "0"
  };
  return offerData;
}
