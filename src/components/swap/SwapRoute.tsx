import { useWeb3React } from "@web3-react/core";
import { Separator } from "components/icons";
import { LoadingRows } from "components/loader/styled";
import RoutingDiagram from "components/routingDiagram/RoutingDiagram";
import Column from "components/ui/column";
import Typography from "components/ui/Typography";
import { SUPPORTED_GAS_ESTIMATE_CHAIN_IDS } from "lib/constants/chains";
import getRoutingDiagramEntries from "lib/utils/getRoutingDiagramEntries";
import useAutoRouterSupported from "lib/utils/hooks/useAutoRouterSupported";
import { ClassicTrade } from "state/routing/types";

import RouterLabel from "../routerLabel";

export default function SwapRoute({
  trade,
  syncing
}: {
  trade: ClassicTrade;
  syncing: boolean;
}) {
  const { chainId } = useWeb3React();
  const autoRouterSupported = useAutoRouterSupported();

  const routes = getRoutingDiagramEntries(trade);

  const gasPrice =
    // TODO(WEB-2022)
    // Can `trade.gasUseEstimateUSD` be defined when `chainId` is not in `SUPPORTED_GAS_ESTIMATE_CHAIN_IDS`?
    trade.gasUseEstimateUSD &&
    chainId &&
    SUPPORTED_GAS_ESTIMATE_CHAIN_IDS.includes(chainId)
      ? trade.gasUseEstimateUSD === 0
        ? "<$0.01"
        : "$" + trade.gasUseEstimateUSD.toFixed(2)
      : undefined;

  return (
    <Column gap="md">
      <RouterLabel trade={trade} />
      <Separator />
      {syncing ? (
        <LoadingRows>
          <div style={{ width: "100%", height: "30px" }} />
        </LoadingRows>
      ) : (
        <RoutingDiagram
          currencyIn={trade.inputAmount.currency}
          currencyOut={trade.outputAmount.currency}
          routes={routes}
        />
      )}
      {autoRouterSupported && (
        <>
          <Separator />
          {syncing ? (
            <LoadingRows>
              <div style={{ width: "100%", height: "15px" }} />
            </LoadingRows>
          ) : (
            <Typography color="textSecondary">
              {gasPrice ? (
                <>Best price route costs ~{gasPrice} in gas.</>
              ) : null}{" "}
              <>
                This route optimizes your total output by considering split
                routes, multiple hops, and the gas cost of each step.
              </>
            </Typography>
          )}
        </>
      )}
    </Column>
  );
}
