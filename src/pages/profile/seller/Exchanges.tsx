import { ProductCardSkeleton } from "@bosonprotocol/react-kit";
import { EmptyErrorMessage } from "components/error/EmptyErrorMessage";
import { useMemo } from "react";

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

export default function Exchanges({ sellerId }: Props) {
  const {
    data: exchangesSeller,
    isLoading,
    isError
  } = useExchanges(
    { ...orderProps, disputed: null, sellerId },
    { enabled: !!sellerId }
  );
  const sellers = useMemo(() => {
    const sellersMap = (exchangesSeller || []).reduce((map, exchange) => {
      const seller = exchange.seller;
      if (!map.has(seller.id)) {
        map.set(seller.id, seller);
      }
      return map;
    }, new Map());
    return Array.from(sellersMap.values());
  }, [exchangesSeller]);

  const sellerLensProfilePerSellerId = useLensProfilesPerSellerIds(
    { sellers },
    { enabled: Boolean(sellers?.length) }
  );

  if (isError) {
    return (
      <EmptyErrorMessage
        title="Error"
        message="There has been an error, please try again later..."
      />
    );
  }

  if (!isLoading && !exchangesSeller?.length) {
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
      {isLoading
        ? new Array(12).fill(0).map((_, index) => {
            return <ProductCardSkeleton key={index} />;
          })
        : exchangesSeller?.map((exchange) => (
            <Exchange
              key={exchange.id}
              {...exchange}
              exchange={exchange as IExchange}
              sellerLensProfile={sellerLensProfilePerSellerId?.get(
                exchange.seller.id
              )}
            />
          ))}
    </ProductGridContainer>
  );
}
