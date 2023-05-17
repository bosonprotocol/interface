import styled from "styled-components";

import Typography from "../../ui/Typography";

const ClickHereButton = styled.span`
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
`;

export const createYourProfileHelp = [
  {
    title: "What to think about when describing yourself/your brand?",
    description: (
      <>
        <Typography tag="p" margin="0 0 0.625rem 0">
          Highly Unique items often have an interesting story behind them and
          buyers like to know about the creator.
        </Typography>
        <Typography tag="p" margin="0 0 0.625rem 0">
          Tell them about the types of items you sell and what your brand is all
          about.
        </Typography>
        <Typography tag="p">
          If you want to leave this section blank that's totally fine too.
        </Typography>
      </>
    )
  } as const,
  {
    title: "Where will this information be displayed?",
    description:
      "Your description and external URLs are shown on the product details page for any offer you create. Your email is visible on your profile and offers you create, buyers will contact you via this email to ask questions and resolve problems."
  } as const,
  {
    title: "What if I don't have a Website/Twitter/Instagram?",
    description:
      "This is not an essential step but helps buyers understand your brand."
  } as const,
  {
    title: "How can I change this information once submitted?",
    description: (
      <>
        <Typography
          tag="p"
          style={{
            display: "block"
          }}
        >
          {/* TODO: ADD CLICKING HERE BUTTON LOGIC */}
          You can edit your seller profile at any time by clicking{" "}
          <ClickHereButton>here</ClickHereButton> or on the seller icon.
        </Typography>
      </>
    )
  } as const,
  {
    title: "Why do you need my email? Web3 is about decentralization.",
    description: (
      <>
        <Typography tag="p" style={{ margin: "0 0 10px 0" }}>
          Your email is used to coordinate dispatch and delivery with your
          buyers. It's also the first point of dispute management.
        </Typography>
        <Typography tag="p">
          Feel free to create an entirely new email just for selling.
        </Typography>
      </>
    )
  }
];

export const productTypeHelp = [
  {
    title: "What is phygital?",
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
      "This new asset form bridges the physical and digital world, allowing your products to hit new levels of utility and reach an evergrowing new audience."
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
    title: "What is a Token gated Offer?",
    description:
      "Make your offer exclusive by limiting the ability to purchase your item to users holding a specific token."
  } as const,
  {
    title: "What is a Dispute Resolver?",
    description: (
      <>
        <Typography tag="p" style={{ margin: "0" }}>
          If a buyer raises and escalates a dispute, the dispute resolver step
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
    title: "What is an Exchange Policy?",
    description: (
      <>
        <Typography tag="p" style={{ margin: "0 0 10px 0" }}>
          The exchange policy covers contractual and protocol terms of the
          exchange to protect buyer and seller.
        </Typography>
        <Typography tag="p" style={{ margin: "0 0 10px 0" }}>
          This includes obligations of both parties to follow thru with their
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
    title: "How long should the Redemption period be?",
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
    title: "What Happens when the Offer Ends?",
    description:
      "When your offer period expires, buyers are no longer able to make a commitment."
  } as const,
  {
    title: "What is buyer cancel penalty?",
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
