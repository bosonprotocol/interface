import {
  MessageData,
  ProposalContent,
  ThreadObject
} from "@bosonprotocol/chat-sdk/dist/cjs/util/v0.0.1/definitions";

import type SellerID from "../../components/ui/SellerID";
import { Exchange } from "../../lib/utils/hooks/useExchanges";

export type Thread = ThreadObject & {
  exchange:
    | (Exchange & {
        offer: Exchange["offer"] & { metadata: { imageUrl: string } };
      })
    | undefined;
};

export interface ThreadObjectWithIsValid extends ThreadObject {
  messages: MessageDataWithIsValid[];
}

export interface MessageDataWithIsValid extends MessageData {
  isValid: boolean;
}

export type NewProposal = ProposalContent["value"];

export type ProposalItem = ProposalContent["value"]["proposals"][number];

export type BuyerOrSeller = Parameters<typeof SellerID>[0]["buyerOrSeller"];
