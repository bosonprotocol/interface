import { subgraph } from "@bosonprotocol/react-kit";
import { EmptyErrorMessage } from "components/error/EmptyErrorMessage";
import { LoadingMessage } from "components/loading/LoadingMessage";

import Exchange from "../../../components/exchange/Exchange";
import { useLensProfilesPerSellerIds } from "../../../lib/utils/hooks/lens/profile/useGetLensProfiles";
import {
  Exchange as IExchange,
  useExchanges
} from "../../../lib/utils/hooks/useExchanges";
import { ProductGridContainer } from "../ProfilePage.styles";
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
    isLoading,
    isError
  } = useExchanges(
    {
      ...orderProps,
      disputed: null,
      sellerId,
      state: subgraph.ExchangeState.Redeemed
    },
    { enabled: !!sellerId }
  );

  const seller = exchangesSeller?.[0]?.seller;
  const sellerLensProfilePerSellerId = useLensProfilesPerSellerIds(
    { sellers: seller ? [seller] : [] },
    { enabled: !!seller }
  );

  if (isLoading) {
    return <LoadingMessage />;
  }

  if (isError) {
    return (
      <EmptyErrorMessage
        title="Error"
        message="There has been an error, please try again later..."
      />
    );
  }

  if (!exchangesSeller?.length) {
    return (
      <EmptyErrorMessage
        title="No exchanges"
        message="There are no redemptions yet, redeem at least one exchange first"
      />
    );
  }

  return (
    <ProductGridContainer
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
          sellerLensProfile={sellerLensProfilePerSellerId?.get(sellerId)}
        />
      ))}
    </ProductGridContainer>
  );
}
