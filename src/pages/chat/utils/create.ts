import { PERCENTAGE_FACTOR } from "../../../components/modal/components/Chat/const";
import {
  FileWithEncodedData,
  getFilesWithEncodedData
} from "../../../lib/utils/files";
import { NewProposal } from "../types";

export const createProposal = async ({
  isSeller,
  sellerOrBuyerId,
  proposalFields
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
        signature: "0x" // TODO: sign proposals
      }
    ],
    disputeContext: proposalFields.disputeContext
  };
  // TODO: sign proposals
  const proposalFiles = proposalFields.upload;
  const filesWithData = await getFilesWithEncodedData(proposalFiles);
  return {
    proposal,
    filesWithData
  };
};
