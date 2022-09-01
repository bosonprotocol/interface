import { CoreSDK } from "@bosonprotocol/react-kit";
import { utils } from "ethers";

import {
  MAX_PERCENTAGE_DECIMALS,
  PERCENTAGE_FACTOR
} from "../../../components/modal/components/Chat/const";
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
    proposals:
      proposalFields.proposalTypeName && proposalFields.refundPercentage
        ? [
            {
              // the percentageAmount must be an integer so it goes from 1 - 10000 (0.01% - 100%)
              type: proposalFields.proposalTypeName,
              percentageAmount: (
                proposalFields.refundPercentage * PERCENTAGE_FACTOR
              ).toFixed(MAX_PERCENTAGE_DECIMALS),
              signature: ""
            }
          ]
        : [],
    disputeContext: proposalFields.disputeContext
  };
  if (proposal.proposals.length) {
    const signature = await coreSDK.signDisputeResolutionProposal({
      exchangeId,
      buyerPercent: proposal.proposals[0].percentageAmount
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
