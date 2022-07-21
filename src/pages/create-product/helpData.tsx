import styled from "styled-components";

import Typography from "../../components/ui/Typography";

const HrefButton = styled.a`
  font-weight: bold;
  text-decoration: underline;
`;

export const createYourProfileHelp = [
  {
    title: "What to think about when describing yourself/your brand?",
    description: (
      <>
        <Typography tag="p" style={{ margin: "0 0 10px 0" }}>
          Highly Unique items often have an interesting story behind them and
          buyers like to know about the creator.
        </Typography>
        <Typography tag="p" style={{ margin: "0 0 10px 0" }}>
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
      "Your description and external URLs are shown on the product details page for any offer you create. Your email is visible on your profile and offers you create, buyers will contact you via this e-mail to ask questions and resolve problems."
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
        <Typography tag="p">
          You can edit your seller profile at any time by clicking{" "}
          <HrefButton
            onClick={() => {
              // TODO: NEED TO BE IMPLEMENTED
              console.log("Not implemented yet");
            }}
          >
            here
          </HrefButton>{" "}
          or on the seller icon.
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
