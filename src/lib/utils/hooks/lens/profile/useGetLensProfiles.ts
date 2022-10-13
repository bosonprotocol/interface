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
  const { enabled } = options;
  return useQuery(
    ["get-lens-profiles", props],
    async () => {
      return getLensProfiles(props);
    },
    {
      enabled
    }
  );
}

export async function getLensProfiles(request: ProfileQueryRequest) {
  return (await fetchLens<ProfilesQuery>(ProfilesDocument, { request }))
    .profiles;
}
