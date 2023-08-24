import { useConfigContext } from "components/config/ConfigContext";
import { useQuery } from "react-query";

import { fetchLens } from "../fetchLens";
import {
  Profile,
  ProfileDocument,
  SingleProfileQueryRequest
} from "../graphql/generated";

type Params = Parameters<typeof getLensProfile>[0];

type Props = Params;

export default function useGetLensProfile(
  props: Props,
  options: {
    enabled?: boolean;
  }
) {
  const { config } = useConfigContext();
  const lensApiLink = config.lens.apiLink || "";
  const { enabled } = options;
  return useQuery(
    ["get-lens-profile", props],
    () => {
      return getLensProfile(props, lensApiLink);
    },
    {
      enabled
    }
  );
}

export async function getLensProfile(
  request: Partial<Record<keyof SingleProfileQueryRequest, string>>,
  lensApiLink: string
) {
  return (
    await fetchLens<{
      profile: Profile;
    }>(lensApiLink, ProfileDocument, { request })
  ).profile;
}
