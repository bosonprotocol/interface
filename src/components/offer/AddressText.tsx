import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import { formatAddress } from "../../lib/utils/address";

const Name = styled.span`
  font-size: 14px;
  font-weight: 600;
  margin-left: 8px;
  color: ${colors.darkGreen};
  overflow-wrap: break-word;
  width: 80%;
  font-family: "Roboto Mono", monospace;
`;

interface Props {
  address: string;
}

export default function AddressText({ address }: Props) {
  return <Name data-testid="address">{formatAddress(address)}</Name>;
}
