import { CoreSDK } from "@bosonprotocol/react-kit";
import { utils } from "ethers";

import { PERCENTAGE_FACTOR } from "../../../lib/constants/percentages";
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
  const isItProposal = proposalFields?.proposalTypeName !== "";
  const proposal: NewProposal = {
    title: isItProposal
      ? `${userName} made a proposal`
      : `${userName} raised a dispute`,
    description: proposalFields.description,
    proposals:
      proposalFields.proposalTypeName && proposalFields.refundPercentage
        ? [
            {
              // the percentageAmount must be an integer so it goes from 1 - 10000 (0.01% - 100%)
              type: proposalFields.proposalTypeName,
              percentageAmount: (
                proposalFields.refundPercentage * PERCENTAGE_FACTOR
              ).toFixed(0),
              signature: ""
            }
          ]
        : [],
    disputeContext: proposalFields.disputeContext
  };
  if (proposal.proposals.length) {
    const signature = await coreSDK.signDisputeResolutionProposal({
      exchangeId,
      buyerPercentBasisPoints: proposal.proposals[0].percentageAmount
    });
    proposal.proposals[0].signature = utils.joinSignature(signature);
  }
  const proposalFiles = proposalFields.upload;
  const filesWithData = await getFilesWithEncodedData(proposalFiles);
  return {
    proposal,
    filesWithData
  };
};
