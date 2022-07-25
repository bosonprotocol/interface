import { CaretDown, CaretUp } from "phosphor-react";

import { DataProps, Props } from "./Field";
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

function Content({ children, ...props }: Props) {
  return (
    <SelectPrimitive.Portal>
      <StyledContent {...props}>{children}</StyledContent>
    </SelectPrimitive.Portal>
  );
}

export default function Select({ placeholder, data, ...props }: Props) {
  console.log(data);
  return (
    <SelectRoot {...props}>
      <SelectTrigger aria-label="Food">
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
              data.map((element: DataProps, index: number) => (
                <SelectItem value={element.value} key={`select_item_${index}`}>
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
  );
}
