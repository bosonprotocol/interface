import styled from "styled-components";

import { useSellerToggle } from "../private/Toogle/SellerToggleContext";
import FundItem from "./FundItem";
import useFunds from "./useFunds";

const Root = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

interface Props {
  sellerId: string;
  buyerId: string;
}

export default function Funds({ sellerId, buyerId }: Props) {
  const { isTabSellerSelected } = useSellerToggle();
  const accountId = isTabSellerSelected ? sellerId : buyerId;
  const funds = useFunds(accountId);

  return (
    <Root>
      <h1>Funds</h1>
      <div>
        {funds.length > 0 ? (
          funds.map((fund) => <FundItem accountId={accountId} fund={fund} />)
        ) : (
          <p>No funds for connected wallet.</p>
        )}
      </div>
    </Root>
  );
}
