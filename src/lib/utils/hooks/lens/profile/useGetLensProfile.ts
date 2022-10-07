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
  const { enabled } = options;
  return useQuery(
    ["get-lens-profile", props],
    () => {
      return getLensProfile(props);
    },
    {
      enabled
    }
  );
}

export async function getLensProfile(
  request: Partial<Record<keyof SingleProfileQueryRequest, string>>
) {
  return (
    await fetchLens<{
      profile: Profile;
    }>(ProfileDocument, { request })
  ).profile;
}
