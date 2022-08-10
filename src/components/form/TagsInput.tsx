import { useState } from "react";
import styled from "styled-components";

import { FieldInput } from "./Field.styles";

function TagsInput() {
  const [tags, setTags] = useState<string[]>([]);

  function handleKeyDown(event: any) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const value: string = event.target.value;
    if (!value.trim()) return;
    setTags([...tags, value]);
    event.target.value = "";
  }

  function removeTag(index: number) {
    setTags(tags.filter((el, i) => i !== index));
  }

  return (
    <TagContainer>
      <FieldInput
        onKeyDown={handleKeyDown}
        type="text"
        placeholder="Choose tags..."
      />
      {tags.map((tag, index) => (
        <TagWrapper key={index}>
          <span className="text">{tag}</span>
          <Close onClick={() => removeTag(index)}>&times;</Close>
        </TagWrapper>
      ))}
    </TagContainer>
  );
}

const TagContainer = styled.div`
  width: 100%;
  border-radius: 3px;
  margin-top: 1em;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5em;
`;

const TagWrapper = styled.div`
  background-color: #f1f3f9;
  display: inline-block;
  padding: 0.5em 0.75em;
`;

const Close = styled.span`
  color: #556072;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-left: 0.5em;
  font-size: 18px;
  cursor: pointer;
`;

export default TagsInput;
