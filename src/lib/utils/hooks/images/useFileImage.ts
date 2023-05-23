import { useQuery } from "react-query";

import { loadAndSetImagePromise } from "../../base64";

type UseFileImageProps = {
  file: File | undefined;
};

export function useFileImage(
  { file }: UseFileImageProps,
  options: { enabled: boolean }
) {
  return useQuery(
    ["useFileImage", { file }],
    async () => {
      if (!file) {
        return;
      }
      return await loadAndSetImagePromise(file);
    },
    {
      enabled: !!file && options.enabled
    }
  );
}
