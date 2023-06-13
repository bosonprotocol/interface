import React from "react";

import { BosonRoutes, SellerCenterRoutes } from "../../../lib/routing/routes";
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
        title="Web3 Commerce Store"
        text="Create your decentralized Web3 commerce store and customise it to match your brand's identity."
        to={BosonRoutes.CreateStorefront}
        time="15 min"
      />
      <SalesChannelCard
        title="Metaverse Store"
        text="Easily create your own decentralized Metaverse store in DCL. Set up your store on your own DCL space or on Boson Boulevard."
        to={SellerCenterRoutes.DCL}
        time="2 - 4 days"
      />
    </GridContainer>
  );
};
