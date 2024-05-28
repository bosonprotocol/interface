import { BaseTagsInput, BaseTagsInputProps } from "@bosonprotocol/react-kit";
import { inputTheme } from "theme";

const TagsInput = (props: Omit<BaseTagsInputProps, "theme">) => {
  return <BaseTagsInput {...props} theme={inputTheme} />;
};

export default TagsInput;
