import { productV1 } from "@bosonprotocol/react-kit";
import { useQuery } from "react-query";

import { useIpfsStorage } from "../useIpfsStorage";

type UseGetOfferMetadataProps = {
  metadataUris: string[];
};

type Metadata = productV1.ProductV1Metadata;

export function useGetOfferMetadata(
  props: UseGetOfferMetadataProps,
  { enabled }: { enabled: boolean }
) {
  const ipfsStorage = useIpfsStorage();
  return useQuery(
    ["useGetOfferMetadata", props],
    async () => {
      return await Promise.all(
        props.metadataUris.map(
          (metadataUri) => ipfsStorage.get(metadataUri) as Promise<Metadata>
        )
      );
    },
    {
      enabled: enabled
    }
  );
}
