import {
  MessageData,
  ProposalContent,
  ThreadObject
} from "@bosonprotocol/chat-sdk";

import type SellerID from "../../components/ui/SellerID";
import { Exchange } from "../../lib/utils/hooks/useExchanges";

export type Thread = ThreadObject & {
  exchange:
    | (Exchange & {
        offer: Exchange["offer"] & { metadata: { imageUrl: string } };
      })
    | undefined;
};

export interface ThreadObjectWithInfo extends ThreadObject {
  messages: MessageDataWithInfo[];
}

export interface MessageDataWithInfo extends MessageData {
  isValid: boolean;
  uuid?: string;
  isPending?: boolean;
}

export type NewProposal = ProposalContent["value"];

export type ProposalItem = ProposalContent["value"]["proposals"][number];

export type BuyerOrSeller = Parameters<typeof SellerID>[0]["accountToShow"];
