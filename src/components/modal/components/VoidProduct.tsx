import { Provider, VoidButton } from "@bosonprotocol/react-kit";
import { useSigner } from "wagmi";

import { CONFIG } from "../../../lib/config";
import Grid from "../../ui/Grid";
import Typography from "../../ui/Typography";

interface Props {
  offerId?: string;
}

export default function VoidProduct({ offerId }: Props) {
  console.log(offerId);
  const { data: signer } = useSigner();

  return (
    <Grid flexDirection="column" alignItems="flex-start">
      <Typography tag="h4" style={{ margin: 0 }}>
        Void offer
      </Typography>
      <VoidButton
        offerId={offerId || 0}
        chainId={CONFIG.chainId}
        onError={(args) => {
          // TODO: handle error
          console.error("onError", args);
        }}
        onPendingSignature={() => {
          console.error("onPendingSignature");
        }}
        onSuccess={(_args, res) => {
          // TODO: refetch data
          console.log(_args, res);
        }}
        web3Provider={signer?.provider as Provider}
      />
    </Grid>
  );
}
