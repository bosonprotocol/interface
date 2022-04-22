import jazzicon from "@metamask/jazzicon";
import styled from "styled-components";

const ProfileImgContainer = styled.div`
  border-radius: 50%;
  width: 35px;
  height: 35px;
`;
function jsNumberForAddress(address: string): number {
  const addr = address.slice(2, 10);
  const seed = parseInt(addr, 16);

  return seed;
}
export const AddressImg = ({ address }: { address: string }) => (
  <ProfileImgContainer
    data-testid="profileImg"
    dangerouslySetInnerHTML={{
      __html: jazzicon(30, jsNumberForAddress(address)).outerHTML
    }}
  />
);
