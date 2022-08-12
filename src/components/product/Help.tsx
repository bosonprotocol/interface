import isString from "lodash/isString";
import map from "lodash/map";
import { useMemo } from "react";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import Typography from "../ui/Typography";

interface Props {
  title?: string;
  background?: string;
  data: {
    title: string | JSX.Element;
    description: string | JSX.Element;
  }[];
}
const HelpWrapper = styled.aside<{ $background?: string }>`
  width: 100%;
  width: 23.25rem;
  display: flex;
  flex-direction: column;
  background: ${(props) => props.$background || colors.lightGrey};
`;

const HelpTitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #5560720f;
  padding: 1rem 1.5rem;
`;

const HelpContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 1rem 1.5rem;
`;

const HelpContentContainer = styled.div`
  margin-bottom: 2rem;
  > h4 {
    font-size: 1rem;
    margin: 0 0 0.5rem 0;
  }
  > p {
    margin: 0;
    line-height: 1.5rem;
  }
`;

export default function Help({ title = "Help", background, data }: Props) {
  const renderData = useMemo(() => {
    return map(data, ({ title, description }, i) => {
      return (
        <HelpContentContainer key={`${title}-${i}`}>
          {isString(title) ? <Typography tag="h4">{title}</Typography> : title}
          {isString(description) ? (
            <Typography tag="p">{description}</Typography>
          ) : (
            description
          )}
        </HelpContentContainer>
      );
    });
  }, [data]);
  return (
    <HelpWrapper $background={background}>
      <HelpTitleContainer>
        <Typography tag="h3" style={{ margin: 0 }}>
          {title}
        </Typography>
      </HelpTitleContainer>
      <HelpContent>{renderData}</HelpContent>
    </HelpWrapper>
  );
}
