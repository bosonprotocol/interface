import { Row } from "lib/styles/layout";
import styled from "styled-components";

type Props = {
  id: string;
  offerImg: string;
  title: string;
  sellerImg: string;
  sellerName: string;
  priceInEth: string;
};

const Card = styled.div`
  background: #fff;
  border-radius: 2px;
  display: inline-block;
  height: 300px;
  margin: 1rem;
  position: relative;
  width: 300px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
`;

export default function Offer({
  offerImg,
  title,
  sellerImg,
  sellerName,
  priceInEth
}: Props) {
  return (
    <Card>
      <img src={offerImg} />
      <Row>
        <img src={sellerImg} />
        <div>
          <div>{title}</div>
          <div>{sellerName}</div>
        </div>
        <button>Commit</button>
      </Row>
      <hr />
      Price {priceInEth} ETH
    </Card>
  );
}
