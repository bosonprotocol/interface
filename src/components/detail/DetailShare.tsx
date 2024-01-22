import { ShareNetwork } from "phosphor-react";
import { useState } from "react";

import copyToClipboard from "../../lib/utils/copyToClipboard";
import Button from "../ui/Button";
import { Typography } from "../ui/Typography";
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
      <ShareWrapper data-name="detail-share-wrapper">
        <Button onClick={handleShare} themeVal="blank">
          <ShareNetwork size={24} />
        </Button>
      </ShareWrapper>
      <Notify $show={show}>
        <Typography tag="p">URL has been copied to clipboard</Typography>
      </Notify>
    </>
  );
}
