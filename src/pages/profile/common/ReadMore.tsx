import { useMemo, useState } from "react";
import styled from "styled-components";

import Button from "../../../components/ui/Button";
import Typography from "../../../components/ui/Typography";

const ReadMoreContainer = styled.div`
  margin-bottom: 2rem;
  > p {
    line-height: 2.5rem;
  }
`;

const ReadMoreButton = styled(Button)`
  outline: none;
  border: none;
  padding: 0;
  margin-top: 0;
  &:hover:not(:disabled) {
    border: none;
    background-color: transparent;
    text-decoration: underline;
  }
`;

interface Props {
  text: string;
}

const MAX_CHARACTERS = 125;

function ReadMore({ text }: Props) {
  const [isShowMoreVisible, setIsShowMoreVisible] = useState<boolean>(
    text.length < MAX_CHARACTERS
  );
  const handleToggleShowMore = () => {
    setIsShowMoreVisible((prev) => !prev);
  };
  const truncateText = useMemo(() => {
    return text.length > MAX_CHARACTERS && !isShowMoreVisible
      ? text.substring(0, MAX_CHARACTERS) + "..."
      : text;
  }, [isShowMoreVisible, text]);
  return (
    <ReadMoreContainer>
      <Typography
        tag="p"
        $fontSize="1rem"
        margin="0"
        style={{ overflow: "hidden", textOverflow: "ellipsis" }}
      >
        {truncateText}
      </Typography>
      {text.length > MAX_CHARACTERS && (
        <ReadMoreButton
          theme="outline"
          size="small"
          onClick={handleToggleShowMore}
        >
          {!isShowMoreVisible ? "Read more" : "Read less"}
        </ReadMoreButton>
      )}
    </ReadMoreContainer>
  );
}

export default ReadMore;
