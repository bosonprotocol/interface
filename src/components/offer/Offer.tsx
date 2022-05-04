import { colors } from "lib/styles/colors";
import { formatAddress } from "lib/utils/address";
import styled from "styled-components";

import AddressImage from "./AddressImage";

const Card = styled.div`
  border-radius: 12px;
  display: inline-block;
  position: relative;
  width: 250px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0 16px;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 16px 16px;
`;

const Image = styled.img`
  height: 250px;
  width: 250px;
  border-radius: 24px;
`;

const BasicInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 18px 0px;
`;

const SellerInfo = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  margin: 18px 0px;
`;

const SellerName = styled.span`
  font-size: 14px;
  font-weight: 600;
  margin-left: 8px;
  color: ${colors.darkGreen};
  overflow-wrap: break-word;
  width: 80%;
  font-family: "Roboto Mono", monospace;
`;

const Name = styled.span`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const Price = styled.span`
  font-size: 16px;
  font-weight: 600;
`;

const CommitButtonContainer = styled.div`
  display: flex;
`;

const Commit = styled.button`
  all: unset;
  font-weight: 600;
  font-size: 15px;
  color: ${colors.green};
  border-radius: 11px;
  display: inline-block;
  text-align: center;
  transition: all 0.5s;
  cursor: pointer;
  border: 1px solid ${colors.green};
  padding: 6px 12px;
  margin-top: 8px;
`;

const Sold = styled.p`
  all: unset;
  color: ${colors.grey};
  font-size: 16px;
  font-weight: 600;
`;

interface Props {
  id: string;
  offerImg: string;
  name: string;
  sellerAddress: string;
  price: string;
  priceSymbol: string;
  isSold: boolean;
}

export default function Offer({
  offerImg,
  name,
  sellerAddress,
  price,
  priceSymbol,
  isSold
}: Props) {
  return (
    <Card data-testid="offer">
      <SellerInfo>
        <AddressImage address={sellerAddress} />
        <SellerName data-testid="sellerAddress">
          {formatAddress(sellerAddress)}
        </SellerName>
      </SellerInfo>
      <ImageContainer>
        <Image data-testid="image" src={offerImg} />
      </ImageContainer>
      <BasicInfoContainer>
        <Name data-testid="name">{name || "Untitled"}</Name>
        <Price data-testid="price">
          {price} {priceSymbol}
        </Price>
        <CommitButtonContainer>
          {isSold ? (
            <Sold>Sold</Sold>
          ) : (
            <Commit data-testid="commit">Commit</Commit>
          )}
        </CommitButtonContainer>
      </BasicInfoContainer>
    </Card>
  );
}
