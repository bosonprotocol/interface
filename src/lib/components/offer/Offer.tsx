import styled from "styled-components";

const Card = styled.div`
  background: #fff;
  color: black;
  border-radius: 12px;
  height: 250px;
  display: inline-block;
  padding: 10px;
  margin: 1rem;
  position: relative;
  width: 250px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
`;

const ProfileImg = styled.img`
  border-radius: 50%;
  width: 20px;
  height: 20px;
  padding: 5px;
`;

const ImgContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const BasicInfoContainer = styled.div`
  display: flex;
  margin-top: 10px;
`;

const SellerInfo = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
`;

const CommitBtnContainer = styled.div`
  display: flex;
  justify-content: right;
`;

interface Props {
  id: string;
  offerImg: string;
  title: string;
  sellerImg: string;
  sellerName: string;
  priceInEth: string;
}

export default function Offer({
  offerImg,
  title,
  sellerImg,
  sellerName,
  priceInEth
}: Props) {
  return (
    <Card>
      <ImgContainer>
        <img src={offerImg} />
      </ImgContainer>
      <BasicInfoContainer>
        <SellerInfo>
          <ProfileImg src={sellerImg} />
          <div>
            <div>{title}</div>
            <div>{sellerName}</div>
          </div>
        </SellerInfo>
        <CommitBtnContainer>
          <button>Commit</button>
        </CommitBtnContainer>
      </BasicInfoContainer>
      <hr />
      Price {priceInEth} ETH
    </Card>
  );
}
