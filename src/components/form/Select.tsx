import { useField } from "formik";
import { CaretDown, CaretUp } from "phosphor-react";

import Error from "./Error";
import {
  SelectGroup,
  SelectIcon,
  SelectItem,
  SelectItemText,
  SelectPrimitive,
  SelectRoot,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
  SelectViewport,
  StyledContent
} from "./Select.styles";
import type { SelectContentProps, SelectDataProps, SelectProps } from "./types";

function Content({ children, ...props }: SelectContentProps) {
  return (
    <SelectPrimitive.Portal>
      <StyledContent {...props}>{children}</StyledContent>
    </SelectPrimitive.Portal>
  );
}
export default function Select({
  name,
  placeholder,
  data,
  ...props
}: SelectProps) {
  const [field, meta, helpers] = useField(name);
  const errorMessage = meta.error && meta.touched ? meta.error : "";
  const displayError =
    typeof errorMessage === typeof "string" && errorMessage !== "";

  return (
    <>
      <SelectRoot
        {...props}
        {...field}
        onValueChange={(value: string) => {
          helpers.setValue(value);
        }}
        onOpenChange={(open: boolean) => {
          if (!meta.touched && !open) {
            helpers.setTouched(true);
          }
        }}
      >
        <SelectTrigger error={errorMessage}>
          <SelectValue placeholder={placeholder || "Choose value…"} />
          <SelectIcon>
            <CaretDown size={18} />
          </SelectIcon>
        </SelectTrigger>
        <Content>
          <SelectScrollUpButton>
            <CaretUp size={18} />
          </SelectScrollUpButton>
          <SelectViewport>
            <SelectGroup>
              {data ? (
                data.map((element: SelectDataProps, index: number) => (
                  <SelectItem
                    value={element.value}
                    key={`select_item_${index}`}
                  >
                    <SelectItemText>{element.name}</SelectItemText>
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none">
                  <SelectItemText>None</SelectItemText>
                </SelectItem>
              )}
            </SelectGroup>
          </SelectViewport>
          <SelectScrollDownButton>
            <CaretDown size={18} />
          </SelectScrollDownButton>
        </Content>
      </SelectRoot>
      <Error display={displayError} message={errorMessage} />{" "}
    </>
  );
}
