import {
  MessageData,
  MessageType,
  ProposalContent
} from "@bosonprotocol/chat-sdk/dist/cjs/util/definitions";

import { DeepReadonly } from "../../types/helpers";
// TODO: use yup
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const validateMessage = (
  message: DeepReadonly<MessageData>
): boolean => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const messageContent = message.data.content;
    const messageContentType = message.data.contentType;
    // const isRegularMessage =
    //   typeof message.data.content.value === "string" &&
    //   messageContentType === MessageType.String;
    // const isFileMessage = messageContentType === MessageType.File;
    const isProposalMessage = messageContentType === MessageType.Proposal;
    if (isProposalMessage) {
      const proposalContent = message.data
        .content as unknown as ProposalContent;
      const isInteger = proposalContent.value.proposals.every((proposal) => {
        const isInteger =
          isNumeric(proposal.percentageAmount) &&
          Number.isInteger(Number(proposal.percentageAmount));
        return isInteger;
      });
      if (!isInteger) {
        return false;
      }
    }
  } catch (error) {
    console.error(error);
    return false;
  }

  return true; // TODO: implement
};

function isNumeric(n: string) {
  return !isNaN(parseFloat(n)) && isFinite(n as unknown as number);
}
