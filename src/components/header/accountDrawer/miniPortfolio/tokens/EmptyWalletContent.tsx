import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Typography from "../../../../ui/Typography";
import { EmptyTokensIcon } from "./icons";

const EmptyWalletContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  height: 100%;
  width: 100%;
`;

const EmptyWalletText = styled(Typography)`
  white-space: normal;
  margin-top: 12px;
  text-align: center;
`;

const EmptyWalletSubtitle = styled(Typography)`
  white-space: normal;
  text-align: center;
  margin-top: 8px;
`;

const ActionButton = styled.button`
  background-color: ${({ theme }) => theme.accentAction};
  padding: 10px 24px;
  color: ${({ theme }) => theme.white};
  width: min-content;
  border: none;
  outline: none;
  border-radius: 12px;
  white-space: nowrap;
  cursor: pointer;
  margin-top: 20px;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
`;

type EmptyWalletContent = {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  actionText?: React.ReactNode;
  urlPath?: string;
  icon: React.ReactNode;
};
type EmptyWalletContentType = "token";
const EMPTY_WALLET_CONTENT: {
  [key in EmptyWalletContentType]: EmptyWalletContent;
} = {
  token: {
    title: "No tokens yet",
    subtitle: "Buy or transfer tokens to this wallet to get started.",
    actionText: "Explore tokens",
    urlPath: "/tokens",
    icon: <EmptyTokensIcon />
  }
};

interface EmptyWalletContentProps {
  type?: EmptyWalletContentType;
  onNavigateClick?: () => void;
}

const EmptyWalletContent = ({
  type = "token",
  onNavigateClick
}: EmptyWalletContentProps) => {
  const navigate = useNavigate();

  const content = EMPTY_WALLET_CONTENT[type];

  const actionButtonClick = useCallback(() => {
    if (content.urlPath) {
      onNavigateClick?.();
      navigate(content.urlPath);
    }
  }, [content.urlPath, navigate, onNavigateClick]);

  return (
    <>
      {content.icon}
      <EmptyWalletText>{content.title}</EmptyWalletText>
      <EmptyWalletSubtitle color="textSecondary">
        {content.subtitle}
      </EmptyWalletSubtitle>
      {content.actionText && (
        <ActionButton
          data-testid="nft-explore-nfts-button"
          onClick={actionButtonClick}
        >
          {content.actionText}
        </ActionButton>
      )}
    </>
  );
};

export const EmptyWalletModule = (props?: EmptyWalletContentProps) => {
  return (
    <EmptyWalletContainer>
      <EmptyWalletContent {...props} />
    </EmptyWalletContainer>
  );
};
