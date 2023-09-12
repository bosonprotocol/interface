import Typography from "components/ui/Typography";
import { InterfaceTrade, QuoteMethod } from "state/routing/types";
import { isUniswapXTrade } from "state/routing/utils";

import UniswapXRouterLabel from "./UniswapXRouterLabel";

export default function RouterLabel({ trade }: { trade: InterfaceTrade }) {
  if (isUniswapXTrade(trade)) {
    return (
      <UniswapXRouterLabel>
        <Typography>Uniswap X</Typography>
      </UniswapXRouterLabel>
    );
  }
  if (
    trade.quoteMethod === QuoteMethod.CLIENT_SIDE ||
    trade.quoteMethod === QuoteMethod.CLIENT_SIDE_FALLBACK
  ) {
    return <Typography>Uniswap Client</Typography>;
  }
  return <Typography>Uniswap API</Typography>;
}
