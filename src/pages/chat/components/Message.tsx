import { Image as AccountImage } from "@davatar/react";
import dayjs from "dayjs";
import { ReactNode, useMemo, useState } from "react";
import styled from "styled-components";

import { useModal } from "../../../components/modal/useModal";
import Grid from "../../../components/ui/Grid";
import Typography from "../../../components/ui/Typography";
import { colors } from "../../../lib/styles/colors";
import { zIndex } from "../../../lib/styles/zIndex";
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
  border: 0.063rem solid ${colors.border};
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
  img {
    max-width: 15.625rem;
    object-fit: contain;
  }
`;

const Avatar = styled.div`
  position: absolute;
  top: -1.25rem;
  left: 1rem;
  img {
    width: 34px;
    height: 34px;
  }
`;

const DateStamp = styled.div<{ $isLeftAligned: boolean }>`
  position: absolute;
  bottom: 1rem;
  right: ${({ $isLeftAligned }) => ($isLeftAligned ? "auto" : "1rem")};
  left: ${({ $isLeftAligned }) => ($isLeftAligned ? "1rem" : "auto")};
  font-size: 0.75rem;
  color: ${({ $isLeftAligned }) =>
    $isLeftAligned ? colors.lightGrey : colors.darkGrey};
`;

const Separator = styled.div`
  width: 100%;
  position: relative;
  z-index: ${zIndex.Default};
  div:nth-of-type(2) {
    width: calc(100% - 2.5rem);
    height: 0.125rem;
    background-color: ${colors.darkGreyTimeStamp};
    z-index: ${zIndex.Default};
    position: relative;
    margin-left: auto;
    margin-right: auto;
    margin-top: -0.875rem;
  }
  div:nth-of-type(1) {
    width: max-content;
    background-color: ${colors.darkGreyTimeStamp};
    padding: 0.25rem 1rem 0.25rem 1rem;
    display: block;
    margin: 0 auto;
    z-index: ${zIndex.ChatSeparator};
    position: relative;
    font-weight: 600;
    font-size: 0.75rem;
    &:before {
      position: absolute;
      background-color: ${colors.lightGrey};
      left: -0.625rem;
      height: 100%;
      width: 0.625rem;
      content: "";
    }
    &:after {
      position: absolute;
      background-color: ${colors.lightGrey};
      right: -0.625rem;
      height: 100%;
      width: 0.625rem;
      content: "";
    }
  }
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
  const { showModal } = useModal();
  const [error, setError] = useState<boolean>(false);

  const calcDate = useMemo(() => {
    const currentDate = dayjs();
    const dateOfSending = dayjs(message.sentDate);

    return currentDate.diff(dateOfSending, "day");
  }, [message]);

  const separatorComponent = useMemo(() => {
    if (calcDate === 0) {
      return null;
    } else if (calcDate > 0 && calcDate <= 7) {
      return (
        <Separator>
          <div>
            {message.sentDate.toLocaleDateString("en-EN", {
              weekday: "long"
            })}
          </div>
          <div></div>
        </Separator>
      );
    } else {
      return (
        <Separator>
          <div>{`${calcDate} days ago`}</div>
          <div></div>
        </Separator>
      );
    }
  }, [message, calcDate]);

  const SellerAvatar = () => {
    return isLeftAligned ? (
      <Avatar>{children}</Avatar>
    ) : (
      <Avatar>
        <AccountImage size={32} address={thread.exchange?.buyer.wallet} />
      </Avatar>
    );
  };

  const BottomDateStamp = () => {
    return (
      <DateStamp $isLeftAligned={isLeftAligned}>
        {message.sentDate.getHours()}:{message.sentDate.getMinutes()}
      </DateStamp>
    );
  };

  if (typeof message.content.value === "string") {
    return (
      <>
        {separatorComponent}
        <Content $isLeftAligned={isLeftAligned}>
          <SellerAvatar />
          {message.content.contentType === "image" && error && (
            <div>Corrupt image. Please re-send in a new message</div>
          )}
          {message.content.contentType === "image" && !error && (
            <img
              src={message.content.value}
              onError={() => {
                setError(true);
              }}
            />
          )}
          {message.content.contentType !== "image" && (
            <div>{message.content.value}</div>
          )}
          <BottomDateStamp />
        </Content>
      </>
    );
  }
  const { exchange } = thread;
  if (!exchange) {
    return (
      <Content $isLeftAligned={isLeftAligned}>
        <SellerAvatar />
        <p>
          We couldn't retrieve your exchange to show the proposals, please try
          again
        </p>
      </Content>
    );
  }
  return (
    <Content $isLeftAligned={isLeftAligned}>
      <SellerAvatar />
      <Typography tag="h4" margin="0">
        {message.content.value.title}
      </Typography>
      <Typography tag="p" margin="0.25rem 0">
        {message.content.value.description}
      </Typography>
      <Typography
        margin="1.5rem 0 0.5rem 0"
        fontSize="1.25rem"
        fontWeight="600"
      >
        {message.content.value.proposals.length === 1
          ? "Proposal"
          : "Proposals"}
      </Typography>
      <Grid flexDirection="column" rowGap="1rem">
        {message.content.value.proposals.map((proposal) => {
          return (
            <Grid
              key={proposal.type}
              flexDirection="column"
              rowGap="0.25rem"
              alignItems="flex-start"
            >
              <Typography margin="0">{proposal.type}</Typography>
              <Grid>
                <Typography
                  color={colors.primary}
                  onClick={() =>
                    showModal("RESOLVE_DISPUTE", {
                      title: "Resolve dispute",
                      exchange,
                      proposal
                    })
                  }
                  cursor="pointer"
                >
                  Proposed refund amount: {proposal.percentageAmount}%
                </Typography>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
      <BottomDateStamp />
    </Content>
  );
}
