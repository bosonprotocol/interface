import styled from "styled-components";

import Typography from "../../components/ui/Typography";
import { breakpoint } from "../../lib/styles/breakpoint";

const StepWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  ${breakpoint.xxs} {
    gap: 1.5rem;
  }
  flex: 1;
  width: 100%;
  [data-testid="number"] {
    font-size: 3.5rem;
    font-weight: 600;
    line-height: 1.2;
    position: relative;
    color: var(--secondary);
    margin-bottom: 0.5rem !important;
    &:after {
      content: "";
      position: absolute;
      z-index: -1;
      width: 100%;
      height: 50%;
      top: 50%;
      left: 0%;
      background: var(--primary);
    }
  }
  [data-testid="step-title"] {
    all: unset;
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.5;
  }
  [data-testid="number"],
  [data-testid="step-title"],
  p {
    text-align: center;
    margin: 0;
  }
`;

interface IStep {
  children: string | React.ReactNode;
  number: number;
  title: string;
}

const Step: React.FC<IStep> = ({ children, number, title }) => {
  return (
    <StepWrapper>
      <Typography tag="div" data-testid="number">
        0{number}
      </Typography>
      <Typography tag="h2" data-testid="step-title">
        {title}
      </Typography>
      <Typography tag="p">{children}</Typography>
    </StepWrapper>
  );
};

export default Step;
