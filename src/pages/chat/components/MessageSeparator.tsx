import dayjs from "dayjs";
import { useMemo } from "react";
import styled from "styled-components";

import { Grid } from "../../../components/ui/Grid";
import { CONFIG } from "../../../lib/config";
import { colors } from "../../../lib/styles/colors";
import { zIndex } from "../../../lib/styles/zIndex";
import { Thread } from "../types";

const Separator = styled.div`
  width: 100%;
  position: relative;
  z-index: ${zIndex.Default};
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
      background-color: ${colors.greyLight};
      left: -0.625rem;
      height: 100%;
      width: 0.625rem;
      content: "";
    }
    &:after {
      position: absolute;
      background-color: ${colors.greyLight};
      right: -0.625rem;
      height: 100%;
      width: 0.625rem;
      content: "";
    }
  }
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
`;
interface Props {
  message: Readonly<Thread["messages"][number]>;
}

export default function MessageSeparator({ message }: Props) {
  const { diffInDays, sentDate } = useMemo(() => {
    const currentDate = dayjs().startOf("day");
    const sentDate = dayjs(message.timestamp).startOf("day");

    return { diffInDays: currentDate.diff(sentDate, "day"), sentDate };
  }, [message]);

  const separator = useMemo(() => {
    if (diffInDays === 0) {
      return (
        <Separator>
          <div>{`Today`}</div>
          <div></div>
        </Separator>
      );
    } else if (diffInDays === 1) {
      return (
        <Separator>
          <div>{`Yesterday`}</div>
          <div></div>
        </Separator>
      );
    } else {
      return (
        <Separator>
          <div>{sentDate.format(CONFIG.dateFormat)}</div>
          <div></div>
        </Separator>
      );
    }
  }, [sentDate, diffInDays]);
  return <Grid margin="0.5rem auto">{separator}</Grid>;
}
