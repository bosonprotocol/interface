import { useConfigContext } from "components/config/ConfigContext";
import { useQuery } from "react-query";

import { fetchLens } from "../fetchLens";
import {
  ProfileQueryRequest,
  ProfilesDocument,
  ProfilesQuery
} from "../graphql/generated";

type Params = Parameters<typeof getLensProfiles>[0];

type Props = Params;

export default function useGetLensProfiles(
  props: Props,
  options: {
    enabled?: boolean;
  }
) {
  const config = useConfigContext();
  const lensApiLink = config.lens.apiLink || "";
  const { enabled } = options;
  return useQuery(
    ["get-lens-profiles", props, lensApiLink],
    async () => {
      return getLensProfiles(props, lensApiLink);
    },
    {
      enabled
    }
  );
}

async function getLensProfiles(
  request: ProfileQueryRequest,
  lensApiLink: string
) {
  return (
    await fetchLens<ProfilesQuery>(lensApiLink, ProfilesDocument, { request })
  ).profiles;
}
