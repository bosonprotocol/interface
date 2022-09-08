import { Provider, VoidButton } from "@bosonprotocol/react-kit";
import { BigNumberish } from "ethers";
import { useCallback, useState } from "react";
import styled from "styled-components";
import { useSigner } from "wagmi";

import { CONFIG } from "../../../lib/config";
import { Offer } from "../../../lib/types/offer";
import { useCoreSDK } from "../../../lib/utils/useCoreSdk";
import { Break } from "../../detail/Detail.style";
import Price from "../../price/index";
import Button from "../../ui/Button";
import Grid from "../../ui/Grid";
import Image from "../../ui/Image";
import SellerID from "../../ui/SellerID";
import Typography from "../../ui/Typography";
import { useModal } from "../useModal";

const OfferWrapper = styled.div`
  width: 100%;
`;
const OverflowOfferWrapper = styled.div`
  max-height: 15rem;
  width: calc(100% + 2rem);
  overflow-y: auto;
  overflow-x: hidden;

  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-right: 1rem;
`;

interface OfferProps {
  offer: Offer;
  single?: boolean;
}

function VoidProductOffer({ offer, single = false }: OfferProps) {
  return (
    <>
      <OfferWrapper>
        <Grid justifyContent="space-between" alignItems="center" gap="1rem">
          <Grid justifyContent="flex-start" gap="1rem">
            <Image
              src={offer?.metadata?.image}
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
          <div>
            {offer.exchangeToken && (
              <Price
                currencySymbol={offer.exchangeToken.symbol}
                value={offer.price}
                decimals={offer.exchangeToken.decimals}
              />
            )}
            {!single && (
              <Typography
                tag="p"
                justifyContent="flex-end"
                margin="0"
                gap="0.5rem"
              >
                Qty:
                <b>
                  {offer.quantityAvailable}/{offer.quantityInitial}
                </b>
              </Typography>
            )}
          </div>
        </Grid>
      </OfferWrapper>
      {single && (
        <Grid flexDirection="column" gap="1rem">
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
      )}
    </>
  );
}

interface Props {
  offer?: Offer;
  offers?: Array<Offer | null>;
  offerId?: string;
  refetch: () => void;
}
export default function VoidProduct({
  offerId,
  offer,
  offers,
  refetch
}: Props) {
  const coreSdk = useCoreSDK();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: signer } = useSigner();
  const { hideModal } = useModal();

  const handleSuccess = useCallback(() => {
    hideModal();
    refetch();
    setIsLoading(false);
  }, [hideModal, refetch, setIsLoading]);

  const handleBatchVoid = useCallback(async () => {
    const offerIds: BigNumberish[] =
      offers?.map((offer) => offer?.id as BigNumberish) || [];
    try {
      setIsLoading(true);
      const txResponse = await coreSdk.voidOfferBatch(offerIds);
      await txResponse.wait(offerIds.length);
    } catch (error) {
      console.error("onError", error);
    } finally {
      handleSuccess();
    }
  }, [offers, coreSdk, handleSuccess]);

  return (
    <Grid flexDirection="column" alignItems="flex-start" gap="2rem">
      <Grid flexDirection="column" gap="1rem">
        <div>
          <Typography tag="h6">What is Void?</Typography>
          <Typography tag="p" margin="0">
            {offers && offers.length
              ? "By voiding these items, it will no longer be possible for buyers to commit to these products however any existing exchanges will be unaffected."
              : "By voiding this item, it will no longer be possible for buyers to commit to this product however any existing exchanges will be unaffected."}
          </Typography>
        </div>
      </Grid>
      <Break />
      {offer && <VoidProductOffer offer={offer} single />}
      {offers && offers.length && (
        <OverflowOfferWrapper>
          {offers?.map(
            (o: Offer | null) =>
              o !== null && (
                <VoidProductOffer key={`offers_${o?.id}`} offer={o} />
              )
          )}
        </OverflowOfferWrapper>
      )}
      <Break />
      {offer && (
        <Grid justifyContent="center">
          <VoidButton
            variant="secondary"
            offerId={offerId || 0}
            chainId={CONFIG.chainId}
            onError={(args) => {
              // TODO: add to notification system
              console.error("onError", args);
            }}
            onPendingSignature={() => {
              console.error("onPendingSignature");
            }}
            onSuccess={handleSuccess}
            web3Provider={signer?.provider as Provider}
          />
        </Grid>
      )}
      {offers && offers.length && (
        <Grid justifyContent="center">
          <Button
            variant="secondary"
            isLoading={isLoading}
            disabled={isLoading}
            onClick={handleBatchVoid}
          >
            Batch Void
          </Button>
        </Grid>
      )}
    </Grid>
  );
}
