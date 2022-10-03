import { useQuery } from "react-query";

import { fetchLens } from "../fetchLens";
import { ProfileQueryRequest, ProfilesDocument } from "../graphql/generated";

type Params = Parameters<typeof getLensProfiles>[0];
export type Profile = Awaited<
  ReturnType<typeof getLensProfiles>
>["items"][number];

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

async function getLensProfiles(request: ProfileQueryRequest) {
  return (
    await fetchLens<{
      profiles: {
        items: {
          id: string;
          name: string;
          bio: string;
          attributes: {
            displayType: string;
            traitType: string;
            key: string;
            value: string;
          }[];
          metadata: unknown;
          isDefault: boolean;
          handle: string;
          coverPicture: {
            medium: unknown | null;
            original: {
              height: unknown | null;
              mimeType: unknown | null;
              url: string;
              width: unknown | null;
            };
          };
          picture: {
            medium: unknown | null;
            original: {
              height: unknown | null;
              mimeType: unknown | null;
              url: string;
              width: unknown | null;
            };
          };
        }[];
      };
    }>(ProfilesDocument, { request })
  ).profiles;
}
