import { hooks } from "@bosonprotocol/react-kit";
import { CONFIG } from "lib/config";
import { Offer } from "lib/types/offer";
export const useHandleText = (offer: Offer) =>
  hooks.useHandleText(offer, CONFIG.dateFormat);
