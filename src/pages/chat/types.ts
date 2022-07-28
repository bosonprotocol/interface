import { Exchange } from "../../lib/utils/hooks/useExchanges";

export type Thread = {
  threadId: Message["content"]["threadId"];
  messages: Message[];
  exchange:
    | (Exchange & {
        offer: Exchange["offer"] & { metadata: { imageUrl: string } };
      })
    | undefined;
};

export type Message = {
  id: string;
  from: string;
  sentDate: Date;
  content: RegularMessage | ImageWithMetadata | ProposalMessage;
};

export type RegularMessage = {
  threadId: {
    exchangeId: string;
    sellerId: string;
    buyerId: string;
  };
  contentType: "string";
  version: "1";
  value: string;
};

export type ImageWithMetadata = {
  threadId: {
    exchangeId: string;
    sellerId: string;
    buyerId: string;
  };
  contentType: "image";
  version: "1";
  value: {
    name: string;
    size: number;
    encodedContent: string;
    type: "image/png" | "image/jpg" | "image/gif";
  };
};

export type ProposalMessage = {
  threadId: {
    exchangeId: string;
    sellerId: string;
    buyerId: string;
  };
  contentType: "proposal";
  version: "1";
  value: {
    title: string; // 'ID: x made a proposal' for now
    description: string;
    proposals: Proposal[];
    disputeContext: string[];
  };
};

export type NewProposal = ProposalMessage["value"];

export type Proposal = {
  type: string;
  percentageAmount: string;
  signature: string;
};
