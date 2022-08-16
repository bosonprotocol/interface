import React, { Fragment } from "react";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import { ReactComponent as Dot } from "./timeline-dot.svg";
import { ReactComponent as VerticalLineSVG } from "./timeline-line.svg";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translateX(-48%);
`;

const DotWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  [data-status] {
    position: absolute;
    left: 1.5rem;
    top: -0.5rem;
    width: max-content;
  }
`;

const VerticalLine = styled(VerticalLineSVG).attrs({
  height: "48px",
  viewBox: "0 0 2 48"
})``;

const StyledStatus = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 21px;
`;

const StyledDate = styled.span`
  color: ${colors.darkGrey};
  font-size: 0.75rem;
`;

interface Props {
  timesteps: { text: string; date?: string }[];
}
export default function Timeline({ timesteps }: Props) {
  return (
    <Container>
      {timesteps.map((step) => {
        return (
          <Fragment key={`${step.text}-${step.date}`}>
            <DotWrapper>
              <Dot />
              <div data-status>
                <StyledStatus>{step.text}</StyledStatus>
                <br />
                <StyledDate>{step.date}</StyledDate>
              </div>
            </DotWrapper>
            <VerticalLine />
          </Fragment>
        );
      })}
    </Container>
  );
}
