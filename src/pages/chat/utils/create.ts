import { CoreSDK } from "@bosonprotocol/react-kit";
import { utils } from "ethers";

import { PERCENTAGE_FACTOR } from "../../../components/modal/components/Chat/const";
import {
  FileWithEncodedData,
  getFilesWithEncodedData
} from "../../../lib/utils/files";
import { NewProposal } from "../types";

export const createProposal = async ({
  isSeller,
  sellerOrBuyerId,
  proposalFields,
  exchangeId,
  coreSDK
}: {
  isSeller: boolean;
  sellerOrBuyerId: string;
  proposalFields: {
    description: string;
    upload: File[];
    proposalTypeName: string;
    refundPercentage: number;
    disputeContext: string[];
  };
  exchangeId: string;
  coreSDK: CoreSDK;
}): Promise<{
  proposal: NewProposal;
  filesWithData: FileWithEncodedData[];
}> => {
  const userName = isSeller
    ? `Seller ID: ${sellerOrBuyerId}`
    : `Buyer ID: ${sellerOrBuyerId}`; // TODO: change to get real username
  const proposal: NewProposal = {
    title: `${userName} made a proposal`,
    description: proposalFields.description,
    proposals: [
      {
        // the percentageAmount must be an integer so it goes from 1 - 100000 (0.001% - 100%)
        type: proposalFields.proposalTypeName,
        percentageAmount:
          proposalFields.refundPercentage * PERCENTAGE_FACTOR + "",
        signature: ""
      }
    ],
    disputeContext: proposalFields.disputeContext
  };
  const signature = await coreSDK.signDisputeResolutionProposal({
    exchangeId,
    buyerPercent: proposal.proposals[0].percentageAmount
  });
  proposal.proposals[0].signature = utils.joinSignature(signature);
  const proposalFiles = proposalFields.upload;
  const filesWithData = await getFilesWithEncodedData(proposalFiles);
  return {
    proposal,
    filesWithData
  };
};
