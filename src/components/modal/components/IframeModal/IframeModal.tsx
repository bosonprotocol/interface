import React, { useState } from "react";

import Loading from "../../../ui/Loading";

interface IframeModalProps {
  src: string;
}

export const IframeModal: React.FC<IframeModalProps> = ({ src }) => {
  const [showIframe, setShowIframe] = useState<boolean>(false);
  return (
    <>
      {!showIframe && <Loading />}
      <iframe
        src={src}
        style={{
          visibility: showIframe ? undefined : "hidden",
          width: "100%",
          height: "100%"
        }}
        onLoad={() => setShowIframe(true)}
      ></iframe>
    </>
  );
};
