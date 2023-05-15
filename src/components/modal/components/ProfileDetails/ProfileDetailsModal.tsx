import React from "react";
import { generatePath } from "react-router-dom";

import { UrlParameters } from "../../../../lib/routing/parameters";
import { BosonRoutes } from "../../../../lib/routing/routes";
import { LinkWithQuery } from "../../../customNavigation/LinkWithQuery";
import { EditProfile } from "../../../detail/EditProfile";
import Button from "../../../ui/Button";
import Grid from "../../../ui/Grid";

type ProfileDetailsModalProps = {
  sellerId: string;
};

export const ProfileDetailsModal: React.FC<ProfileDetailsModalProps> = ({
  sellerId
}) => {
  const sellerUrl = generatePath(BosonRoutes.SellerPage, {
    [UrlParameters.sellerId]: sellerId
  });
  return (
    <Grid justifyContent="center" gap="2rem">
      <EditProfile />
      <Button as="div" theme="secondary" type={null as never}>
        <LinkWithQuery to={sellerUrl} style={{ all: "unset" }}>
          View profile
        </LinkWithQuery>
      </Button>
    </Grid>
  );
};
