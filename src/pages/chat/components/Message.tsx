import {
  AcceptProposalContent,
  EscalateDisputeContent,
  FileContent,
  MessageData,
  MessageType,
  ProposalContent,
  StringContent,
  StringIconContent
} from "@bosonprotocol/chat-sdk/dist/esm/util/v0.0.1/definitions";
import { subgraph } from "@bosonprotocol/react-kit";
import { Check, Clock } from "phosphor-react";
import React, {
  cloneElement,
  forwardRef,
  ReactElement,
  ReactNode
} from "react";
import styled from "styled-components";

import UploadedFile from "../../../components/form/Upload/UploadedFile";
import ProposalTypeSummary from "../../../components/modal/components/Chat/components/ProposalTypeSummary";
import { Grid } from "../../../components/ui/Grid";
import { Typography } from "../../../components/ui/Typography";
import { breakpoint } from "../../../lib/styles/breakpoint";
import { colors } from "../../../lib/styles/colors";
import { Exchange } from "../../../lib/utils/hooks/useExchanges";
import { MessageDataWithInfo } from "../types";
import { ICONS } from "./conversation/const";
import ErrorMessageBoundary from "./ErrorMessageBoundary";

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

const ProposalStatus = styled.div`
  display: flex;
  align-items: center;
  height: 1.875rem;
  letter-spacing: 0.5px;
  line-height: 16px;
  font-weight: 600;
  font-size: 0.75rem;
  padding: 0.1rem 1rem;
  border-radius: 20px;
  &:first-letter {
    text-transform: uppercase;
  }
  background: ${colors.orange};
  color: ${colors.white};
`;

const Bottom = styled.div<{ $isLeftAligned: boolean }>`
  position: absolute;
  bottom: 1rem;
  right: ${({ $isLeftAligned }) => ($isLeftAligned ? "auto" : "1rem")};
  left: ${({ $isLeftAligned }) => ($isLeftAligned ? "1rem" : "auto")};
  display: flex;
  gap: 0.5rem;
  align-items: center;
  * {
    color: ${({ $isLeftAligned }) =>
      $isLeftAligned ? colors.lightGrey : colors.darkGrey};
    font-size: 0.75rem;
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
    <Bottom $isLeftAligned={isLeftAligned}>
      <span>
        {sentDate.getHours().toString().padStart(2, "0")}:
        {sentDate.getMinutes().toString().padStart(2, "0")}
      </span>
      {message.isPending && <Clock size={14} />}
    </Bottom>
  );
};

interface Props {
  exchange: Exchange;
  dispute: subgraph.DisputeFieldsFragment | undefined;
  message: MessageDataWithInfo;
  children: ReactNode;
  isLeftAligned: boolean;
  lastReceivedProposal: MessageData | null;
  lastSentProposal: MessageData | null;
}

const Message = forwardRef(
  (
    {
      message,
      children: Avatar,
      isLeftAligned,
      exchange,
      dispute,
      lastReceivedProposal,
      lastSentProposal
    }: Props,
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <StyledContent ref={ref} $isLeftAligned={isLeftAligned}>
        <AvatarContainer>{Avatar}</AvatarContainer>
        <ErrorMessageBoundary>
          <MessageContent
            dispute={dispute}
            message={message}
            exchange={exchange}
            isLeftAligned={isLeftAligned}
            lastReceivedProposal={lastReceivedProposal}
            lastSentProposal={lastSentProposal}
          />
        </ErrorMessageBoundary>
        <BottomDateStamp isLeftAligned={isLeftAligned} message={message} />
      </StyledContent>
    );
  }
);

const IconMessage = ({
  icon,
  heading,
  body
}: {
  icon: ReactElement | undefined;
  heading: string;
  body: string;
}) => {
  return (
    <Grid gap="1.5rem">
      {icon &&
        cloneElement(icon, {
          size: 75
        })}
      <Grid flexDirection="column" gap="1rem" alignItems="flex-start">
        {heading && (
          <Typography fontSize="1.25rem" fontWeight="600">
            {heading}
          </Typography>
        )}
        {body && <Typography>{body}</Typography>}
      </Grid>
    </Grid>
  );
};

type MessageContentProps = Pick<
  Props,
  | "message"
  | "isLeftAligned"
  | "exchange"
  | "dispute"
  | "lastReceivedProposal"
  | "lastSentProposal"
>;

const MessageContent = ({
  message,
  isLeftAligned,
  exchange,
  dispute,
  lastReceivedProposal,
  lastSentProposal
}: MessageContentProps) => {
  const isEscalated = !!dispute?.escalatedDate;

  const messageContent = message.data.content;
  const messageContentType = message.data.contentType;
  const isRegularMessage =
    typeof message.data.content.value === "string" &&
    messageContentType === MessageType.String;
  const isFileMessage = messageContentType === MessageType.File;
  const isProposalMessage = messageContentType === MessageType.Proposal;
  const isCounterProposalMessage =
    messageContentType === MessageType.CounterProposal;
  const isAcceptProposalMessage =
    messageContentType === MessageType.AcceptProposal;
  const isEscalateDisputeMessage =
    messageContentType === MessageType.EscalateDispute;
  const isStringIconMessage = messageContentType === MessageType.StringIcon;
  const { isValid, isPending } = message;

  if (!isValid && !isPending) {
    return (
      <div>
        {isFileMessage
          ? "Corrupt image."
          : isProposalMessage
          ? "Corrupt proposal"
          : "Corrupt message"}
        &nbsp; Please re-send in a new message
      </div>
    );
  }

  if (isRegularMessage) {
    const messageValue = messageContent as unknown as StringContent;

    return (
      <div style={{ overflowWrap: "break-word", whiteSpace: "break-spaces" }}>
        {messageValue.value}
      </div>
    );
  }

  if (isFileMessage) {
    const imageValue = messageContent as unknown as FileContent;
    return (
      <UploadedFile
        fileName={imageValue.value.fileName}
        color={isLeftAligned ? "white" : "grey"}
        fileSize={imageValue.value.fileSize}
        base64Content={imageValue.value.encodedContent}
        showSize={false}
      />
    );
  }

  if (isProposalMessage || isCounterProposalMessage) {
    if (!exchange) {
      return (
        <p>
          We couldn't retrieve your exchange to show the proposals, please try
          again
        </p>
      );
    }
    const proposalContent = message.data.content as ProposalContent;
    const messageContent = proposalContent.value;
    const proposals = messageContent.proposals;
    let isLastProposal = false;
    if (lastReceivedProposal || lastSentProposal) {
      const lastReceivedProposalContent = lastReceivedProposal?.data
        ?.content as ProposalContent | undefined;
      const lastSentProposalContent = lastSentProposal?.data?.content as
        | ProposalContent
        | undefined;
      const signatures = [
        ...(lastReceivedProposalContent?.value?.proposals?.map((proposal) =>
          proposal.signature.toLowerCase()
        ) || []),
        ...(lastSentProposalContent?.value?.proposals?.map((proposal) =>
          proposal.signature.toLowerCase()
        ) || [])
      ];
      isLastProposal =
        [
          lastReceivedProposal?.timestamp || 0,
          lastSentProposal?.timestamp || 0
        ].includes(message.timestamp) &&
        proposals.some((proposal) =>
          signatures.includes(proposal.signature.toLowerCase())
        );
    }
    const isRaisingADispute = !!messageContent.disputeContext?.length;
    return (
      <>
        <Grid justifyContent="space-between" alignItems="flex-start" gap="1rem">
          <Typography tag="h4" margin="0">
            {messageContent.title}
          </Typography>
          {!!proposals.length && (isEscalated || !isLastProposal) && (
            <ProposalStatus>
              <strong>Expired</strong>
            </ProposalStatus>
          )}
        </Grid>
        {isRaisingADispute ? (
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
                  <Check size={16} style={{ flex: "0 0 auto" }} />
                  <span>{reason}</span>
                </Grid>
              );
            })}
            <Typography margin="1.5rem 0 0 0" fontSize="1rem" fontWeight="600">
              Additional Information
            </Typography>
            <Typography tag="p" margin="1rem 0rem">
              {messageContent.description}
            </Typography>
          </>
        ) : (
          <Typography tag="p" margin="1rem 0rem">
            {messageContent.description}
          </Typography>
        )}

        {proposals.length ? (
          <Grid flexDirection="column" alignItems="flex-start" marginTop="1rem">
            {isLeftAligned ? (
              <>
                {proposals.map((proposal) => {
                  return (
                    <Grid
                      key={proposal.type}
                      flexDirection="column"
                      rowGap="0.25rem"
                      alignItems="flex-start"
                    >
                      <Typography
                        margin="0 0 0.5rem 0"
                        fontSize="1rem"
                        fontWeight="600"
                      >
                        Proposal
                      </Typography>
                      <ProposalTypeSummary
                        key={proposal.type}
                        exchange={exchange}
                        proposal={proposal}
                      />
                    </Grid>
                  );
                })}
              </>
            ) : (
              <>
                <Typography
                  margin="0 0 0.5rem 0"
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
        ) : null}
      </>
    );
  }

  if (isAcceptProposalMessage) {
    const acceptProposalContent = message.data.content as AcceptProposalContent;
    const {
      value: { icon: iconId, heading, body, title, proposal }
    } = acceptProposalContent;
    const icon = ICONS[iconId as keyof typeof ICONS];
    return (
      <Grid flexDirection="column" alignItems="flex-start">
        <Typography tag="h4" margin="0">
          {title}
        </Typography>
        <Typography margin="1.5rem 0 0.5rem 0" fontSize="1rem" fontWeight="600">
          Resolution Summary
        </Typography>
        <ProposalTypeSummary
          key={proposal.type}
          exchange={exchange}
          proposal={proposal}
        />
        <div style={{ marginTop: "2rem" }}>
          <IconMessage icon={icon} heading={heading} body={body} />
        </div>
      </Grid>
    );
  }
  if (isEscalateDisputeMessage) {
    const escalateDisputeContent = message.data
      .content as EscalateDisputeContent;
    const {
      value: {
        icon: iconId,
        heading,
        body,
        title,
        description,
        disputeResolverInfo
      }
    } = escalateDisputeContent;
    const icon = ICONS[iconId as keyof typeof ICONS];
    return (
      <Grid flexDirection="column" alignItems="flex-start">
        <Typography tag="h4" margin="0">
          {title}
        </Typography>
        <Typography tag="p" margin="1rem 0rem">
          {description}
        </Typography>
        <Grid
          flexDirection="column"
          alignItems="flex-start"
          marginBottom="1rem"
        >
          <Typography fontWeight="600">
            Dispute resolver contact information
          </Typography>
          {disputeResolverInfo.map(({ label, value }) => {
            return (
              <Grid key={`${label}-${value}`} gap="0.5rem">
                <Check size={16} style={{ flex: "0 0 auto" }} />
                <Grid justifyContent="flex-start">
                  {label}: {value}
                </Grid>
              </Grid>
            );
          })}
        </Grid>
        <IconMessage icon={icon} heading={heading} body={body} />
      </Grid>
    );
  }

  if (isStringIconMessage) {
    const stringIconContent = message.data.content as StringIconContent;
    const {
      value: { icon: iconId, heading, body }
    } = stringIconContent;
    const icon = ICONS[iconId as keyof typeof ICONS];
    return <IconMessage icon={icon} heading={heading} body={body} />;
  }

  return <>Unsupported message</>;
};

export default Message;
