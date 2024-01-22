import React from "react";
import { Link } from "react-router-dom";

import { BosonRoutes, SellerCenterRoutes } from "../../../lib/routing/routes";
import { useSellers } from "../../../lib/utils/hooks/useSellers";
import { Channels } from "../../modal/components/SalesChannelsModal/form";
import Button from "../../ui/Button";
import { GridContainer } from "../../ui/GridContainer";
import { SalesChannelCard } from "./SalesChannelCard";

type SalesChannelsProps = {
  sellerId: string;
};
export const SalesChannels: React.FC<SalesChannelsProps> = ({ sellerId }) => {
  const { data: sellers } = useSellers(
    { id: sellerId },
    { enabled: !!sellerId }
  );
  const salesChannels = sellers?.[0]?.metadata?.salesChannels;
  const hasStoreFrontSaved = salesChannels?.some(
    (sl) => sl.tag === Channels["Custom storefront"]
  );
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
        {...(hasStoreFrontSaved && {
          secondCta: (
            <Link to={{ pathname: BosonRoutes.ManageStorefronts }}>
              <Button themeVal="secondary" size="small">
                Manage
              </Button>
            </Link>
          )
        })}
      />
      <SalesChannelCard
        title="Metaverse Store"
        text="Easily create your own decentralized Metaverse store in DCL either on your own DCL land or on Boson Boulevard."
        to={SellerCenterRoutes.DCL}
        time="2 - 4 days"
      />
    </GridContainer>
  );
};
