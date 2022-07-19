import styled from "styled-components";

import Price from "../../../components/price";
import Typography from "../../../components/ui/Typography";
import { Thread } from "../types";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const DaysLeftToDispute = styled.div`
  background: #5560720f;
  padding: 8px 20px 8px 24px;
  font-size: 12px;
  font-weight: 600;
`;

const ExchangeInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  row-gap: 0.875rem;
  border: 2px solid #5560720f;
  padding: 1.5rem 0;

  small {
    font-size: 16px;
    font-weight: 400;
  }
`;

const Name = styled(Typography)`
  all: unset;
  font-size: 24px;
  font-weight: 600;
`;

const DisputeSteps = styled.div`
  border: 2px solid #5560720f;
  border-top: none;

  display: flex;
  justify-content: space-evenly;
`;

interface Props {
  thread: Thread | undefined;
}
export default function Dispute({ thread }: Props) {
  const exchange = thread?.exchange;
  const offer = exchange?.offer;

  if (!exchange || !offer) {
    return null;
  }
  return (
    <Container>
      <img src={exchange.offer.metadata.imageUrl} width="372px" />
      <DaysLeftToDispute>Just a few days left to dispute</DaysLeftToDispute>
      <ExchangeInfo>
        <Name tag="h3">{exchange.offer.metadata.name}</Name>
        <Price
          isExchange={false}
          address={offer.exchangeToken.address}
          currencySymbol={offer.exchangeToken.symbol}
          value={offer.price}
          decimals={offer.exchangeToken.decimals}
          tag="h3"
          convert
        />
      </ExchangeInfo>
      <DisputeSteps>
        <div>Describe Problem</div>
        <div>Raise dispute</div>
        <div>Resolve or Escalate</div>
      </DisputeSteps>
    </Container>
  );
}
