import { EmptyErrorMessage } from "components/error/EmptyErrorMessage";
import { LoadingMessage } from "components/loading/LoadingMessage";

import Exchange from "../../../components/exchange/Exchange";
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
      {exchangesSeller?.map((exchange) => (
        <Exchange
          key={exchange.id}
          {...exchange}
          exchange={exchange as IExchange}
        />
      ))}
    </ProductGridContainer>
  );
}
