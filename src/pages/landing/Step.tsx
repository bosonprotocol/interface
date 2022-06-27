import styled from "styled-components";

import Grid from "../../components/ui/Grid";
import Typography from "../../components/ui/Typography";

const StepWrapper = styled(Grid)``;

interface IStep {
  children: string | React.ReactNode;
  number: number;
  title: string;
}

const Step: React.FC<IStep> = ({ children, number, title }) => {
  return (
    <StepWrapper flexDirection="column">
      <Typography tag="h1">{number}</Typography>
      <Typography tag="h3">{title}</Typography>
      <Typography tag="p">{children}</Typography>
    </StepWrapper>
  );
};

export default Step;
