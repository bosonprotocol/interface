import Typography from "../../ui/Typography";

export const productTypeHelp = [
  {
    title: "What is a phygital?",
    description:
      "A Phygital item is one that exists both digitally (in the form of an NFT) and also in a physical form. The digital item must be a visual representation of the physical."
  } as const,
  {
    title: "What are variants?",
    description: (
      <>
        <Typography tag="p" style={{ margin: "0" }}>
          Variants are alternate forms of the same product. Examples might
          include colour and size.
        </Typography>
        <Typography tag="p">
          You can use the variants tool instead of manually creating a new
          product offer each time.
        </Typography>
      </>
    )
  } as const,
  {
    title: "What are tags used for?",
    description: (
      <>
        <Typography tag="p" style={{ margin: "0" }}>
          Search tags are used to help buyers quickly identify more specific
          properties of your item.
        </Typography>
        <Typography tag="p" style={{ margin: "0" }}>
          You can use them to differentiate your own products or to increase
          your items visibility when buyer is looking for similar items.
        </Typography>
      </>
    )
  } as const,
  {
    title: "What are attributes used for?",
    description:
      "Attributes help buyers to understand your products. Here you can add specific details for example material, colour, size"
  } as const,
  {
    title: "How to describe my item?",
    description:
      "Explain to buyers exactly what your item is. Tell them about its unique features, or why you are selling it. The goal is to tell them why they should buy it."
  } as const,
  {
    title: "What if my item isn't part of the categories listed?",
    description: `Categories help sharpen search results. its best to select a category that is very similar to your item. If It is truly unique you can create your own category by filling in the "other" category field`
  } as const,
  {
    title: "Why would I sell a phygital item?",
    description:
      "This new asset form bridges the physical and digital world, allowing your products to hit new levels of utility and reach an ever-growing new audience."
  } as const,
  {
    title: "How many images do I need?",
    description: (
      <>
        <Typography tag="p" style={{ margin: "0 0 20px 0" }}>
          Pictures bring your item to life and improve buyer confidence.
        </Typography>
        <Typography tag="p" style={{ margin: "0" }}>
          Don’t forget to include different angles, e.g. top, bottom, front and
          back as well as any that highlight special features. To reorder, drag
          and drop images on the grid.
        </Typography>
      </>
    )
  } as const
];

export const productInformationHelp = [...productTypeHelp];
export const productVariantsHelp = [...productTypeHelp];
export const productImagesHelp = [...productTypeHelp];
export const coreTermsOfSaleHelp = [
  {
    title: "What is a token gated offer?",
    description:
      "Make your offer exclusive by limiting the ability to purchase your item to users holding a specific token."
  } as const,
  {
    title: "What is a dispute resolver?",
    description: (
      <>
        <Typography tag="p" style={{ margin: "0" }}>
          If a buyer raises and escalates a dispute, the dispute resolver steps
          in to resolve the dispute.
        </Typography>
        <Typography tag="p" style={{ margin: "0" }}>
          Both buyer and seller will be asked to submit evidence based on the
          nature of the dispute.
        </Typography>
      </>
    )
  } as const,
  {
    title: "What is an exchange policy?",
    description: (
      <>
        <Typography tag="p" style={{ margin: "0 0 10px 0" }}>
          The exchange policy covers both the contractual and the protocol terms
          of the exchange to protect buyer and seller.
        </Typography>
        <Typography tag="p" style={{ margin: "0 0 10px 0" }}>
          This includes obligations of both parties to follow through with their
          commitment, and evidence requirements in case there is a dispute.
        </Typography>
        <Typography tag="p" style={{ margin: "0" }}>
          The policy also includes fair protocol terms, to make it easy for
          sellers to set-up a fair exchange.
        </Typography>
      </>
    )
  } as const,
  {
    title: "How long should the redemption period be?",
    description: (
      <>
        <Typography tag="p" style={{ margin: "0 0 10px 0" }}>
          In this time people can trade the rNFT, the more time you give, the
          more confident buyers will be in committing as they can benefit from
          the transferable nature of your rNFT.
        </Typography>
        <Typography tag="p" style={{ margin: "0" }}>
          Only make this period as long as you feel comfortable storing the
          physical item for.
        </Typography>
      </>
    )
  } as const,
  {
    title: "What happens when the offer ends?",
    description:
      "When your offer period expires, buyers are no longer able to make a commitment."
  } as const,
  {
    title: "What is the buyer cancel penalty?",
    description:
      "If the buyer fails to redeem the item within the redemption period they will receive back the payment minus the cancellation penalty.This penalty is to cover the inconvenience caused to the seller."
  } as const,
  {
    title: "How long should the dispute period be?",
    description: "The dispute period is a minimum of 30 days post redeem."
  } as const
];
export const termsOfExchangeHelp = [...coreTermsOfSaleHelp];
export const shippingInfoHelp = [...coreTermsOfSaleHelp];
