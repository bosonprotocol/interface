import styled from "styled-components";

import Offer from "../offer/Offer";

const images = [
  "https://bsn-portal-production-image-upload-storage.s3.amazonaws.com/357434e4-b971-4ddd-a1b0-67b976b43305",
  "https://bsn-portal-production-image-upload-storage.s3.amazonaws.com/58e70a76-f020-4bb6-a8ba-8966530de6de",
  "https://bsn-portal-production-image-upload-storage.s3.amazonaws.com/anrealage_2030moonjacket_image_2.png",
  "https://bsn-portal-production-image-upload-storage.s3.amazonaws.com/51d32e56-9476-4ac6-b85f-bc22177bc883"
];

const Root = styled.div`
  display: flex;
  flex-direction: column;
`;

const Heading = styled.h2`
  font-size: 28px;
`;

const OfferContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

// TODO: get this data from somewhere else
const offersDataList = Array(4)
  .fill(0)
  .map((_v, idx) => ({
    id: `${idx}`,
    offerImg: images[idx] || images[idx * 2] || images[0],
    title: `Hermès Birkin ${idx}`,
    sellerImg: "https://picsum.photos/20",
    sellerName: `seller name ${idx}`,
    priceInEth: Math.random() * 10
  }));

export default function OfferList() {
  return (
    <Root>
      <Heading>Featured Offers</Heading>
      <OfferContainer>
        {offersDataList.map((offerData) => (
          <Offer
            key={offerData.id}
            id={offerData.id}
            offerImg={offerData.offerImg}
            title={offerData.title}
            sellerImg={offerData.sellerImg}
            sellerName={offerData.sellerName}
            priceInEth={offerData.priceInEth}
          />
        ))}
      </OfferContainer>
    </Root>
  );
}
