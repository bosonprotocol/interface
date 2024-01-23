import { useMemo } from "react";
import { useParams } from "react-router-dom";

import { UrlParameters } from "../../lib/routing/parameters";
import { Grid } from "../ui/Grid";
import { Typography } from "../ui/Typography";
import { drPageTypes } from "./DisputeResolver";
import DisputeResolverWrapper from "./DisputeWrapper";

export interface DisputeResolverProps {
  disputeResolverId: string;
}

export default function DisputeResolverInside(props: DisputeResolverProps) {
  const { [UrlParameters.disputeResolverPageId]: disputeResolverPage } =
    useParams();

  const { label, component, ...rest } = useMemo(
    () =>
      drPageTypes[disputeResolverPage as keyof typeof drPageTypes] ||
      drPageTypes.whitelist,
    [disputeResolverPage]
  );

  if (props.disputeResolverId === null) {
    return (
      <DisputeResolverWrapper label={label}>
        <Grid justifyContent="center" padding="5rem">
          <Typography tag="h5">
            You must be a dispute resolver to interact with this
          </Typography>
        </Grid>
      </DisputeResolverWrapper>
    );
  }

  return (
    <DisputeResolverWrapper label={label} {...rest}>
      {component(props)}
    </DisputeResolverWrapper>
  );
}
