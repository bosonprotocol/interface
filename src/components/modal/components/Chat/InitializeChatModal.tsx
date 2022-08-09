import { ChatDots } from "phosphor-react";
import styled from "styled-components";
import { useAccount } from "wagmi";

import { colors } from "../../../../lib/styles/colors";
import { useChatContext } from "../../../../pages/chat/ChatProvider/ChatContext";
import ConnectButton from "../../../header/ConnectButton";
import Button from "../../../ui/Button";
import Grid from "../../../ui/Grid";
import Typography from "../../../ui/Typography";

const Info = styled(Grid)`
  display: flex;
  justify-content: space-between;
  background-color: ${colors.lightGrey};
  padding: 1.5rem;
`;

const Icon = styled(ChatDots)`
  fill: var(--secondary);
  path {
    stroke: var(--secondary);
  }
`;

const InfoMessage = styled(Typography)`
  font-family: Plus Jakarta Sans;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5rem;
  letter-spacing: 0px;
  text-align: left;
  flex: 1 1;
`;

export default function InitializeChatModal() {
  const { initialize, bosonXmtp } = useChatContext();
  const { address } = useAccount();

  return (
    <Info justifyContent="space-between" gap="2rem">
      <Grid justifyContent="flex-start" gap="1rem">
        <Icon size={24} />
        <InfoMessage>
          To proceed you must first initialize your chat client
        </InfoMessage>
      </Grid>
      <div>
        {address && !bosonXmtp ? (
          <Button
            type="button"
            theme="primaryInverse"
            onClick={() => {
              initialize();
            }}
          >
            Initialize
          </Button>
        ) : !address ? (
          <ConnectButton />
        ) : null}
      </div>
    </Info>
  );
}
