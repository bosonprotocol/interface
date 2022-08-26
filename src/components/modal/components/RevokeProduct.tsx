import { Provider, RevokeButton } from "@bosonprotocol/react-kit";
import styled from "styled-components";
import { useSigner } from "wagmi";

import { CONFIG } from "../../../lib/config";
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
  exchange: any;
  exchangeId?: string;
  refetch: () => void;
}

export default function RevokeProduct({
  exchangeId,
  exchange,
  refetch
}: Props) {
  const { data: signer } = useSigner();
  const { hideModal } = useModal();

  return (
    <Grid flexDirection="column" alignItems="flex-start" gap="2rem">
      <OfferWrapper>
        <Grid justifyContent="space-between" alignItems="center" gap="1rem">
          <Grid justifyContent="flex-start" gap="1rem">
            <Image
              src={exchange?.offer?.metadata?.image}
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
                <b>{exchange?.offer?.metadata?.name}</b>
              </Typography>
              <SellerID
                offer={exchange?.offer}
                buyerOrSeller={exchange?.offer?.seller}
                withProfileImage
              />
            </div>
          </Grid>
          {exchange?.offer?.exchangeToken && (
            <Price
              address={exchange?.offer?.exchangeToken?.address}
              currencySymbol={exchange?.offer?.exchangeToken?.symbol}
              value={exchange?.offer?.price}
              decimals={exchange?.offer?.exchangeToken?.decimals}
              convert
              isExchange
            />
          )}
        </Grid>
      </OfferWrapper>
      <Grid flexDirection="column" gap="1rem">
        <div>
          <Typography tag="h6">What is Revoke?</Typography>
          <Typography tag="p" margin="0" style={{ display: "inline" }}>
            If you Revoke the rNFT you default on your commitment to exchange,
            at no fault of the buyer.
            <b>
              This will result in the slashing of the seller deposit and the
              return of the item price to the buyer.
            </b>
          </Typography>
        </div>
        <Break />
        <Grid>
          <Typography tag="p" margin="0">
            <b>Slashed Seller deposit</b>
          </Typography>
          {/* TODO: add proper values */}
          <Typography tag="p" margin="0">
            <b>-1.17 ETH</b>
            ($1350)
          </Typography>
        </Grid>
      </Grid>
      <Grid justifyContent="center">
        <RevokeButton
          exchangeId={exchangeId || 0}
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
