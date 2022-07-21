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
  content: RegularMessage | ImageMessage | ProposalMessage;
};

type RegularMessage = {
  threadId: {
    exchangeId: string;
    sellerId: string;
    buyerId: string;
  };
  contentType: "string";
  version: "1";
  value: string;
};

type ImageMessage = {
  threadId: {
    exchangeId: string;
    sellerId: string;
    buyerId: string;
  };
  contentType: "image";
  version: "1";
  value: string;
};

type ProposalMessage = {
  threadId: {
    exchangeId: string;
    sellerId: string;
    buyerId: string;
  };
  contentType: "proposal";
  version: "1";
  value: {
    title: string;
    description: string;
    proposals: { type: string; percentageAmount: string; signature: string }[];
  };
};
