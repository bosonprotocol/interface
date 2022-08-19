import {
  FileContent,
  MessageType,
  ProposalContent,
  StringContent
} from "@bosonprotocol/chat-sdk/dist/cjs/util/v0.0.1/types";
import { BigNumber, utils } from "ethers";
import { ArrowRight, Check } from "phosphor-react";
import React, { forwardRef, ReactNode, useCallback } from "react";
import styled from "styled-components";

import UploadedFile from "../../../components/form/Upload/UploadedFile";
import ProposalTypeSummary from "../../../components/modal/components/Chat/components/ProposalTypeSummary";
import { PERCENTAGE_FACTOR } from "../../../components/modal/components/Chat/const";
import { useModal } from "../../../components/modal/useModal";
import Grid from "../../../components/ui/Grid";
import Typography from "../../../components/ui/Typography";
import { breakpoint } from "../../../lib/styles/breakpoint";
import { colors } from "../../../lib/styles/colors";
import { Exchange } from "../../../lib/utils/hooks/useExchanges";
import { MessageDataWithIsValid } from "../types";

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
  padding: 1.5rem 1rem 2.75rem 1rem;
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

const AvatarContainer = styled.div`
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

const StyledGrid = styled(Grid)`
  cursor: pointer;
  :hover * {
    color: ${colors.secondary};
    stroke: ${colors.secondary};
  }
`;

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
  exchange: Exchange;
  message: MessageDataWithIsValid;
  children: ReactNode;
  isLeftAligned: boolean;
}

const Message = forwardRef(
  (
    { message, children: Avatar, isLeftAligned, exchange }: Props,
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
    const isFileMessage = messageContentType === MessageType.File;
    const isProposalMessage = messageContentType === MessageType.Proposal;
    const { isValid } = message;

    if (!isValid) {
      return (
        <Content $isLeftAligned={isLeftAligned}>
          <AvatarContainer>{Avatar}</AvatarContainer>

          <div>
            {isFileMessage
              ? "Corrupt image."
              : isProposalMessage
              ? "Corrupt proposal"
              : "Corrupt message"}
            &nbsp; Please re-send in a new message
          </div>
          <BottomDateStamp isLeftAligned={isLeftAligned} message={message} />
        </Content>
      );
    }
    if (isRegularMessage) {
      const messageValue = messageContent as unknown as StringContent;

      return (
        <Content $isLeftAligned={isLeftAligned}>
          <AvatarContainer>{Avatar}</AvatarContainer>

          <div style={{ overflowWrap: "break-word" }}>{messageValue.value}</div>
          <BottomDateStamp isLeftAligned={isLeftAligned} message={message} />
        </Content>
      );
    }

    if (isFileMessage) {
      const imageValue = messageContent as unknown as FileContent;
      return (
        <Content $isLeftAligned={isLeftAligned}>
          <AvatarContainer>{Avatar}</AvatarContainer>

          <UploadedFile
            fileName={imageValue.value.fileName}
            color={isLeftAligned ? "white" : "grey"}
            fileSize={imageValue.value.fileSize}
            base64Content={imageValue.value.encodedContent}
            showSize={false}
          />
          <BottomDateStamp isLeftAligned={isLeftAligned} message={message} />
        </Content>
      );
    }

    if (isProposalMessage) {
      if (!exchange) {
        return (
          <Content $isLeftAligned={isLeftAligned}>
            <AvatarContainer>{Avatar}</AvatarContainer>

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
        <Content $isLeftAligned={isLeftAligned}>
          <AvatarContainer>{Avatar}</AvatarContainer>

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
                    .div(BigNumber.from(100 * PERCENTAGE_FACTOR))
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
                          {Number(proposal.percentageAmount) /
                            PERCENTAGE_FACTOR}
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
        <AvatarContainer>{Avatar}</AvatarContainer>
        Unsupported message
        <BottomDateStamp isLeftAligned={isLeftAligned} message={message} />
      </Content>
    );
  }
);

export default Message;
