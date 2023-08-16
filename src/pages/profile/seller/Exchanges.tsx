import Exchange from "../../../components/exchange/Exchange";
import { Spinner } from "../../../components/loading/Spinner";
import {
  Exchange as IExchange,
  useExchanges
} from "../../../lib/utils/hooks/useExchanges";
import { LoadingWrapper, ProductGridContainer } from "../ProfilePage.styles";

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
    return (
      <LoadingWrapper>
        <Spinner size={42} />
      </LoadingWrapper>
    );
  }

  if (isError) {
    return (
      <div data-testid="errorExchanges">
        There has been an error, please try again later...
      </div>
    );
  }

  if (!exchangesSeller?.length) {
    return <div>There are no exchanges</div>;
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
