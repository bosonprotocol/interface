import dayjs from "dayjs";
import { useMemo } from "react";
import styled from "styled-components";

import { colors } from "../../../lib/styles/colors";
import { zIndex } from "../../../lib/styles/zIndex";
import { Thread } from "../types";

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
  message: Readonly<Thread["messages"][number]>;
}
export default function MessageSeparator({ message }: Props) {
  const calcDate = useMemo(() => {
    const currentDate = dayjs();
    const dateOfSending = dayjs(message.timestamp);

    return currentDate.diff(dateOfSending, "day");
  }, [message]);

  const separator = useMemo(() => {
    if (calcDate === 0) {
      return null;
    } else if (calcDate > 0 && calcDate <= 7) {
      const sentDate = new Date(message.timestamp); // TODO: change format back
      return (
        <Separator>
          <div>
            {/* {sentDate.toLocaleDateString("en-EN", {
              weekday: "long"
            })} */}
            {dayjs(sentDate).format("YYYY-MM-DD")}
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
  return <>{separator}</>;
}
