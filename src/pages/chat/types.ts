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
  content: {
    threadId: {
      exchangeId: string;
      sellerId: string;
      buyerId: string;
    };
    contentType: "string" | "json" | "image" | "proposal";
    version: "1";
    value: string | Record<string, unknown>;
  };
};
