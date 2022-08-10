import {
  ProposalContent,
  ThreadObject
} from "@bosonprotocol/chat-sdk/dist/cjs/util/definitions";

import { Exchange } from "../../lib/utils/hooks/useExchanges";

export type Thread = ThreadObject & {
  exchange:
    | (Exchange & {
        offer: Exchange["offer"] & { metadata: { imageUrl: string } };
      })
    | undefined;
};

export type NewProposal = ProposalContent["value"];

export type ProposalItem = ProposalContent["value"]["proposals"][number];

// export type Message = {
//   authorityId: string;
//   sender: string;
//   recipient: string;
//   timestamp: number;
//   data
//   content: RegularMessage | ImageWithMetadata | ProposalMessage;
// };

// export type RegularMessage = {
//   threadId: {
//     exchangeId: string;
//     sellerId: string;
//     buyerId: string;
//   };
//   contentType: "string";
//   version: "1";
//   value: string;
// };

// export type ImageWithMetadata = {
//   threadId: {
//     exchangeId: string;
//     sellerId: string;
//     buyerId: string;
//   };
//   contentType: "image";
//   version: "1";
//   value: {
//     name: string;
//     size: number;
//     encodedContent: string;
//     type: "image/png" | "image/jpg" | "image/gif";
//   };
// };

// export type ProposalMessage = {
//   threadId: {
//     exchangeId: string;
//     sellerId: string;
//     buyerId: string;
//   };
//   contentType: "proposal";
//   version: "1";
//   value: {
//     title: string; // 'ID: x made a proposal' for now
//     description: string;
//     proposals: Proposal[];
//     disputeContext: string[];
//   };
// };

// export type NewProposal = ProposalMessage["value"];

// export type Proposal = {
//   type: string;
//   percentageAmount: string;
//   signature: string;
// };
