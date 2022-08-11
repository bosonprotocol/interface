import { useField } from "formik";
import { useEffect, useState } from "react";
import styled from "styled-components";

import Error from "./Error";
import { FieldInput } from "./Field.styles";

const TagsInput = ({ name }: { name: string }) => {
  const [field, meta, helpers] = useField(name);
  const [tags, setTags] = useState<string[]>([]);

  const errorMessage = meta.error && meta.touched ? meta.error : "";
  const displayError =
    typeof errorMessage === typeof "string" && errorMessage !== "";

  useEffect(() => {
    if (!meta.touched) {
      helpers.setTouched(true);
    }
    setTags(field.value);
  }, [field.value]); // eslint-disable-line

  function handleKeyDown(event: any) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const value: string = event.target.value;
    if (!value.trim()) return;
    const newTags = [...tags, value];
    setTags(newTags);
    event.target.value = "";
    if (!meta.touched) {
      helpers.setTouched(true);
    }
    helpers.setValue(newTags);
  }

  function removeTag(index: number) {
    const filteredTags = tags.filter((el, i) => i !== index);
    setTags(filteredTags);
    if (!meta.touched) {
      helpers.setTouched(true);
    }
    helpers.setValue(filteredTags);
  }

  return (
    <>
      <TagContainer>
        <FieldInput
          onKeyDown={handleKeyDown}
          type="text"
          placeholder="Choose tags..."
          name={name}
        />
        {tags.map((tag, index) => (
          <TagWrapper key={index}>
            <span className="text">{tag}</span>
            <Close onClick={() => removeTag(index)}>&times;</Close>
          </TagWrapper>
        ))}
      </TagContainer>
      <Error display={displayError} message={errorMessage} />{" "}
    </>
  );
};

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
