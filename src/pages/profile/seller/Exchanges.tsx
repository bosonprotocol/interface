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

export default function Exchanges({ sellerId }: Props) {
  const {
    data: exchangesSeller,
    isLoading,
    isError,
    refetch
  } = useExchanges(
    { ...orderProps, disputed: null, sellerId },
    { enabled: !!sellerId }
  );

  if (isLoading) {
    return <div>Loading...</div>;
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
