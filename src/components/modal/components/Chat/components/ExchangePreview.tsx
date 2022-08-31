import styled from "styled-components";

import { useBreakpoints } from "../../../../../lib/utils/hooks/useBreakpoints";
import { Exchange } from "../../../../../lib/utils/hooks/useExchanges";
import Price from "../../../../price";
import Grid from "../../../../ui/Grid";
import Image from "../../../../ui/Image";
import SellerID from "../../../../ui/SellerID";

interface Props {
  exchange: Exchange;
}

const Name = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
`;

const StyledPrice = styled(Price)<{ isLteS: boolean }>`
  > div {
    align-items: flex-end;
  }

  small {
    margin: 0 !important;
    > * {
      font-size: 0.75rem;
    }
  }
  position: ${({ isLteS }) => isLteS && "absolute"};
  right: ${({ isLteS }) => isLteS && "0"};
  bottom: ${({ isLteS }) => isLteS && "2.8125rem"};
`;

const StyledImage = styled(Image)<{ isLteS: boolean }>`
  all: unset;
  img {
    all: unset;
    width: 80px;
    width: ${({ isLteS }) => isLteS && "calc(100% + 4rem)"};
    margin: ${({ isLteS }) => isLteS && "-2rem 0 0 -2rem"};
  }
`;

const StyledGrid = styled(Grid)`
  position: relative;
`;

export default function ExchangePreview({ exchange }: Props) {
  const { offer } = exchange;
  const { isLteS } = useBreakpoints();
  return (
    <StyledGrid
      justifyContent="space-between"
      flexDirection={isLteS ? "column" : "row"}
    >
      <Grid flexDirection={isLteS ? "column" : "row"}>
        <StyledImage
          isLteS={isLteS}
          src={offer.metadata.imageUrl}
          alt="Exchange image"
        />
        <Grid
          flexDirection="column"
          alignItems="flex-start"
          margin="1rem"
          gap="0.5rem"
        >
          <Name>{offer.metadata.name}</Name>
          <SellerID
            offer={offer}
            buyerOrSeller={offer?.seller}
            justifyContent="flex-start"
            withProfileImage
            onClick={() => {
              console.log("on click exchange preview");
            }}
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
        isLteS={isLteS}
      />
    </StyledGrid>
  );
}
