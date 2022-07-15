import { AiOutlineShoppingCart } from "react-icons/ai";
import { BiDollarCircle, BiPackage } from "react-icons/bi";

import { breakpointNumbers } from "../../lib/styles/breakpoint";

export const COMMIT_STEPS = [
  {
    icon: AiOutlineShoppingCart,
    header: "Commit",
    description:
      "Commit to an Offer to receive a Redeemable NFT (rNFT) that can be exchanged for the real-world item it represents"
  },
  {
    icon: BiDollarCircle,
    header: "Hold, Trade or Transfer ",
    description:
      "You can  hold, transfer or easily trade your rNFT on the secondary market"
  },
  {
    icon: BiPackage,
    header: "Redeem",
    description:
      "Redeem your rNFT to receive the underlying item. The rNFT will be destroyed in the process."
  }
];

export const SLIDER_OPTIONS = {
  type: "carousel" as const,
  startAt: 0,
  gap: 20,
  perView: 3,
  breakpoints: {
    [breakpointNumbers.l]: {
      perView: 3
    },
    [breakpointNumbers.m]: {
      perView: 2
    },
    [breakpointNumbers.xs]: {
      perView: 1
    }
  }
};

export const HEADER = ["Event", "From", "To", "Price", "Date"];
export const EVENT_TYPES = [
  "Commit",
  "Redeem",
  "Cancel",
  "Revoke",
  "Finalize"
] as const;
