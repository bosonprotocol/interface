import { subgraph } from "@bosonprotocol/react-kit";
import { useQuery } from "react-query";

import { useIpfsStorage } from "../useIpfsStorage";

type UseGetSellerMetadataProps = {
  seller: subgraph.SellerFieldsFragment | undefined;
};

type Metadata = NonNullable<subgraph.SellerFieldsFragment["metadata"]>;

export function useGetSellerMetadata(
  props: UseGetSellerMetadataProps,
  { enabled }: { enabled: boolean }
) {
  const ipfsStorage = useIpfsStorage();
  return useQuery(
    ["useGetSellerMetadata", props.seller],
    async () => {
      const seller = props.seller;
      if (!seller) {
        return null;
      }
      if (!seller.metadataUri) {
        return null;
      }
      const metadata = await ipfsStorage.get(seller.metadataUri);
      return metadata as Metadata;
    },
    {
      enabled: enabled
    }
  );
}
