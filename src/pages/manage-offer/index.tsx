import { manageOffer } from "@bosonprotocol/widgets-sdk";
import Layout from "@components/Layout";
import { CONFIG } from "@lib/config";
import { Offer } from "@lib/types/offer";
import { assert } from "@lib/utils/assert";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import OfferSelect from "./OfferSelect";

const WidgetContainer = styled.div`
  margin-top: 16px;
  margin-bottom: 64px;
`;

const Root = styled(Layout)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto 64px auto;
  overflow: hidden;
`;

const OfferDetails = styled.div`
  margin-top: 64px;
`;

const ManageOfferContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 20px;
  grid-column-gap: 20px;
  justify-content: space-between;
  padding-bottom: 24px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FormElement = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormLabel = styled.label`
  margin-bottom: 6px;
`;

const FormControl = styled.input`
  padding: 10px;
  border-radius: 6px;

  :disabled {
    cursor: not-allowed;
    color: lightgrey;
  }
`;

export default function ManageOffer() {
  const [offer, setOffer] = useState<Offer | undefined>();
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    assert(widgetRef.current);

    if (offer) {
      const widgetContainer = document.createElement("div");
      widgetRef.current.appendChild(widgetContainer);
      manageOffer(offer.id, CONFIG, widgetContainer);

      return () => widgetContainer.remove();
    }

    return;
  }, [offer]);

  return (
    <Root>
      <h1>Manage Offer</h1>
      <OfferSelect
        onReset={() => setOffer(undefined)}
        onOfferSelect={(offer) => setOffer(offer)}
      />
      {offer && (
        <OfferDetails>
          <h2>Offer Details</h2>
          <ManageOfferContainer>
            <FormElement>
              <FormLabel>Offer ID</FormLabel>
              <FormControl value={offer.id} disabled placeholder="..." />
            </FormElement>
            <FormElement>
              <FormLabel>Name</FormLabel>
              <FormControl
                value={offer.metadata?.name}
                disabled
                placeholder="..."
              />
            </FormElement>
            <FormElement>
              <FormLabel>Description</FormLabel>
              <FormControl
                value={offer.metadata?.description}
                disabled
                placeholder="..."
              />
            </FormElement>
          </ManageOfferContainer>
        </OfferDetails>
      )}
      <WidgetContainer ref={widgetRef} />
    </Root>
  );
}
