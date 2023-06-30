import { ChatDots, Warning } from "phosphor-react";
import styled from "styled-components";
import { useAccount } from "wagmi";

import { colors } from "../../../../../lib/styles/colors";
import { useEthersSigner } from "../../../../../lib/utils/hooks/ethers/useEthersSigner";
import { useChatContext } from "../../../../../pages/chat/ChatProvider/ChatContext";
import ConnectButton from "../../../../header/ConnectButton";
import { Spinner } from "../../../../loading/Spinner";
import BosonButton from "../../../../ui/BosonButton";
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
  message?: string;
}
export default function InitializeChat({ isError = false, message }: Props) {
  const signer = useEthersSigner();
  const { initialize, bosonXmtp, isInitializing } = useChatContext();
  const { address } = useAccount();

  const isInitializeButtonVisible =
    (address && !bosonXmtp) || (isError && address && !bosonXmtp);

  const isDisabled = isInitializing || !signer;
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
            : message ??
              `To proceed you must first initialize your chat client`}
        </Typography>
      </Grid>
      <div>
        {isInitializeButtonVisible ? (
          <BosonButton
            type="button"
            variant="accentFill"
            style={
              isDisabled
                ? {}
                : {
                    color: colors.white
                  }
            }
            disabled={isDisabled}
            onClick={() => {
              initialize();
            }}
          >
            {isInitializing ? (
              <>
                Initializing
                <Spinner />
              </>
            ) : (
              <>Initialize</>
            )}
          </BosonButton>
        ) : !address ? (
          <ConnectButton />
        ) : null}
      </div>
    </Info>
  );
}
