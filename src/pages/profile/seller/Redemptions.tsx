import { ExchangeState } from "@bosonprotocol/core-sdk/dist/cjs/subgraph";

import Exchange from "../../../components/exchange/Exchange";
import GridContainer from "../../../components/ui/GridContainer";
import {
  Exchange as IExchange,
  useExchanges
} from "../../../lib/utils/hooks/useExchanges";
interface Props {
  sellerId: string;
}

const orderProps = {
  orderBy: "committedDate",
  orderDirection: "desc"
} as const;

export default function Redemptions({ sellerId }: Props) {
  const {
    data: exchangesSeller,
    isLoading: isLoadingSeller,
    isError: isErrorSeller,
    refetch
  } = useExchanges(
    { ...orderProps, disputed: null, sellerId, state: ExchangeState.Redeemed },
    { enabled: !!sellerId }
  );

  if (isLoadingSeller) {
    return <div>Loading...</div>;
  }

  if (isErrorSeller) {
    return (
      <div data-testid="errorExchanges">
        There has been an error, please try again later...
      </div>
    );
  }

  if (!exchangesSeller?.length) {
    return <div>There are no redemptions</div>;
  }

  return (
    <GridContainer
      itemsPerRow={{
        xs: 1,
        s: 2,
        m: 3,
        l: 3,
        xl: 3
      }}
    >
      {exchangesSeller?.map((exchange) => (
        <Exchange
          key={exchange.id}
          {...exchange}
          exchange={exchange as IExchange}
          reload={refetch}
        />
      ))}
    </GridContainer>
  );
}
