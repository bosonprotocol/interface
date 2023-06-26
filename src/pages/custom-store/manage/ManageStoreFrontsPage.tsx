import React from "react";
import { Link } from "react-router-dom";

import { Channels } from "../../../components/modal/components/SalesChannelsModal/form";
import Button from "../../../components/ui/Button";
import Grid from "../../../components/ui/Grid";
import Typography from "../../../components/ui/Typography";
import { UrlParameters } from "../../../lib/routing/parameters";
import { BosonRoutes } from "../../../lib/routing/routes";
import { useCurrentSellers } from "../../../lib/utils/hooks/useCurrentSellers";

export const ManageStoreFrontsPage = () => {
  const { sellers } = useCurrentSellers();
  const salesChannels = sellers?.[0]?.metadata?.salesChannels;
  const storeFronts = salesChannels?.filter(
    (sl) => sl.tag === Channels["Custom storefront"]
  );
  console.log(storeFronts);
  return (
    <Grid flexDirection="column" alignItems="flex-start" gap="2rem">
      <div>
        <Typography fontWeight="600" $fontSize="2rem">
          Create a new custom storefront
        </Typography>
        <p>
          You can create as many storefronts as you want and decide to save them
          or not to see them here later;
        </p>
        <Link to={{ pathname: BosonRoutes.CreateStorefront }}>
          <Button theme="secondary">Create one now</Button>
        </Link>
      </div>
      {storeFronts?.length ? (
        <div>
          <Typography fontWeight="600" $fontSize="2rem">
            See existing storefronts
          </Typography>

          <ul>
            {storeFronts?.map((sf, index) => {
              return (
                <li key={`${sf.id}-${sf.name}-${index}`}>
                  <Grid gap="1rem">
                    <Typography $fontSize="1.5rem">
                      {sf.name || "Unnamed storefront"}
                    </Typography>
                    <Link
                      to={{
                        pathname: BosonRoutes.CreateStorefront,
                        search: `?${UrlParameters.customStoreUrl}=${
                          sf.deployments?.[0]?.link || ""
                        }`
                      }}
                    >
                      <Button theme="secondary">Edit</Button>
                    </Link>
                  </Grid>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <p>You don't have any saved storefront</p>
      )}
    </Grid>
  );
};

export default ManageStoreFrontsPage;
