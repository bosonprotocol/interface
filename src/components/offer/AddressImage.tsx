import jazzicon from "@metamask/jazzicon";
import styled from "styled-components";

const ProfileImgContainer = styled.div`
  border-radius: 50%;
  width: 35px;
  height: 35px;
`;

function jsNumberForAddress(address: string): number {
  const slicedAddress = address.slice(2, 10);
  return parseInt(slicedAddress, 16);
}

interface Props {
  address: string;
}

export default function AddressImage({ address }: Props) {
  return (
    <ProfileImgContainer
      data-testid="profileImg"
      dangerouslySetInnerHTML={{
        __html: jazzicon(30, jsNumberForAddress(address)).outerHTML
      }}
    />
  );
}
