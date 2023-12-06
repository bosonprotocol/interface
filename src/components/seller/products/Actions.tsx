import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CaretDown } from "phosphor-react";
import React, { ReactNode } from "react";
import { createGlobalStyle } from "styled-components";

import { colors } from "../../../lib/styles/colors";
import Button from "../../ui/Button";
import Grid from "../../ui/Grid";

const GlobalStyle = createGlobalStyle`
.DropdownMenuContent,
.DropdownMenuSubContent {
  min-width: 220px;
  background-color: white;
  border: 1px solid ${colors.border};
  border-radius: 6px;
  padding: 5px;
  box-shadow: 0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2);
  animation-duration: 400ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;
}
.DropdownMenuContent[data-side='top'],
.DropdownMenuSubContent[data-side='top'] {
  animation-name: slideDownAndFade;
}
.DropdownMenuContent[data-side='right'],
.DropdownMenuSubContent[data-side='right'] {
  animation-name: slideLeftAndFade;
}
.DropdownMenuContent[data-side='bottom'],
.DropdownMenuSubContent[data-side='bottom'] {
  animation-name: slideUpAndFade;
}
.DropdownMenuContent[data-side='left'],
.DropdownMenuSubContent[data-side='left'] {
  animation-name: slideRightAndFade;
}

.DropdownMenuItem,
.DropdownMenuCheckboxItem,
.DropdownMenuRadioItem,
.DropdownMenuSubTrigger {
  font-size: 0.8125rem;
  line-height: 1;
  color: ${colors.black};
  border-radius: 3px;
  display: flex;
  align-items: center;
  height: 25px;
  padding: 0 5px;
  position: relative;
  padding-left: 25px;
  user-select: none;
  outline: none;
}
.DropdownMenuSubTrigger[data-state='open'] {
  background-color: ${colors.blue};
  color: var(--accent);
}
.DropdownMenuItem[data-disabled],
.DropdownMenuCheckboxItem[data-disabled],
.DropdownMenuRadioItem[data-disabled],
.DropdownMenuSubTrigger[data-disabled] {
  color: ${colors.lightGrey};
  pointer-events: none;
}
.DropdownMenuItem[data-highlighted],
.DropdownMenuCheckboxItem[data-highlighted],
.DropdownMenuRadioItem[data-highlighted],
.DropdownMenuSubTrigger[data-highlighted] {
  background-color: ${colors.lightGrey};
  color: ${colors.darkGrey};
}

.DropdownMenuLabel {
  padding-left: 25px;
  font-size: 0.75rem;
  line-height: 25px;
  color: ${colors.black};
}

.DropdownMenuSeparator {
  height: 1px;
  background-color: var(--accent);
  margin: 5px;
}

.DropdownMenuItemIndicator {
  position: absolute;
  left: 0;
  width: 25px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.DropdownMenuArrow {
  fill: white;
}

.IconButton {
  font-family: inherit;
  border-radius: 100%;
  height: 35px;
  width: 35px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--violet11);
  background-color: white;
  box-shadow: 0 2px 10px ${colors.black};
}
.IconButton:hover {
  background-color: var(--accent);
}
.IconButton:focus {
  box-shadow: 0 0 0 2px black;
}

.RightSlot {
  margin-left: auto;
  padding-left: 20px;
  color: var(--accent);
}
[data-highlighted] > .RightSlot {
  color: white;
}
[data-disabled] .RightSlot {
  color: var(--accent);
}

@keyframes slideUpAndFade {
  from {
    opacity: 0;
    transform: translateY(2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideRightAndFade {
  from {
    opacity: 0;
    transform: translateX(-2px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideDownAndFade {
  from {
    opacity: 0;
    transform: translateY(-2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideLeftAndFade {
  from {
    opacity: 0;
    transform: translateX(2px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
  `;

interface ActionsProps {
  label: string;
  items: { key: string; content: ReactNode }[];
}

const Actions: React.FC<ActionsProps> = ({ label, items }) => {
  return (
    <>
      <GlobalStyle />
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild={false}>
          <Button theme="secondary" size={"small"}>
            <Grid gap="0.5rem">
              {label} <CaretDown size={16} />
            </Grid>
          </Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
            {items.map((item) => {
              return (
                <DropdownMenu.Item
                  className="DropdownMenuItem"
                  key={item.key}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {item.content}
                </DropdownMenu.Item>
              );
            })}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </>
  );
};

export default Actions;
