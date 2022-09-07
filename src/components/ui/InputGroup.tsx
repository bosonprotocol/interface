import type { ReactNode } from "react";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import Tooltip from "../tooltip/Tooltip";
import Typography from "./Typography";

const InputGroupContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: baseline;
  > p {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 0.25rem 0;
  }
  > div {
    button {
      color: ${colors.grey};
      svg {
        height: 0.75rem;
        width: 0.75rem;
      }
    }
  }
`;

const SubTitleContainer = styled.div`
  > p {
    font-size: 0.75rem;
    color: ${colors.darkGrey};
    margin: 0 0 0.75rem 0;
  }
`;

interface Props {
  title: string;
  subTitle?: string;
  popper?: string;
  children?: ReactNode;
  style?: React.CSSProperties;
}

export default function InputGroup({
  title,
  subTitle,
  popper,
  children,
  style
}: Props) {
  return (
    <InputGroupContainer className="inputGroup" style={style}>
      <TitleContainer>
        <Typography tag="p">{title}</Typography>
        {popper && <Tooltip content={popper} size={14} />}
      </TitleContainer>
      {subTitle && (
        <SubTitleContainer>
          <Typography tag="p">{subTitle}</Typography>
        </SubTitleContainer>
      )}
      {children}
    </InputGroupContainer>
  );
}
