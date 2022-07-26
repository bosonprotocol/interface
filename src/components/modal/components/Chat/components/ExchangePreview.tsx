import styled from "styled-components";

import { Exchange } from "../../../../../lib/utils/hooks/useExchanges";
import Price from "../../../../price";
import Grid from "../../../../ui/Grid";
import SellerID from "../../../../ui/SellerID";

interface Props {
  exchange: Exchange;
}

const Name = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
`;

const StyledPrice = styled(Price)`
  > div {
    align-items: flex-end;
  }

  small {
    margin: 0 !important;
    > * {
      font-size: 0.75rem;
    }
  }
`;

export default function ExchangePreview({ exchange }: Props) {
  const { offer } = exchange;
  return (
    <Grid justifyContent="space-between" padding="2rem 0">
      <Grid>
        <img src={offer.metadata.imageUrl} alt="Exchange url" width={80} />
        <Grid
          flexDirection="column"
          alignItems="flex-start"
          margin="1rem"
          gap="0.5rem"
        >
          <Name>{offer.metadata.name}</Name>
          <SellerID
            seller={offer?.seller}
            offerName={offer.metadata.name || ""}
            justifyContent="flex-start"
            withProfileImage
          />
        </Grid>
      </Grid>
      <StyledPrice
        address={offer.exchangeToken.address}
        currencySymbol={offer.exchangeToken.symbol}
        value={offer.price}
        decimals={offer.exchangeToken.decimals}
        isExchange
        convert
      />
    </Grid>
  );
}
