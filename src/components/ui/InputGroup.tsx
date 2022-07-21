import type { ReactNode } from "react";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import DetailPopper from "../detail/DetailPopper";
import Typography from "./Typography";

const InputGroupContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: baseline;
  > p {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 4px 0;
  }
  > div {
    button {
      color: ${colors.grey};
      svg {
        height: 12px;
        width: 12px;
      }
    }
  }
`;

const SubTitleContainer = styled.div`
  > p {
    font-size: 12px;
    color: ${colors.darkGrey};
    margin: 0 0 0 0;
  }
`;

interface Props {
  title: string;
  subTitle?: string;
  popper?: string;
  children?: ReactNode;
}

export default function InputGroup({
  title,
  subTitle,
  popper,
  children
}: Props) {
  return (
    <InputGroupContainer className="inputGroup">
      <TitleContainer>
        <Typography tag="p">{title}</Typography>
        {popper && <DetailPopper>{popper}</DetailPopper>}
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
