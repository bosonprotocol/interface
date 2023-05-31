import React from "react";

import GridContainer from "../../ui/GridContainer";
import { SalesChannelCard } from "./SalesChannelCard";

export const SalesChannels: React.FC = () => {
  return (
    <GridContainer
      itemsPerRow={{
        xs: 1,
        s: 2,
        m: 3,
        l: 3,
        xl: 3
      }}
    >
      <SalesChannelCard
        title="Custom Storefront"
        text="Create your custom storefront in the seller dApp and tweak it to match your company's identity."
        to="CreateStorefront"
        time="15 min"
      />
      <SalesChannelCard
        title="DCL"
        text="Setup your store and sell on your own land in DCL or send a request to sell on BOSON's land."
        to="DCL"
        time="2 - 4 days"
      />
    </GridContainer>
  );
};
