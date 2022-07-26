import styled from "styled-components";

import { colors } from "../../../../../../lib/styles/colors";
// import { Exchange } from "../../../../../../lib/utils/hooks/useExchanges";
import UploadForm from "../../../../../../pages/chat/components/UploadForm/UploadForm";
import { ProposalMessage } from "../../../../../../pages/chat/types";
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
  proposal: ProposalMessage["value"];
  setProposal: React.Dispatch<React.SetStateAction<ProposalMessage["value"]>>;
  onNextClick: () => void;
}

export default function DescribeProblemStep({
  onNextClick,
  setProposal,
  proposal
}: Props) {
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
            setProposal({
              ...proposal,
              description: e.target.value
            });
          }}
          value={proposal.description}
        />
      </Grid>
      <UploadForm
        onFilesSelect={async (files) => {
          const promises: Promise<string | ArrayBuffer | null>[] = [];
          for (const file of files) {
            promises.push(
              new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function () {
                  resolve(reader.result);
                };
                reader.onerror = function (error) {
                  reject(error);
                };
              })
            );
          }
          const filesInfo = await Promise.all(promises);
          files &&
            filesInfo &&
            setProposal({
              ...proposal,
              additionalInformationFiles: [
                ...files.map((file, index) => ({
                  name: file.name,
                  url: filesInfo[index]?.toString() || ""
                }))
              ]
            });
        }}
      />
      <ButtonsSection>
        <Button
          theme="secondary"
          onClick={() => onNextClick()}
          disabled={
            !proposal.description && !proposal.additionalInformationFiles.length
          }
        >
          Next
        </Button>
      </ButtonsSection>
    </>
  );
}
