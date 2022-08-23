import { ChatDots, Warning } from "phosphor-react";
import styled from "styled-components";
import { useAccount } from "wagmi";

import { colors } from "../../../../../lib/styles/colors";
import { useChatContext } from "../../../../../pages/chat/ChatProvider/ChatContext";
import ConnectButton from "../../../../header/ConnectButton";
import Button from "../../../../ui/Button";
import Grid from "../../../../ui/Grid";
import Typography from "../../../../ui/Typography";

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

const IconError = styled(Warning)`
  color: ${colors.froly};
`;

interface Props {
  isError?: boolean;
}
export default function InitializeChat({ isError = false }: Props) {
  const { initialize, bosonXmtp } = useChatContext();
  const { address } = useAccount();

  const isInitializeButtonVisible =
    (address && !bosonXmtp) || (isError && address && !bosonXmtp);

  return (
    <Info justifyContent="space-between" gap="2rem">
      <Grid justifyContent="flex-start" gap="1rem">
        {isError ? <IconError size={24} /> : <Icon size={24} />}
        <Typography
          $fontSize="1rem"
          fontWeight="600"
          lineHeight="1.5rem"
          flex="1 1"
          letterSpacing="0"
          text-align="left"
        >
          {isError
            ? `Chat initialization failed, please try again`
            : `To proceed you must first initialize your chat client`}
        </Typography>
      </Grid>
      <div>
        {isInitializeButtonVisible ? (
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
