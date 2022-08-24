import { Provider, VoidButton } from "@bosonprotocol/react-kit";
import styled from "styled-components";
import { useSigner } from "wagmi";

import { CONFIG } from "../../../lib/config";
import { Offer } from "../../../lib/types/offer";
import { Break } from "../../detail/Detail.style";
import Price from "../../price/index";
import Grid from "../../ui/Grid";
import Image from "../../ui/Image";
import SellerID from "../../ui/SellerID";
import Typography from "../../ui/Typography";
import { useModal } from "../useModal";

const OfferWrapper = styled.div`
  width: 100%;
`;

interface Props {
  offer: Offer;
  offerId?: string;
  refetch: () => void;
}

export default function VoidProduct({ offerId, offer, refetch }: Props) {
  const { data: signer } = useSigner();
  const { hideModal } = useModal();

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
      <Grid flexDirection="column" gap="1rem">
        <div>
          <Typography tag="h6">What is Void?</Typography>
          <Typography tag="p" margin="0">
            By voiding this item, it will no longer be possible for buyers to
            commit to this product however any existing exchanges will be
            unaffected.
          </Typography>
        </div>
        <Break />
        <Grid>
          <Typography tag="p" margin="0">
            <b>Quantity</b>&nbsp;&nbsp;(available/total)
          </Typography>
          <Typography tag="p" margin="0">
            <b>
              {offer.quantityAvailable}/{offer.quantityInitial}
            </b>
          </Typography>
        </Grid>
      </Grid>
      <Grid justifyContent="center">
        <VoidButton
          variant="secondary"
          offerId={offerId || 0}
          chainId={CONFIG.chainId}
          onError={(args) => {
            console.error("onError", args);
          }}
          onPendingSignature={() => {
            console.error("onPendingSignature");
          }}
          onSuccess={(_args, res) => {
            console.log(_args, res);
            hideModal();
            refetch();
          }}
          web3Provider={signer?.provider as Provider}
        />
      </Grid>
    </Grid>
  );
}
