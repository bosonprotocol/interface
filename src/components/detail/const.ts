import { CurrencyCircleDollar, Package, ShoppingCart } from "phosphor-react";

import { breakpointNumbers } from "../../lib/styles/breakpoint";

export const COMMIT_STEPS = [
  {
    icon: ShoppingCart,
    header: "Commit",
    description:
      "Commit to an Offer to receive a Redeemable NFT (rNFT) that can be exchanged for the real-world item it represents"
  },
  {
    icon: CurrencyCircleDollar,
    header: "Hold, Trade or Transfer ",
    description:
      "You can  hold, transfer or easily trade your rNFT on the secondary market"
  },
  {
    icon: Package,
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
