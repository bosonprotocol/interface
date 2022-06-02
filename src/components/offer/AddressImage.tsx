import jazzicon from "@metamask/jazzicon";
import styled from "styled-components";

const ProfileImgContainer = styled.div<{ $height: string }>`
  height: ${(props) => props.$height};
  div {
    border-radius: 50% !important;
  }
`;

function jsNumberForAddress(address: string): number {
  const slicedAddress = address.slice(2, 10);
  return parseInt(slicedAddress, 16);
}

interface Props {
  address: string;
  size: number;
}

export default function AddressImage({ address, size }: Props) {
  return (
    <ProfileImgContainer
      data-testid="profileImg"
      $height={`${size}px`}
      dangerouslySetInnerHTML={{
        __html: jazzicon(size, jsNumberForAddress(address)).outerHTML
      }}
    />
  );
}
