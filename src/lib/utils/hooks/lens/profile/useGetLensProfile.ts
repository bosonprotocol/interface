import { useQuery } from "react-query";

import { fetchLens } from "../fetchLens";
import {
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
    async () => {
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
      profile: {
        id: string;
        name: string;
        bio: string;
        attributes: {
          displayType: string;
          traitType: string;
          key: string;
          value: string;
        };
        metadata: unknown;
        isDefault: boolean;
        handle: string;
        dispatcher: Record<string, any> | null;
      };
    }>(ProfileDocument, { request })
  ).profile;
}
