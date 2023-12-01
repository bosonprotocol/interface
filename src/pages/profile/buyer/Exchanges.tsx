import { EmptyErrorMessage } from "components/error/EmptyErrorMessage";
import { LoadingMessage } from "components/loading/LoadingMessage";
import { useMemo } from "react";

import Exchange from "../../../components/exchange/Exchange";
import { useLensProfilesPerSellerIds } from "../../../lib/utils/hooks/lens/profile/useGetLensProfiles";
import {
  Exchange as IExchange,
  useExchanges
} from "../../../lib/utils/hooks/useExchanges";
import { ProductGridContainer } from "../ProfilePage.styles";

interface Props {
  buyerId: string;
}

const orderProps = {
  orderBy: "committedDate",
  orderDirection: "desc"
} as const;

export default function Exchanges({ buyerId }: Props) {
  const {
    data: exchangesBuyer,
    isLoading,
    isError
  } = useExchanges(
    { ...orderProps, disputed: null, buyerId },
    { enabled: !!buyerId }
  );

  const sellers = useMemo(() => {
    const sellersMap = (exchangesBuyer || []).reduce((map, exchange) => {
      const seller = exchange.seller;
      if (!map.has(seller.id)) {
        map.set(seller.id, seller);
      }
      return map;
    }, new Map());
    return Array.from(sellersMap.values());
  }, [exchangesBuyer]);

  const sellerLensProfilePerSellerId = useLensProfilesPerSellerIds(
    { sellers },
    { enabled: sellers?.length }
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

  if (!exchangesBuyer?.length) {
    return (
      <EmptyErrorMessage
        title="No exchanges"
        message="There are no exchanges yet, commit to at least one product first"
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
      {exchangesBuyer?.map((exchange) => {
        return (
          <Exchange
            key={exchange.id}
            {...exchange}
            exchange={exchange as IExchange}
            sellerLensProfile={sellerLensProfilePerSellerId?.get(
              exchange.seller.id
            )}
          />
        );
      })}
    </ProductGridContainer>
  );
}
