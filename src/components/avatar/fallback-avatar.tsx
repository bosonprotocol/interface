import { Image as AccountImage } from "@davatar/react";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";

const AddressImageContainer = styled.div<{ avatarSize: number }>`
  border: ${({ avatarSize }) => avatarSize / 40}px solid ${colors.greyLight};
  border-radius: 50%;
  background-color: ${colors.greyLight};
  margin-bottom: 5px;
  display: flex;
`;

interface Props {
  address: string;
  size: number;
  dataTestId?: string;
}

export default function FallbackAvatar({
  address,
  size,
  dataTestId = "avatar"
}: Props) {
  return (
    <AddressImageContainer avatarSize={size} data-testid={dataTestId}>
      <AccountImage address={address} size={size} />
    </AddressImageContainer>
  );
}
