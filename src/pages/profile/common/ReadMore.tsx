import { useMemo, useState } from "react";
import styled from "styled-components";

import Button from "../../../components/ui/Button";
import { Typography } from "../../../components/ui/Typography";
import { colors } from "../../../lib/styles/colors";
import { useBreakpoints } from "../../../lib/utils/hooks/useBreakpoints";

const ReadMoreContainer = styled.div`
  margin-bottom: 2rem;
  color: ${colors.darkGrey};
  > p {
    line-height: 2.5rem;
  }
`;

const ReadMoreButton = styled(Button)`
  color: ${colors.darkGrey};
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
  const { isLteXS } = useBreakpoints();
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
        fontSize={isLteXS ? "1.15rem" : "1rem"}
        margin="0"
        style={{ overflow: "hidden", textOverflow: "ellipsis" }}
      >
        {truncateText}
      </Typography>
      {text.length > MAX_CHARACTERS && (
        <ReadMoreButton
          themeVal="outline"
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
