import { useEffect } from "react";
import { useAccount } from "wagmi";

import { useChatContext } from "../../../pages/chat/ChatProvider/ChatContext";
import Grid from "../../ui/Grid";
import Typography from "../../ui/Typography";
import { useModal } from "../useModal";
import InitializeChat from "./Chat/components/InitializeChat";

export default function ReinitializeChatModal() {
  const { hideModal } = useModal();
  const { address } = useAccount();
  const { bosonXmtp } = useChatContext();

  useEffect(() => {
    if (!address) {
      return;
    }
    if (bosonXmtp) {
      hideModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, bosonXmtp]);

  return (
    <Grid flexDirection="column" alignItems="flex-start" gap="1rem">
      <Typography>
        Good news! We have upgraded our chat so before proceeding you must
        re-initialize it again. This modal will not be shown again.
      </Typography>
      <InitializeChat />
    </Grid>
  );
}
