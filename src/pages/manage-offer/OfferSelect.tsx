import { getDefaultConfig, offers as offersApi } from "@bosonprotocol/core-sdk";
import { isAddress } from "@ethersproject/address";
import { useState } from "react";
import styled from "styled-components";

import { CONFIG } from "../../lib/config";

const OfferSelection = styled.div`
  display: flex;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  & + & {
    margin-left: 1.5rem;
  }
`;

const FormLabel = styled.label`
  margin-bottom: 6px;
`;

const FormControl = styled.input`
  padding: 10px;
  border-radius: 6px;
`;

const Select = styled.select`
  padding: 10px;
  border-radius: 6px;
`;

interface Props {
  onOfferSelect(offer: offersApi.RawOfferFromSubgraph): void;
  onReset(): void;
}

export default function OfferSelect({ onOfferSelect, onReset }: Props) {
  const [offers, setOffers] = useState<offersApi.RawOfferFromSubgraph[]>([]);
  const [sellerAddress, setSellerAddress] = useState("");

  function retrieveOffers(sellerAddress: string) {
    if (!sellerAddress) return;

    const { subgraphUrl } = getDefaultConfig({
      chainId: CONFIG.chainId
    });

    offersApi.subgraph
      .getAllOffersOfSeller(subgraphUrl, sellerAddress)
      .then(setOffers)
      .catch(console.log);
  }

  function onSellerAddressChange(address: string) {
    onReset();
    setSellerAddress(address);

    if (isAddress(address)) {
      retrieveOffers(address);
    } else {
      setOffers([]);
    }
  }

  function onOfferIdSelect(offerId: string) {
    if (!offerId) return;
    const offer = offers.find((ofr) => ofr.id === offerId);

    if (!offer) return;
    onOfferSelect(offer);
  }

  return (
    <OfferSelection>
      <InputContainer>
        <FormLabel>Seller Address</FormLabel>
        <FormControl
          value={sellerAddress}
          onChange={(e) => onSellerAddressChange(e.target.value)}
          name="title"
          type="text"
          placeholder="0x000000000000000000000000"
        />
      </InputContainer>
      <InputContainer>
        <FormLabel>Offer ID</FormLabel>
        <Select
          value=""
          onChange={(e) => onOfferIdSelect(e.target.value)}
          disabled={offers.length === 0}
        >
          {offers.length === 0 ? (
            <option value="">No offers found for given seller</option>
          ) : (
            <>
              <option value="">
                {offers.length === 1
                  ? `--- 1 Offer found ---`
                  : `--- ${offers.length} Offers found ---`}
              </option>
              {offers.map((offer) => (
                <option key={offer.id} value={offer.id}>
                  {offer.id} - {offer.metadata?.name}
                </option>
              ))}
            </>
          )}
        </Select>
      </InputContainer>
    </OfferSelection>
  );
}
