import { BaseIpfsStorage } from "@bosonprotocol/react-kit";
import { splitSignature } from "ethers/lib/utils";
import { gql } from "graphql-request";
import { useQuery, useQueryClient } from "react-query";
import { useSigner, useSignTypedData } from "wagmi";

import { useIpfsStorage } from "../../useIpfsStorage";
import { signedTypeData } from "../ethers";
import { fetchLens } from "../fetchLens";
import { CreatePublicSetProfileMetadataUriRequest } from "../graphql/generated";
import { pollUntilIndexed } from "../indexer/has-transaction-been-indexed";
import { getLensPeriphery } from "../lens-hub";

type SignTypedDataAsync = ReturnType<
  typeof useSignTypedData
>["signTypedDataAsync"];

type Params = Parameters<typeof setProfileMetadata>[0];

type Props = Params;

export default function useSetLensProfileMetadata(
  props: Props,
  options: {
    enabled?: boolean;
    accessToken: string;
  }
) {
  const { signTypedDataAsync } = useSignTypedData();
  const { data: signer } = useSigner();
  const { enabled, accessToken } = options;
  const storage = useIpfsStorage();
  const queryClient = useQueryClient();
  return useQuery(
    ["set-lens-profile-metadata", props],
    async () => {
      if (!signer) {
        return;
      }
      return setProfileMetadata(props, {
        signTypedDataAsync,
        storage,
        signer,
        accessToken
      });
    },
    {
      enabled: enabled && !!signer
    }
  );
}

async function createSetProfileMetadataTypedData(
  request: CreatePublicSetProfileMetadataUriRequest,
  accessToken: string
) {
  const query = gql`
    mutation createSetProfileMetadataTypedData(
      $request: CreatePublicSetProfileMetadataURIRequest!
    ) {
      createSetProfileMetadataTypedData(request: $request) {
        id
        expiresAt
        typedData {
          types {
            SetProfileMetadataURIWithSig {
              name
              type
            }
          }
          domain {
            name
            chainId
            version
            verifyingContract
          }
          value {
            nonce
            deadline
            profileId
            metadata
          }
        }
      }
    }
  `;
  const result = await fetchLens<any>(
    query,
    { request },
    { "x-access-token": accessToken }
  );
  return result.createSetProfileMetadataTypedData;
}

const signCreateSetProfileMetadataTypedData = async (
  request: CreatePublicSetProfileMetadataUriRequest,
  signTypedDataAsync: SignTypedDataAsync,
  accessToken: string
) => {
  const result = await createSetProfileMetadataTypedData(request, accessToken);
  console.log("create profile metadata: createCommentTypedData", result);

  const typedData = result.typedData;
  console.log("create profile metadata: typedData", typedData);

  const signature = await signedTypeData(
    signTypedDataAsync,
    typedData.domain,
    typedData.types,
    typedData.value
  );
  console.log("create profile metadata: signature", signature);

  return { result, signature };
};

async function setProfileMetadata(
  args: {
    profileId: string;
    name: string;
    bio: string;
    cover_picture: string;
    attributes: {
      traitType: string;
      value: string;
      key: string;
    }[];
    version: string;
    metadata_id: string;
  },
  {
    signTypedDataAsync,
    storage,
    signer,
    accessToken
  }: {
    signTypedDataAsync: SignTypedDataAsync;
    storage: BaseIpfsStorage;
    signer: NonNullable<ReturnType<typeof useSigner>["data"]>;
    accessToken: string;
  }
) {
  const cid = await storage.add(JSON.stringify(args));
  console.log("create profile metadata: ipfs cid", cid);

  const createProfileMetadataRequest = {
    profileId: args.profileId,
    metadata: "ipfs://" + cid
  };
  const signedResult = await signCreateSetProfileMetadataTypedData(
    createProfileMetadataRequest,
    signTypedDataAsync,
    accessToken
  );
  console.log("create comment: signedResult", signedResult);

  const typedData = signedResult.result.typedData;

  const { v, r, s } = splitSignature(signedResult.signature);

  const lensPeriphery = getLensPeriphery(signer);
  const tx = await lensPeriphery.setProfileMetadataURIWithSig({
    profileId: createProfileMetadataRequest.profileId,
    metadata: createProfileMetadataRequest.metadata,
    sig: {
      v,
      r,
      s,
      deadline: typedData.value.deadline
    }
  });
  console.log("create profile metadata: tx hash", tx.hash);

  console.log("create profile metadata: poll until indexed");
  const indexedResult = await pollUntilIndexed(
    { txHash: tx.hash },
    { accessToken }
  );

  console.log("create profile metadata: profile has been indexed");

  const logs = indexedResult.txReceipt!.logs;

  console.log("create profile metadata: logs", logs);
}
