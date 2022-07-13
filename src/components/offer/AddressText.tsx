import styled from "styled-components";

import { formatAddress } from "../../lib/utils/address";

const Name = styled.div`
  font-size: 14px;
  font-weight: 600;
  overflow-wrap: break-word;
`;

interface Props {
  address: string;
}

export default function AddressText({ address }: Props) {
  return <Name data-testid="address">{formatAddress(address)}</Name>;
}
