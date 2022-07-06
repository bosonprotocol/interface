import { useState } from "react";
import { AiOutlineShareAlt } from "react-icons/ai";
import styled from "styled-components";

import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import copyToClipboard from "../../lib/utils/copyToClipboard";
import Button from "../ui/Button";
import Typography from "../ui/Typography";

const ShareWrapper = styled.div`
  display: flex;
  flex-direction: column;

  ${breakpoint.s} {
    position: relative;
  }
  ${breakpoint.m} {
    position: absolute;
    max-width: 5rem;
    right: -5rem;
    top: 0;
  }
  ${breakpoint.xl} {
  }
`;
const SimpleSmallModal = styled.div<{ $show: boolean }>`
  transform: ${({ $show }) => ($show ? "translateY(0)" : "translateY(10rem)")};

  transition: transform 500ms ease-in-out;
  position: fixed;
  z-index: ${zIndex.Notification};
  bottom: 1rem;
  right: 1rem;

  color: ${colors.white};
  background: ${colors.blue};
  padding: 0 1rem;
`;
const OfferDetailShare: React.FC = () => {
  const [show, setShow] = useState<boolean>(false);
  const numberOfShares = 52; // TODO: Replace this MOCK with real value

  const handleShare = () => {
    copyToClipboard(window.location.href).then(() => {
      setShow(true);
      setTimeout(() => {
        setShow(false);
      }, 3000);
    });
  };
  return (
    <>
      <ShareWrapper>
        <Button onClick={handleShare} theme="blank">
          <AiOutlineShareAlt size={24} />
          {numberOfShares}
        </Button>
      </ShareWrapper>
      <SimpleSmallModal $show={show}>
        <Typography tag="p">Url has been copied to clipboard</Typography>
      </SimpleSmallModal>
    </>
  );
};

export default OfferDetailShare;
