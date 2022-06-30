import { useMemo } from "react";
import { generatePath } from "react-router-dom";
import styled from "styled-components";

import { Modal } from "../../components/modal/Modal";
import { UrlParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";

const ModalContent = styled.div`
  margin: -35px 5% 0 5%;
`;

const Title = styled.p`
  font-size: 1.8rem;
  text-align: center;
  margin: 0;
`;

const Body = styled.p`
  text-align: center;
  margin-bottom: 22px;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const CloseButton = styled.button.attrs({ type: "button" })`
  border-color: white; //${colors.green}; //var(--secondary);
  background: transparent;
  color: white; //${colors.green}; //var(--secondary);
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  padding: 5px 10px;
  cursor: pointer;
`;

const ViewExchangeButton = styled.button.attrs({ type: "button" })`
  background-color: ${colors.green}; //var(--secondary);
  color: var(--accentDark);
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

  :disabled {
    cursor: not-allowed;
    background-color: ${colors.grey};
  }
`;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  exchangeId: string;
}

export default function CreatedExchangeModal({
  isOpen,
  onClose,
  exchangeId
}: Props) {
  const navigate = useKeepQueryParamsNavigate();
  const styles = useMemo(
    () => ({
      width: "30%"
    }),
    []
  );
  return (
    <Modal isOpen onClose={() => onClose()} $styles={styles}>
      <ModalContent>
        <Title> {exchangeId ? "Commit Successful" : "Error"}</Title>
        <Body>
          {exchangeId
            ? "A new exchange has been created"
            : "Something has gone wrong"}
        </Body>
        <Buttons>
          <CloseButton onClick={onClose}>Close</CloseButton>
          <ViewExchangeButton
            disabled={!exchangeId}
            onClick={() =>
              navigate({
                pathname: generatePath(BosonRoutes.Exchange, {
                  [UrlParameters.exchangeId]: exchangeId
                })
              })
            }
          >
            View exchange
          </ViewExchangeButton>
        </Buttons>
      </ModalContent>
    </Modal>
  );
}
