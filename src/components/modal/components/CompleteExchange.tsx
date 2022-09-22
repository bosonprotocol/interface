import {
  BatchCompleteButton,
  CompleteButton,
  Provider
} from "@bosonprotocol/react-kit";
import { BigNumberish } from "ethers";
import { useCallback, useMemo } from "react";
import styled from "styled-components";
import { useSigner } from "wagmi";

import { CONFIG } from "../../../lib/config";
import { Offer } from "../../../lib/types/offer";
import { Exchange } from "../../../lib/utils/hooks/useExchanges";
import { Break } from "../../detail/Detail.style";
import Price from "../../price/index";
import Grid from "../../ui/Grid";
import Image from "../../ui/Image";
import SellerID from "../../ui/SellerID";
import Typography from "../../ui/Typography";
import { useModal } from "../useModal";

const CompleteExchangeWrapper = styled.div`
  width: 100%;
`;
const OverflowCompleteExchangeWrapper = styled.div`
  max-height: 15rem;
  width: calc(100% + 2rem);
  overflow-y: auto;
  overflow-x: hidden;

  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-right: 1rem;
`;
const DescriptionInfo = styled.div`
  width: 100%;
`;

interface OfferProps {
  offer: Offer;
}

function CompleteOffer({ offer }: OfferProps) {
  return (
    <>
      <CompleteExchangeWrapper>
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
          </div>
        </Grid>
      </CompleteExchangeWrapper>
    </>
  );
}

interface Props {
  exchange?: Exchange;
  exchanges?: Array<Exchange | null>;
  refetch: () => void;
}
export default function CompleteExchange({
  exchange,
  exchanges,
  refetch
}: Props) {
  const { data: signer } = useSigner();
  const { hideModal } = useModal();

  const handleSuccess = useCallback(() => {
    hideModal();
    refetch();
  }, [hideModal, refetch]);

  const exchangeIds = useMemo(() => {
    return exchanges?.map((exchange) => exchange?.id as BigNumberish) || [];
  }, [exchanges]);

  return (
    <Grid flexDirection="column" alignItems="flex-start" gap="2rem">
      <Grid flexDirection="column" gap="1rem">
        <DescriptionInfo>
          <Typography tag="h6">What is Complete?</Typography>
          <Typography tag="p" margin="0">
            Exchange completion releases the funds involved in the exchange(s)
            to the relevant parties.
          </Typography>
        </DescriptionInfo>
      </Grid>
      <Break />
      {exchange && <CompleteOffer offer={exchange.offer} />}
      {exchanges && exchanges.length && (
        <OverflowCompleteExchangeWrapper>
          {exchanges?.map(
            (e: Exchange | null) =>
              e !== null && (
                <CompleteOffer
                  key={`exchange_offers_${e?.id}`}
                  offer={e.offer}
                />
              )
          )}
        </OverflowCompleteExchangeWrapper>
      )}
      <Break />
      {exchange?.id && (
        <Grid justifyContent="center">
          <CompleteButton
            variant="primary"
            exchangeId={exchange.id}
            envName={CONFIG.envName}
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
      {exchanges && exchanges.length && (
        <Grid justifyContent="center">
          <BatchCompleteButton
            variant="primary"
            exchangeIds={exchangeIds}
            envName={CONFIG.envName}
            onError={(args) => {
              // TODO: add to notification system
              console.error("onError", args);
            }}
            onPendingSignature={() => {
              console.error("onPendingSignature");
            }}
            onSuccess={handleSuccess}
            web3Provider={signer?.provider as Provider}
          >
            Batch Complete
          </BatchCompleteButton>
        </Grid>
      )}
    </Grid>
  );
}
