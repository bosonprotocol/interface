import styled from "styled-components";

import priorityHight from "../../../assets/priority_high.png";
import Grid from "../../ui/Grid";
import Typography from "../../ui/Typography";

const StyledGrid = styled(Grid)`
  padding-bottom: 2.5rem;
`;

const ImgContainer = styled.div`
  width: 6.75rem;
  height: 6.75rem;
  text-align: center;
  background: rgba(244, 106, 106, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
`;

const Img = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

export default function ChatInitializationFailed() {
  return (
    <StyledGrid flexDirection="column" alignItems="center">
      <ImgContainer>
        <Img src={priorityHight} alt="Error" />
      </ImgContainer>
      <Typography
        tag="h5"
        style={{
          fontSize: "2.25rem",
          margin: 0
        }}
      >
        Chat initialization Failed
      </Typography>
      <Typography
        tag="p"
        style={{
          fontSize: "0.875rem",
          margin: "1rem auto"
        }}
      >
        Please try again
      </Typography>
    </StyledGrid>
  );
}
