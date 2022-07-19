import { ReactNode } from "react";
import styled from "styled-components";

import { colors } from "../../../lib/styles/colors";
import { Thread } from "../types";

const Content = styled.div`
  background-color: ${colors.white};
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border: 1px solid #5560720f;
`;

interface Props {
  thread: Thread;
  message: Thread["messages"][number];
  children: ReactNode;
}

export default function Message({ message, children }: Props) {
  if (typeof message.content.value === "string") {
    return (
      <Content>
        {children}
        <div>{message.content.value}</div>
        <button>button</button>
      </Content>
    );
  }
  return (
    <Content>
      {children}
      <div>{JSON.stringify(message.content.value)}</div>
    </Content>
  );
}
