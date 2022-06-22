import { useState } from "react";
import { IoIosCheckbox, IoIosCopy } from "react-icons/io";
import styled from "styled-components";

const Container = styled.div<{ $isSaving: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  white-space: normal;
  background: transparent;
  background: #333;
  color: white;
  font-size: 0.875em;
  opacity: ${(props) => (props.$isSaving ? 0.95 : 0.5)};
  transition: opacity linear 0.5s;
  border-radius: 0 0 0 7px;
  padding: 5px 8px 5px 8px;
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;

  :hover {
    opacity: 0.95;
  }
`;

const CheckIcon = styled(IoIosCheckbox)`
  fill: limegreen;
  font-size: 25px;
`;

const CopyIcon = styled(IoIosCopy)`
  font-size: 25px;
`;

const CodeBadgeText = styled.div`
  margin-right: 10px;
  font-weight: 600;
  color: goldenrod;
`;

interface Props {
  textToCopy: string;
}

export default function CopyBadge({ textToCopy }: Props) {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  return (
    <Container
      $isSaving={isSaving}
      onClick={() => {
        navigator.clipboard.writeText(textToCopy);
        setIsSaving(true);
        setTimeout(() => {
          setIsSaving(false);
        }, 2000);
      }}
    >
      <CodeBadgeText>Copy</CodeBadgeText>
      {isSaving ? <CheckIcon /> : <CopyIcon />}
    </Container>
  );
}
