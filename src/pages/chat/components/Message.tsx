import {
  ImageContent,
  MessageType,
  ProposalContent
} from "@bosonprotocol/chat-sdk/dist/cjs/util/definitions";
import { Image as AccountImage } from "@davatar/react";
import { BigNumber, utils } from "ethers";
import { ArrowRight, Check, ImageSquare } from "phosphor-react";
import React, { forwardRef, ReactNode, useCallback } from "react";
import styled from "styled-components";

import ProposalTypeSummary from "../../../components/modal/components/Chat/components/ProposalTypeSummary";
import { useModal } from "../../../components/modal/useModal";
import Grid from "../../../components/ui/Grid";
import Typography from "../../../components/ui/Typography";
import { breakpoint } from "../../../lib/styles/breakpoint";
import { colors } from "../../../lib/styles/colors";
import { DeepReadonly } from "../../../lib/types/helpers";
import { validateMessage } from "../../../lib/utils/chat/message";
import { Thread } from "../types";

const width = "31.625rem";
type StyledContentProps = { $isLeftAligned: boolean };
const StyledContent = styled.div<StyledContentProps>`
  position: relative;
  background-color: ${({ $isLeftAligned }) =>
    $isLeftAligned ? colors.black : colors.white};
  color: ${({ $isLeftAligned }) =>
    $isLeftAligned ? colors.white : colors.black};
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border: 0.063rem solid ${colors.border};
  margin-right: 2.5rem;
  margin-left: 2.5rem;
  margin-top: 3rem;
  padding: 1.5rem 1rem 3.75rem 1rem;
  min-width: 6.25rem;
  max-width: ${width};
  &:after {
    position: absolute;
    content: "";
    border-top: 16px solid
      ${({ $isLeftAligned }) => ($isLeftAligned ? colors.black : colors.white)};
    border-right: 16px solid transparent;
    border-right: ${({ $isLeftAligned }) =>
      $isLeftAligned ? "none" : "16px solid transparent"};
    border-left: ${({ $isLeftAligned }) =>
      $isLeftAligned ? "16px solid transparent" : "none"};
    top: -1px;
    ${breakpoint.m} {
      top: -0.063rem;
    }
    right: ${({ $isLeftAligned }) => ($isLeftAligned ? "auto" : "-1rem")};
    left: ${({ $isLeftAligned }) => ($isLeftAligned ? "-1rem" : "auto")};
  }
  h4 {
    font-weight: 600;
    font-size: 1.25rem;
  }
  h5 {
    font-size: 1rem;
    font-weight: 600;
  }
  img {
    max-width: 15.625rem;
    object-fit: contain;
  }
  div:nth-of-type(2) {
    font-size: 1.1875rem;
    ${breakpoint.m} {
      font-size: 1rem;
    }
  }
`;

const Avatar = styled.div`
  position: absolute;
  top: -1.25rem;
  left: 1rem;
  img {
    width: 34px;
    height: 34px;
  }
`;

const DateStamp = styled.div<{ $isLeftAligned: boolean }>`
  position: absolute;
  bottom: 1rem;
  right: ${({ $isLeftAligned }) => ($isLeftAligned ? "auto" : "1rem")};
  left: ${({ $isLeftAligned }) => ($isLeftAligned ? "1rem" : "auto")};
  font-size: 0.75rem;
  color: ${({ $isLeftAligned }) =>
    $isLeftAligned ? colors.lightGrey : colors.darkGrey};
`;

const AttachmentContainer = styled.div`
  position: relative;
  display: flex;
  cursor: pointer;
  align-items: center;
  padding: 1rem;
  border: 2px solid ${colors.darkGrey};
  margin-bottom: 0.3rem;
  svg:nth-of-type(2) {
    position: absolute;
    right: 1rem;
  }
`;

const StyledGrid = styled(Grid)`
  cursor: pointer;
  :hover * {
    color: ${colors.secondary};
    stroke: ${colors.secondary};
  }
`;

const SellerAvatar = ({
  isLeftAligned,
  children,
  thread
}: {
  isLeftAligned: Props["isLeftAligned"];
  children: Props["children"];
  thread: Props["thread"];
}) => {
  return isLeftAligned ? (
    <Avatar>{children}</Avatar>
  ) : (
    <Avatar>
      <AccountImage size={32} address={thread.exchange?.buyer.wallet} />
    </Avatar>
  );
};

const BottomDateStamp = ({
  isLeftAligned,
  message
}: {
  isLeftAligned: Props["isLeftAligned"];
  message: Props["message"];
}) => {
  const sentDate = new Date(message.timestamp);
  return (
    <DateStamp $isLeftAligned={isLeftAligned}>
      {sentDate.getHours().toString().padStart(2, "0")}:
      {sentDate.getMinutes().toString().padStart(2, "0")}
    </DateStamp>
  );
};

interface Props {
  thread: Thread;
  message: DeepReadonly<Thread["messages"][number]>;
  children: ReactNode;
  isLeftAligned: boolean;
}

const Message = forwardRef(
  (
    { message, children, isLeftAligned, thread }: Props,
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    const Content = useCallback(
      ({
        children,
        ...props
      }: { children: ReactNode } & StyledContentProps &
        React.HTMLAttributes<HTMLDivElement>) => {
        return (
          <StyledContent {...props} ref={ref}>
            {children}
          </StyledContent>
        );
      },
      [ref]
    );
    const { showModal } = useModal();
    const messageContent = message.data.content;
    const messageContentType = message.data.contentType;
    const isRegularMessage =
      typeof message.data.content.value === "string" &&
      messageContentType === MessageType.String;
    const isImageWithMetadataMessage = messageContentType === MessageType.Image;
    const isProposalMessage = messageContentType === MessageType.Proposal;

    const isValid = validateMessage(message);
    if (!isValid) {
      return (
        <Content $isLeftAligned={isLeftAligned}>
          <SellerAvatar isLeftAligned={isLeftAligned} thread={thread}>
            {children}
          </SellerAvatar>
          <p>
            {isImageWithMetadataMessage
              ? "Corrupt image."
              : isProposalMessage
              ? "Corrupt proposal"
              : "Corrupt message"}
            &nbsp; Please re-send in a new message
          </p>
        </Content>
      );
    }
    if (isRegularMessage) {
      return (
        <Content $isLeftAligned={isLeftAligned}>
          <SellerAvatar isLeftAligned={isLeftAligned} thread={thread}>
            {children}
          </SellerAvatar>
          <div style={{ overflowWrap: "break-word" }}>
            {message.data.content.value}
          </div>
          <BottomDateStamp isLeftAligned={isLeftAligned} message={message} />
        </Content>
      );
    }

    if (isImageWithMetadataMessage) {
      const imageValue = messageContent as unknown as ImageContent;
      return (
        <Content $isLeftAligned={isLeftAligned}>
          <SellerAvatar isLeftAligned={isLeftAligned} thread={thread}>
            {children}
          </SellerAvatar>
          <AttachmentContainer>
            <a
              style={{ display: "flex", color: "inherit" }}
              href={imageValue.value.encodedContent}
              download={imageValue.value.fileName}
            >
              <ImageSquare size={23} />
              <Typography fontSize="1rem" fontWeight="400">
                &nbsp;&nbsp; {imageValue.value.fileName}
              </Typography>
            </a>
          </AttachmentContainer>
          <BottomDateStamp isLeftAligned={isLeftAligned} message={message} />
        </Content>
      );
    }

    if (isProposalMessage) {
      const { exchange } = thread;
      if (!exchange) {
        return (
          <Content $isLeftAligned={isLeftAligned}>
            <SellerAvatar isLeftAligned={isLeftAligned} thread={thread}>
              {children}
            </SellerAvatar>
            <p>
              We couldn't retrieve your exchange to show the proposals, please
              try again
            </p>
          </Content>
        );
      }
      const proposalContent = message.data
        .content as unknown as ProposalContent;
      const messageContent = proposalContent.value;
      const isRaisingADispute = !!messageContent.disputeContext?.length;
      return (
        <Content $isLeftAligned={isLeftAligned} style={{ width }}>
          <SellerAvatar isLeftAligned={isLeftAligned} thread={thread}>
            {children}
          </SellerAvatar>
          <Typography tag="h4" margin="0">
            {messageContent.title}
          </Typography>
          {isRaisingADispute && (
            <>
              <Typography
                margin="1.5rem 0 0.5rem 0"
                fontSize="1rem"
                fontWeight="600"
              >
                Dispute Category
              </Typography>
              {messageContent.disputeContext.map((reason) => {
                return (
                  <Grid justifyContent="flex-start" gap="0.5rem" key={reason}>
                    <Check size={16} />
                    <span>{reason}</span>
                  </Grid>
                );
              })}
              <Typography
                margin="1.5rem 0 0.5rem 0"
                fontSize="1rem"
                fontWeight="600"
              >
                Additional information
              </Typography>
            </>
          )}
          <Typography tag="p" margin="0.25rem 1rem 0rem 0rem">
            {messageContent.description}
          </Typography>

          <Grid flexDirection="column" alignItems="flex-start">
            {isLeftAligned ? (
              <>
                <Typography
                  margin="1.5rem 0 0.5rem 0"
                  fontSize="1.25rem"
                  fontWeight="600"
                >
                  {messageContent.proposals.length === 1
                    ? "Proposal"
                    : "Proposals"}
                </Typography>
                {messageContent.proposals.map((proposal) => {
                  const { offer } = exchange;
                  const refundAmount = BigNumber.from(offer.price)
                    .div(BigNumber.from(100))
                    .mul(BigNumber.from(proposal.percentageAmount));

                  const formattedRefundAmount = utils.formatUnits(
                    refundAmount,
                    Number(offer.exchangeToken.decimals)
                  );
                  return (
                    <Grid
                      key={proposal.type}
                      flexDirection="column"
                      rowGap="0.25rem"
                      alignItems="flex-start"
                    >
                      <Typography margin="0">{proposal.type}</Typography>
                      <StyledGrid
                        justifyContent="space-between"
                        onClick={() =>
                          showModal("RESOLVE_DISPUTE", {
                            title: "Resolve dispute",
                            exchange,
                            proposal
                          })
                        }
                      >
                        <Typography color={colors.primary} cursor="pointer">
                          Proposed refund amount: {formattedRefundAmount}{" "}
                          {offer.exchangeToken.symbol} (
                          {proposal.percentageAmount}
                          %)
                        </Typography>
                        <ArrowRight color={colors.primary} />
                      </StyledGrid>
                    </Grid>
                  );
                })}
              </>
            ) : (
              <>
                <Typography
                  margin="1.5rem 0 0.5rem 0"
                  fontSize="1rem"
                  fontWeight="600"
                >
                  Resolution Proposal
                </Typography>
                {messageContent.proposals.map((proposal) => (
                  <ProposalTypeSummary
                    key={proposal.type}
                    exchange={exchange}
                    proposal={proposal}
                  />
                ))}
              </>
            )}
          </Grid>
          <BottomDateStamp isLeftAligned={isLeftAligned} message={message} />
        </Content>
      );
    }

    return (
      <Content $isLeftAligned={isLeftAligned}>
        <SellerAvatar isLeftAligned={isLeftAligned} thread={thread}>
          {children}
        </SellerAvatar>
        Unsupported message
        <BottomDateStamp isLeftAligned={isLeftAligned} message={message} />
      </Content>
    );
  }
);

export default Message;
