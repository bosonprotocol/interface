import Exchange from "../../../components/exchange/Exchange";
import { Spinner } from "../../../components/loading/Spinner";
import GridContainer from "../../../components/ui/GridContainer";
import {
  Exchange as IExchange,
  useExchanges
} from "../../../lib/utils/hooks/useExchanges";
import { LoadingWrapper } from "../ProfilePage.styles";

interface Props {
  buyerId: string;
}

const orderProps = {
  orderBy: "committedDate",
  orderDirection: "desc"
} as const;

export default function Exchanges({ buyerId }: Props) {
  const {
    data: exchangesSeller,
    isLoading,
    isError,
    refetch
  } = useExchanges(
    { ...orderProps, disputed: null, buyerId },
    { enabled: !!buyerId }
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
    <GridContainer
      itemsPerRow={{
        xs: 1,
        s: 2,
        m: 3,
        l: 3,
        xl: 3
      }}
    >
      {exchangesSeller?.map((exchange) => {
        return (
          <Exchange
            key={exchange.id}
            {...exchange}
            exchange={exchange as IExchange}
            reload={refetch}
          />
        );
      })}
    </GridContainer>
  );
}
