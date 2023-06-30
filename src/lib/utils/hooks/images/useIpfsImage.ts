import { useQuery } from "react-query";

import { fetchImageAsBase64 } from "../../base64";

type UseIpfsImageProps = {
  url: string;
};

export function useIpfsImage(
  { url }: UseIpfsImageProps,
  options: { enabled: boolean }
) {
  return useQuery(
    ["useIpfsImage", { url }],
    async () => {
      return await fetchImageAsBase64(url);
    },
    {
      enabled: options.enabled
    }
  );
}
