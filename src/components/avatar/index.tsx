import useENSAvatar from "lib/utils/hooks/useENSAvatar";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import FallbackAvatar from "./fallback-avatar";

const LoadingPlaceholder = styled.div<{ size: number }>`
  height: ${({ size }) => size}px;
  width: ${({ size }) => size}px;
  background-color: ${colors.bosonSkyBlue};
  border-radius: 100%;
`;

const ENSAvatar = styled.img<{ size: number }>`
  height: ${({ size }) => size}px;
  width: ${({ size }) => size}px;
  border-radius: 100%;
`;

interface Props {
  address: string;
  size: number;
}

export default function Avatar({ address, size }: Props) {
  const { avatar, loading } = useENSAvatar(address);

  if (loading) {
    return <LoadingPlaceholder size={size} />;
  }

  if (avatar) {
    return <ENSAvatar size={size} src={avatar} data-testid="env-avatar" />;
  }

  return <FallbackAvatar address={address} size={size} />;
}
