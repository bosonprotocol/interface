import { MagnifyingGlass } from "phosphor-react";
import React from "react";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import { FormField, Input } from "../form";
import DocumentsUploader from "../form/DocumentsUploader";
import Typography from "../ui/Typography";

const DocumentsHeader = styled.div`
  margin-bottom: 3.125rem;
`;

const InputContainer = styled.div`
  position: relative;
  margin-bottom: 5rem;
  margin-top: 0.75rem;
  input {
    background: ${colors.lightGrey};
    border: none;
    padding: 1rem;
    width: 100%;
    padding-left: 2.8125rem;
    font-size: 1rem;
    font-weight: 400;
  }
  svg {
    position: absolute;
    left: 1.25rem;
    top: 46px;
    color: ${colors.darkGrey};
  }
`;

const NextButton = styled.button`
  border: none;
  background: ${colors.lightGrey};
  color: ${colors.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border: none;
  padding: 1rem 2rem 1rem 2rem;
  font-size: 1rem;
  font-family: "Plus Jakarta Sans";
  text-align: left;
  margin-top: 1.5rem;
  font-weight: 600;
  width: min-content;
`;

function AdditionalInformation() {
  return (
    <div>
      <DocumentsHeader>
        <Typography fontWeight="600" fontSize="2rem">
          Add documents to support your case
        </Typography>
        <Typography fontSize="1.25rem" color={colors.darkGrey}>
          You may provide any information or attach any files that can support
          your case.
        </Typography>
      </DocumentsHeader>
      <InputContainer>
        <FormField title="Message">
          <Input
            placeholder="Write a message or description here"
            name="documentMessage"
          />
        </FormField>
        <MagnifyingGlass size={21} />
      </InputContainer>
      <DocumentsUploader />
      <NextButton type="submit">Next</NextButton>
    </div>
  );
}

export default AdditionalInformation;
