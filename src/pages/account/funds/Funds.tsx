import styled from "styled-components";

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
  const funds = useFunds();

  return (
    <Root>
      <h1>Funds</h1>
      <div>
        {funds.map((fund) => {
          return (
            <div>
              <p>{fund.token.name}</p>
              <p>{fund.availableAmount}</p>
            </div>
          );
        })}
      </div>
    </Root>
  );
}
