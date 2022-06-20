import { useParams } from "react-router-dom";
import styled from "styled-components";

import { UrlParameters } from "../../lib/routing/query-parameters";

const FullIframe = styled.iframe`
  width: 100%;
  height: 100vh;
`;

export default function Chat() {
  const params = useParams();
  const address = params[UrlParameters.address] || "";
  return <FullIframe src={`https://www.daopanel.chat/${address}`} />;
}
