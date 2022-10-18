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
import { TagsProps } from "./types";

const TagsInput = ({ name, placeholder, onAddTag, onRemoveTag }: TagsProps) => {
  const [field, meta, helpers] = useField<string[]>(name);
  const [tags, setTags] = useState<string[]>(field.value || []);

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
      onAddTag?.(value);
    }
  }

  function removeTag(index: number) {
    const filteredTags = tags.filter((_, i) => i !== index);
    setTags(filteredTags);
    helpers.setValue(filteredTags);
    if (!meta.touched) {
      helpers.setTouched(true);
    }
    onRemoveTag?.(tags[index]);
  }

  return (
    <>
      <TagContainer>
        <FieldInput
          onKeyDown={handleKeyDown}
          type="text"
          placeholder={placeholder || "Choose tags..."}
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
