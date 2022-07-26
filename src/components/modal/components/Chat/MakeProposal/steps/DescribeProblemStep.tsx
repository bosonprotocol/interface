import { useState } from "react";
import styled from "styled-components";

import { colors } from "../../../../../../lib/styles/colors";
// import { Exchange } from "../../../../../../lib/utils/hooks/useExchanges";
import UploadForm from "../../../../../../pages/chat/components/UploadForm/UploadForm";
import Field, { FieldType } from "../../../../../form/Field";
import Button from "../../../../../ui/Button";
import Grid from "../../../../../ui/Grid";
import Typography from "../../../../../ui/Typography";

const ButtonsSection = styled.div`
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
`;

const TextArea = styled(Field)`
  width: 100%;
  resize: none;
`;

interface Props {
  //   exchange: Exchange;
  onNextClick: () => void;
}

export default function DescribeProblemStep({ onNextClick }: Props) {
  const [messageProblem, setMessageProblem] = useState<string>("");
  const [files, setFiles] = useState<File[]>();
  return (
    <>
      <Typography fontSize="2rem" fontWeight="600">
        Describe Problem
      </Typography>
      <Typography fontSize="1.25rem" color={colors.darkGrey}>
        You may provide any information or attach any files that can support
        your case.
      </Typography>
      <Grid flexDirection="column" margin="2rem 0" alignItems="flex-start">
        <Typography fontWeight="600" tag="p">
          Message
        </Typography>
        <TextArea
          rows="5"
          fieldType={FieldType.Textarea}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setMessageProblem(e.target.value);
          }}
        />
      </Grid>
      <UploadForm
        onFilesSelect={(files) => {
          setFiles(files);
        }}
      />
      <ButtonsSection>
        <Button
          theme="secondary"
          onClick={() => onNextClick()}
          disabled={!messageProblem && !files?.length}
        >
          Next
        </Button>
      </ButtonsSection>
    </>
  );
}
