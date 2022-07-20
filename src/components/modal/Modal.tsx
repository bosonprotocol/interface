import { createPortal } from "react-dom";
import { IoIosClose } from "react-icons/io";
import styled from "styled-components";

import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import Button from "../ui/Button";
import { scrollStyles } from "../ui/styles";
import Typography from "../ui/Typography";

const Root = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: ${zIndex.Modal};
`;

const RootBG = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #00000080;
  z-index: ${zIndex.Modal - 1};
`;

const Wrapper = styled.div`
  position: relative;
  z-index: ${zIndex.Modal};
  color: ${colors.black};
  background-color: var(--primaryBgColor);
  border: var(--secondary);

  margin: 0;
  ${breakpoint.s} {
    margin: 4rem;
  }
  ${breakpoint.m} {
    margin: 4rem 8rem;
  }
  ${breakpoint.l} {
    margin: 4rem 10rem;
  }
  ${breakpoint.xl} {
    margin: 4rem 14rem;
  }
`;

const Title = styled(Typography)`
  position: relative;
  height: 4.25rem;
  padding: 1rem 2rem;
  margin: 0;
  padding-right: 8rem;
  border-bottom: 2px solid ${colors.border};
  > button {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translate(0%, -50%);
  }
`;

const Content = styled.div`
  padding: 2rem;

  max-height: calc(100vh - 4.25rem);

  ${breakpoint.s} {
    max-height: calc(100vh - 4rem - 4.25rem);
  }
  ${breakpoint.m} {
    max-height: calc(100vh - 8rem - 4.25rem);
  }
  overflow: auto;
  ${scrollStyles}
`;

interface Props {
  children: React.ReactNode;
  hideModal: () => void;
  title?: string;
}

export default function Modal({ children, hideModal, title = "modal" }: Props) {
  return createPortal(
    <Root data-testid="modal">
      <Wrapper>
        <Title tag="h3">
          {title}
          <Button theme="blank" onClick={hideModal}>
            <IoIosClose size={42} />
          </Button>
        </Title>
        <Content>{children}</Content>
      </Wrapper>
      <RootBG onClick={hideModal} />
    </Root>,
    document.body
  );
}
