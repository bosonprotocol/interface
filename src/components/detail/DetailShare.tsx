import { useState } from "react";
import { AiOutlineShareAlt } from "react-icons/ai";

import copyToClipboard from "../../lib/utils/copyToClipboard";
import Button from "../ui/Button";
import Typography from "../ui/Typography";
import { Notify, ShareWrapper } from "./Detail.style";

export default function DetailShare() {
  const [show, setShow] = useState<boolean>(false);

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
        </Button>
      </ShareWrapper>
      <Notify $show={show}>
        <Typography tag="p">URL has been copied to clipboard</Typography>
      </Notify>
    </>
  );
}
