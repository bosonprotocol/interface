import map from "lodash/map";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";

const TagsWrapper = styled.div`
  display: block;
  border-bottom: 1px solid rgba(85, 96, 114, 0.06);
`;
const TagsList = styled.ul`
  display: flex;
  margin: 0;
  padding: 0;
  list-style-type: none;
  justify-content: flex-start;
`;
const TagItem = styled.li<{ $active?: boolean }>`
  border-bottom: ${(props) =>
    props.$active ? ` 1px solid ${colors.black}` : colors.black};
  color ${(props) =>
    props.$active ? ` 1px solid ${colors.black}` : colors.darkGrey};
  padding: 1.125rem 1.5rem;
  display: flex;
  list-style-type: none;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  &:not(:last-child) {
    margin-right: 1.5rem;
  }
`;

type SellerTag = {
  label: string;
  value: string;
};

interface Props {
  currentTag: string;
  tags: SellerTag[];
  setCurrentTag: React.Dispatch<React.SetStateAction<string>>;
}
export default function SellerTags({ tags, currentTag, setCurrentTag }: Props) {
  const handleChangeTag = (value: string) => {
    setCurrentTag(value);
  };
  return (
    <TagsWrapper>
      <TagsList>
        {map(tags, (tag) => {
          return (
            <TagItem
              $active={currentTag === tag.value}
              onClick={() => handleChangeTag(tag.value)}
            >
              {tag.label}
            </TagItem>
          );
        })}
      </TagsList>
    </TagsWrapper>
  );
}
