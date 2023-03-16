/* eslint-disable @typescript-eslint/no-explicit-any */
import { useField, useFormikContext } from "formik";
import { KeyReturn } from "phosphor-react";
import { useEffect } from "react";

import Grid from "../ui/Grid";
import Typography from "../ui/Typography";
import Error from "./Error";
import { FieldInput } from "./Field.styles";
import {
  Close,
  Helper,
  TagContainer,
  TagWrapper
} from "./styles/TagsInput.styles";
import { TagsProps } from "./types";

const TagsInput = ({
  name,
  placeholder,
  onAddTag,
  onRemoveTag,
  compareTags = (tagA: string, tagB: string) =>
    tagA.toLowerCase() === tagB.toLowerCase(),
  transform = (tag: string) => tag,
  label
}: TagsProps) => {
  const { validateForm } = useFormikContext();
  const [field, meta, helpers] = useField<string[]>(name);
  const tags = field.value || [];

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

    if (!tags.find((tag) => compareTags(tag, value))) {
      const transformedValue = transform(value);
      const newTags = [...tags, transformedValue];
      helpers.setValue(newTags);
      onAddTag?.(transformedValue);
    }
  }

  function removeTag(index: number) {
    const filteredTags = tags.filter((_, i) => i !== index);
    helpers.setValue(filteredTags);
    if (!meta.touched) {
      helpers.setTouched(true);
    }
    onRemoveTag?.(tags[index]);
  }
  useEffect(() => {
    validateForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.value]);
  return (
    <>
      <Grid gap="0.5rem" alignItems="center">
        {label && <Typography>{label}</Typography>}
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
      </Grid>
      <TagContainer style={{ marginTop: "1em" }}>
        {label && (
          <Typography style={{ visibility: "hidden" }}>{label}</Typography>
        )}
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
