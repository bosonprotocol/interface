import { generatePath } from "react-router-dom";
import styled from "styled-components";

import { UrlParameters } from "../../../lib/routing/parameters";
import { BosonRoutes } from "../../../lib/routing/routes";
import { colors } from "../../../lib/styles/colors";
import { useKeepQueryParamsNavigate } from "../../../lib/utils/hooks/useKeepQueryParamsNavigate";

const ViewExchangeButton = styled.button.attrs({ type: "button" })`
  background-color: ${colors.green}; //var(--secondary);
  color: var(--accentDark);
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

  :disabled {
    cursor: not-allowed;
    background-color: ${colors.grey};
  }
`;

interface Props {
  exchangeId: string;
}

export default function CreatedExchange({ exchangeId }: Props) {
  const navigate = useKeepQueryParamsNavigate();
  // title={<Title> {exchangeId ? "Commit Successful" : "Error"}</Title>}
  // <Body>
  //   {exchangeId
  //     ? "A new exchange has been created"
  //     : "Something has gone wrong"}
  // </Body>
  return (
    <ViewExchangeButton
      disabled={!exchangeId}
      onClick={() =>
        navigate({
          pathname: generatePath(BosonRoutes.Exchange, {
            [UrlParameters.exchangeId]: exchangeId
          })
        })
      }
    >
      View exchange
    </ViewExchangeButton>
  );
}
