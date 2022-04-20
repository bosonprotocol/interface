import styled from "styled-components";

import { colours } from "../../lib/colours";

const Card = styled.div`
  border-radius: 12px;
  display: inline-block;
  position: relative;
  width: 250px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0 16px;
`;

const ProfileImg = styled.img`
  border-radius: 50%;
  width: 35px;
  height: 35px;
`;

const ImgContainer = styled.div`
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
  color: ${colours.darkGreen};
  overflow-wrap: break-word;
  width: 80%;
  font-family: "Roboto Mono", monospace;
`;

const Title = styled.span`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const Price = styled.span`
  font-size: 16px;
  font-weight: 600;
`;

const CommitBtnContainer = styled.div`
  display: flex;
`;

const Commit = styled.button`
  all: unset;
  font-weight: 600;
  font-size: 15px;
  color: ${colours.green};
  border-radius: 11px;
  display: inline-block;
  text-align: center;
  transition: all 0.5s;
  cursor: pointer;
  border: 1px solid ${colours.green};
  padding: 6px 12px;
  margin-top: 8px;
`;

const Sold = styled.p`
  all: unset;
  color: ${colours.grey};
  font-size: 16px;
  font-weight: 600;
`;

interface Props {
  id: string;
  offerImg: string;
  title: string;
  sellerImg: string;
  sellerName: string;
  priceInEth: string;
  priceSymbol: string;
  isSold: boolean;
}

export default function Offer({
  offerImg,
  title,
  sellerImg,
  sellerName,
  priceInEth,
  isSold
}: Props) {
  return (
    <Card data-testid="offer">
      <SellerInfo>
        <ProfileImg data-testid="profileImg" src={sellerImg} />
        <SellerName data-testid="sellerName">{sellerName}</SellerName>
      </SellerInfo>
      <ImgContainer>
        <Image data-testid="image" src={offerImg} />
      </ImgContainer>
      <BasicInfoContainer>
        <Title data-testid="title">{title || "Untitled"}</Title>
        <Price data-testid="price">{parseFloat(priceInEth)} ETH</Price>
        <CommitBtnContainer>
          {isSold ? (
            <Sold>Sold</Sold>
          ) : (
            <Commit data-testid="commit">Commit now</Commit>
          )}
        </CommitBtnContainer>
      </BasicInfoContainer>
    </Card>
  );
}
