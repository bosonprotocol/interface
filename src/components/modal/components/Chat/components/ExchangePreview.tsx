import { getOfferDetails } from "lib/utils/offer/getOfferDetails";
import styled from "styled-components";

import { useBreakpoints } from "../../../../../lib/utils/hooks/useBreakpoints";
import { Exchange } from "../../../../../lib/utils/hooks/useExchanges";
import Price from "../../../../price";
import { Grid } from "../../../../ui/Grid";
import Image from "../../../../ui/Image";
import SellerID from "../../../../ui/SellerID";
import Video from "../../../../ui/Video";

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

const ImageWrapper = styled.div`
  position: relative;
  min-width: 4rem;
  align-self: center;
`;

const StyledGrid = styled(Grid)`
  position: relative;
`;

export default function ExchangePreview({ exchange }: Props) {
  const { offer } = exchange;
  const { isLteS } = useBreakpoints();
  const animationUrl = exchange?.offer.metadata?.animationUrl || "";
  const { mainImage } = getOfferDetails(exchange.offer.metadata);
  return (
    <StyledGrid
      justifyContent="space-between"
      flexDirection={isLteS ? "column" : "row"}
    >
      <Grid flexDirection={isLteS ? "column" : "row"}>
        <ImageWrapper>
          {animationUrl ? (
            <Video
              src={animationUrl}
              videoProps={{
                muted: true,
                loop: true,
                autoPlay: true
              }}
              componentWhileLoading={() => (
                <Image src={mainImage} alt="Exchange image" />
              )}
            />
          ) : (
            <Image src={mainImage} alt="Exchange image" />
          )}
        </ImageWrapper>
        <Grid
          flexDirection="column"
          alignItems="flex-start"
          margin="1rem"
          gap="0.5rem"
        >
          <Name>{offer.metadata?.name}</Name>
          <SellerID
            offerMetadata={offer.metadata}
            accountToShow={offer?.seller}
            justifyContent="flex-start"
            withProfileImage
            onClick={() => {
              // TODO: add on click exchange preview
              return null;
            }}
          />
        </Grid>
      </Grid>
      <StyledPrice
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
