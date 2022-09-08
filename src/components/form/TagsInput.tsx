/* eslint-disable @typescript-eslint/no-explicit-any */
import { useField } from "formik";
import { KeyReturn } from "phosphor-react";
import { useState } from "react";

import Error from "./Error";
import { FieldInput } from "./Field.styles";
import {
  Close,
  Helper,
  TagContainer,
  TagWrapper
} from "./styles/TagsInput.styles";

const TagsInput = ({ name }: { name: string }) => {
  const [, meta, helpers] = useField(name);
  const [tags, setTags] = useState<string[]>([]);

  const errorMessage = meta.error && meta.touched ? meta.error : "";
  const displayError =
    typeof errorMessage === typeof "string" && errorMessage !== "";

  const handleBlur = () => {
    if (!meta.touched) {
      helpers.setTouched(true);
    }
  };

  function handleKeyDown(event: any) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const value: string = event.target.value;
    if (!value.trim()) return;
    event.target.value = "";
    if (!meta.touched) {
      helpers.setTouched(true);
    }

    if (!tags.includes(value.toLowerCase())) {
      const newTags = [...tags, value.toLowerCase()];
      setTags(newTags);
      helpers.setValue(newTags);
    }
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
          onBlur={handleBlur}
          error={errorMessage}
        />
        <Helper>
          Hit Enter <KeyReturn size={16} />
        </Helper>
      </TagContainer>
      <TagContainer>
        {tags.map((tag: string, index: number) => (
          <TagWrapper key={`tags-wrapper_${tag}`}>
            <span className="text">{tag}</span>
            <Close onClick={() => removeTag(index)}>&times;</Close>
          </TagWrapper>
        ))}
      </TagContainer>
      <Error display={displayError} message={errorMessage} />{" "}
    </>
  );
};

export default TagsInput;
