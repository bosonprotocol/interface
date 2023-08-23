import { colors } from "lib/styles/colors";
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
  color: ${colors.black};
  box-sizing: border-box;
  margin: 0;
  min-width: 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
`;

const EmptyWalletSubtitle = styled(Typography)`
  white-space: normal;
  text-align: center;
  margin-top: 8px;
  box-sizing: border-box;
  margin: 0;
  min-width: 0;
  font-weight: 400;
  font-size: 14px;
`;

type EmptyWalletContent = {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  actionText?: React.ReactNode;
  icon: React.ReactNode;
};
type EmptyWalletContentType = "token";
const EMPTY_WALLET_CONTENT: {
  [key in EmptyWalletContentType]: EmptyWalletContent;
} = {
  token: {
    title: "No tokens yet",
    subtitle: "Buy or transfer tokens to this wallet to get started.",
    icon: <EmptyTokensIcon />
  }
};

interface EmptyWalletContentProps {
  type?: EmptyWalletContentType;
}

const EmptyWalletContent = ({ type = "token" }: EmptyWalletContentProps) => {
  const content = EMPTY_WALLET_CONTENT[type];

  return (
    <>
      {content.icon}
      <EmptyWalletText>{content.title}</EmptyWalletText>
      <EmptyWalletSubtitle color="textSecondary">
        {content.subtitle}
      </EmptyWalletSubtitle>
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
