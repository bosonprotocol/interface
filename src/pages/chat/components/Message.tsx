import { Image as AccountImage } from "@davatar/react";
import { ReactNode } from "react";
import styled from "styled-components";

import { colors } from "../../../lib/styles/colors";
import { Thread } from "../types";

const Content = styled.div<{ $isLeftAligned: boolean }>`
  position: relative;
  background-color: ${({ $isLeftAligned }) =>
    $isLeftAligned ? colors.black : colors.white};
  color: ${({ $isLeftAligned }) =>
    $isLeftAligned ? colors.white : colors.black};
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border: 0.063rem solid #5560720f;
  margin-right: 2.5rem;
  margin-left: 2.5rem;
  padding-top: 1.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-bottom: 3.75rem;
  max-width: 31.625rem;
  margin-top: 3rem;
  &:after {
    position: absolute;
    content: "";
    border-top: 16px solid
      ${({ $isLeftAligned }) => ($isLeftAligned ? colors.black : colors.white)};
    border-right: 16px solid transparent;
    border-right: ${({ $isLeftAligned }) =>
      $isLeftAligned ? "none" : "16px solid transparent"};
    border-left: ${({ $isLeftAligned }) =>
      $isLeftAligned ? "16px solid transparent" : "none"};
    top: -0.063rem;
    right: ${({ $isLeftAligned }) => ($isLeftAligned ? "auto" : "-1rem")};
    left: ${({ $isLeftAligned }) => ($isLeftAligned ? "-1rem" : "auto")};
  }
  h4 {
    font-weight: 600;
    font-size: 1.25rem;
  }
  h5 {
    font-size: 1rem;
    font-weight: 600;
  }
  ul {
    list-style: none;
    padding: 0rem;
    margin: 0 0 1.5rem 0;
    li {
      &:before {
        content: "✓";
        margin-right: 0.125rem;
      }
    }
  }
`;

const Avatar = styled.div`
  position: absolute;
  top: -1.25rem;
  left: 1rem;
`;

const Date = styled.div<{ $isLeftAligned: boolean }>`
  position: absolute;
  bottom: 1rem;
  right: ${({ $isLeftAligned }) => ($isLeftAligned ? "auto" : "1rem")};
  left: ${({ $isLeftAligned }) => ($isLeftAligned ? "1rem" : "auto")};
  font-size: 0.75rem;
  color: ${({ $isLeftAligned }) =>
    $isLeftAligned ? colors.lightGrey : colors.darkGrey};
`;

interface Props {
  thread: Thread;
  message: Thread["messages"][number];
  children: ReactNode;
  isLeftAligned: boolean;
}

export default function Message({
  message,
  children,
  isLeftAligned,
  thread
}: Props) {
  if (typeof message.content.value === "string") {
    return (
      <Content $isLeftAligned={isLeftAligned}>
        {isLeftAligned ? (
          <Avatar>{children}</Avatar>
        ) : (
          <Avatar>
            <AccountImage size={32} address={thread.exchange?.buyer.wallet} />
          </Avatar>
        )}
        <h4>Balint raised a dispute and made a proposal</h4>
        <h5>Dispute Category</h5>
        <ul>
          <li>Item not as described</li>
          <li>
            The item received is a different colour, model, version, or size
          </li>
        </ul>
        <h5>Additional information</h5>
        <p>
          Hello there, the item I received has some quality issues. The colours
          are a bit worn out and not as bright as on the picture. The laces are
          slightly damaged and in the wrong colour....
        </p>
        <div>{message.content.value}</div>
        <Date $isLeftAligned={isLeftAligned}>
          {message.sentDate.getHours()}:{message.sentDate.getMinutes()}
        </Date>
      </Content>
    );
  }
  return (
    <Content $isLeftAligned={isLeftAligned}>
      {children}
      <div>{JSON.stringify(message.content.value)}</div>
    </Content>
  );
}
