import { Typography } from "../../ui/Typography";

export const productTypeHelp = [
  {
    title: "What is a phygital?",
    description:
      "A Phygital item is one that exists both digitally (in the form of an NFT) and also in a physical form. The digital item must be a visual representation of the physical."
  },
  {
    title: "Why would I sell a phygital item?",
    description:
      "Phygital items bridge the physical and digital world, allowing your products to hit new levels of utility and reach an ever-growing new audience."
  },
  {
    title: "What are variants?",
    description:
      "Variants are alternate forms of the same product, for example, color and size. Choosing the 'Different variants' option on the left allows you to leverage all of the same product data for the different variants, instead of manually creating a new product offer for each variant."
  },
  {
    title: "What is a token gated offer?",
    description:
      "A token gated offer allows you to make the product exclusive by limiting the ability to purchase it only to users holding a specific token."
  }
] as const;
export const productDigitalHelp = productTypeHelp;
export const productInformationHelp = [
  {
    title: "How do I describe my item?",
    description: (
      <>
        <Typography tag="p" style={{ margin: "0" }}>
          We recommend beginning with a short overview that describes your
          product's unique features. Buyers also often like to hear about the
          story behind the product, how it was made, and the creative
          inspiration behind it.
        </Typography>
        <Typography tag="p" style={{ margin: "0" }}>
          It is also beneficial to include other operational details like
          whether duties and taxes are included in price.
        </Typography>
      </>
    )
  },
  {
    title: "What if my item isn't part of the categories listed?",
    description: (
      <p style={{ margin: "0" }}>
        If your product category is not listed, you can choose the 'other'
        category field, or send us an email at{" "}
        <a href="mailto:info@bosonapp.io" target="_blank">
          info@bosonapp.io
        </a>{" "}
        to get it included in the category list.
      </p>
    )
  },
  {
    title: "What are search tags used for?",
    description:
      "Search tags are used to help you differentiate your own products or to increase your item's visibility when a buyer is looking for similar items. Search tags are free form and can include things like shape, style, function, season, etc."
  },
  {
    title: "What are attributes used for?",
    description:
      "Attributes help buyers understand specific properties of your item. For example, material, colour, size, components, etc."
  }
];
export const productVariantsHelp = [...productTypeHelp];
export const productImagesHelp = [
  {
    title: "How many images do I need?",
    description:
      "While at least one thumbnail image is required, we recommend adding as many images as you can to show your item's most interesting characteristics."
  },
  {
    title: "Can I add images to my variations?",
    description:
      "Yes, you can add images to your variations so buyers can see all their options."
  },
  {
    title: "Do you have any tips for the images I include?",
    description:
      "In general, we recommend using natural light, without a flash, and against a clean or simple background. For some products it is beneficial to include a common object for scale, or for the item to be held, worn, or used. Adding images for all your variations help buyers see all their options."
  }
];
export const coreTermsOfSaleHelp = [
  {
    title:
      "What should I take into consideration when setting the price of my item?",
    description:
      "Typically, the costs of materials, labour, and other business expenses are factored into the price. If you offer free delivery and/or duties & taxes paid, make sure to include those costs so it doesn't eat into your margins."
  } as const,
  {
    title: "How do I set the validity period for my offers?",
    description:
      "All offers must specify a start date, or the date from when buyers can commit to your offer. You can choose to either set a specific end date, or default to no specific end date."
  } as const,
  {
    title:
      "If I set my offers without a specific end date now, can I change it in the future so that buyers will no longer be able to commit to it?",
    description:
      "Yes. You can 'Void' an offer in the Seller Hub so that buyers will no longer be able to commit to the offer."
  } as const,
  {
    title: "Should I set my offers with or without an expiration date?",
    description:
      "If you have an offer that you want to make available only for a limited time, or that you want to make exclusive for a specific season or event, setting an offer with an expiration date is likely the better choice. For offers that are more readily available or less seasonal, setting them up without an expiration date is a better option."
  } as const,
  {
    title: "What happens when the offer validity period ends?",
    description:
      "When your offer validity period ends, buyers will no longer be able to commit to the offer."
  } as const,
  {
    title: "How long should the redemption period be?",
    description: (
      <>
        <Typography tag="p" style={{ margin: "0" }}>
          During the redemption period, buyers can trade, transfer, or gift the
          rNFT. Hence, the longer the redemption period, the more buyers can
          benefit from the transferable nature of these rNFTs. You, as a seller,
          also benefit via royalties from these secondary sales.
        </Typography>
        <Typography tag="p" style={{ margin: "0" }}>
          A buyer can also redeem the rNFT for the physical item anytime during
          this period, so consider how long you feel comfortable storing this
          physical item and factor this into the redemption period.
        </Typography>
      </>
    )
  } as const,
  {
    title:
      "For offers without an expiration date, what is the redemption start date considered when it has not been specified?",
    description:
      "If a redemption start date has not been specified, the buyer will be able to redeem the rNFT as soon as they have committed to the offer."
  } as const,
  {
    title:
      "For offers without an expiration date, what is the redemption duration period?",
    description:
      "The redemption duration period is the number of days a buyer has to redeem the rNFT for the physical item. It is calculated from the later of either the date the buyer commits to the offer or from the redemption start date (if it was specified)."
  } as const
];
export const tokenGatingHelp = [
  {
    title: "Which token types can I use to create a token gated offer?",
    description:
      "You can create a token gated offer using an ERC20, ERC721, or an ERC1155 token."
  },
  {
    title: "Which networks does token gating work with?",
    description:
      "Token gating currently works on Polygon but will soon work on other EVM chains."
  },
  {
    title: "What configuration can you give for each token type?",
    description: (
      <ul>
        <li>ERC20 (fungible tokens)</li>
        <ul>
          <li>
            One can set a minimum threshold that a token holder needs to hold,
            this should be greater than or equal to 1
          </li>
          <li>
            One can set a number of times that a given token holder can unlock
            the gate
          </li>
        </ul>
        <li>ERC721</li>
        <ul>
          <li>
            One can select whether or not they want to target a specific token
            from a collection or any token from a collection
          </li>
          <li>
            One can set a number of times that a given token holder can unlock
            the gate
          </li>
        </ul>
        <li>ERC1155</li>
        <ul>
          <li>One can select a given token from an 1155 collection</li>
          <li>
            One can set a minimum threshold that a token holder needs to hold,
            this should be greater than or equal to 1
          </li>
          <li>
            One can set a number of times that a given token holder can unlock
            the gate
          </li>
        </ul>
      </ul>
    )
  }
];
export const termsOfExchangeHelp = [
  {
    title: "What is an exchange policy?",
    description:
      "The exchange policy helps sellers configure their offers in a way that enables fair exchange. It covers the contractual terms of the exchange, both on-chain and off-chain, defined to protect both the buyer and seller. It includes the obligations of both parties to follow through with their commitment, as well as the evidence requirements in the event of a dispute."
  },
  {
    title: "What is a dispute resolver?",
    description:
      "If a buyer raises and escalates a dispute, the dispute resolver steps in to resolve the dispute. Once a dispute is escalated, both buyer and seller will be asked to submit evidence based on the nature of the dispute."
  },
  {
    title: "Do I have to set a seller deposit?",
    description:
      "No, seller deposits are optional. You can set the seller deposit to '0' if you do not want to set a deposit."
  },
  {
    title: "What is the buyer cancellation penalty?",
    description:
      "The buyer cancellation penalty is set solely at the discretion of the seller. If the buyer fails to redeem the item, or cancels the exchange, within the redemption period, they will receive back the payment minus the cancellation penalty. This penalty is used to cover the inconvenience caused to the seller."
  },
  {
    title: "How long should the dispute period be?",
    description:
      "The dispute period should be a minimum of 30 days, post redemption, to meet our fair exchange guidelines."
  }
];
export const shippingInfoHelp = [
  {
    title: "If I ship internationally, who will pay for the duties and taxes?",
    description:
      "It is up to you, as the seller, to decide who pays for the duties and taxes. We recommend clarifying this to buyers in the product description."
  },
  {
    title: "How long should the return period be?",
    description:
      "The return period should be a minimum of 15 days to meet our fair exchange guidelines."
  }
];
