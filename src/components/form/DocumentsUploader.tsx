import { UploadSimple } from "phosphor-react";
import React from "react";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
const Button = styled.button`
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Plus Jakarta Sans";
  color: ${colors.secondary};
  padding: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-bottom: 0.125rem solid ${colors.lightGrey};
`;

const DocumentsUploader = (props: any) => {
  const hiddenFileInput = React.useRef(null);

  const handleClick = (event: any) => {
    console.log("clicked");
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileUploaded = event.target.files[0];
      props.handleFile(fileUploaded);
    }
  };
  return (
    <>
      <Button onClick={handleClick}>
        Upload file &nbsp;&nbsp;
        <UploadSimple size={20} />
      </Button>
      <input
        type="file"
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{ display: "none" }}
      />
    </>
  );
};
export default DocumentsUploader;
