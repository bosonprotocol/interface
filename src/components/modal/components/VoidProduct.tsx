import { Provider, VoidButton } from "@bosonprotocol/react-kit";
import styled from "styled-components";
import { useSigner } from "wagmi";

import { CONFIG } from "../../../lib/config";
import { Offer } from "../../../lib/types/offer";
import Price from "../../price/index";
import Grid from "../../ui/Grid";
import Image from "../../ui/Image";
import SellerID from "../../ui/SellerID";
import Typography from "../../ui/Typography";

const OfferWrapper = styled.div`
  width: 100%;
`;

interface Props {
  offer: Offer;
  offerId?: string;
}

export default function VoidProduct({ offer, offerId }: Props) {
  const { data: signer } = useSigner();

  return (
    <Grid flexDirection="column" alignItems="flex-start" gap="2rem">
      <OfferWrapper>
        <Grid justifyContent="space-between" alignItems="center" gap="1rem">
          <Grid justifyContent="flex-start" gap="1rem">
            <Image
              src={offer.metadata?.image}
              showPlaceholderText={false}
              style={{
                width: "4rem",
                height: "4rem",
                paddingTop: "0%",
                fontSize: "0.75rem"
              }}
            />
            <div>
              <Typography tag="h5">
                <b>{offer.metadata?.name}</b>
              </Typography>
              <SellerID
                offer={offer}
                buyerOrSeller={offer?.seller}
                withProfileImage
              />
            </div>
          </Grid>
          {offer.exchangeToken && (
            <Price
              address={offer.exchangeToken.address}
              currencySymbol={offer.exchangeToken.symbol}
              value={offer.price}
              decimals={offer.exchangeToken.decimals}
              convert
              isExchange
            />
          )}
        </Grid>
      </OfferWrapper>
      <div>
        <Typography tag="h6" style={{ margin: 0 }}>
          What is Void?
        </Typography>
        <Typography tag="p" style={{ margin: 0 }}>
          By voiding a Product offer you remove the available quantity of items
          from the marketplace.
        </Typography>
      </div>
      <Grid justifyContent="center">
        <VoidButton
          offerId={offerId || 0}
          chainId={CONFIG.chainId}
          onError={(args) => {
            // TODO: handle error
            console.error("onError", args);
          }}
          onPendingSignature={() => {
            console.error("onPendingSignature");
          }}
          onSuccess={(_args, res) => {
            // TODO: refetch data
            console.log(_args, res);
          }}
          web3Provider={signer?.provider as Provider}
        />
      </Grid>
    </Grid>
  );
}
