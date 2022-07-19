import { ReactNode } from "react";
import styled from "styled-components";

import { colors } from "../../../lib/styles/colors";
import { Thread } from "../types";

const Content = styled.div`
  position: relative;
  background-color: ${colors.white};
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border: 1px solid #5560720f;
  margin-right: 2.5rem;
  margin-top: 4.5rem;
  margin-left: 2.5rem;
  &:after {
    position: absolute;
    content: "";
    border-top: 16px solid ${colors.white};
    border-right: 16px solid transparent;
    right: -1rem;
    top: 0px;
  }
  h4 {
    font-weight: 600;
  }
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
        <h4>Balint raised a dispute and made a proposal</h4>
        <h5>Dispute Category</h5>
        <ul>
          <li>Item not as described</li>
          <li>
            The item received is a different colour, model, version, or size
          </li>
        </ul>
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
