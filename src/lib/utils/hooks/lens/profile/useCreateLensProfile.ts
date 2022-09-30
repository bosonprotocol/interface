import { BigNumber, utils } from "ethers";
import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { fetchLens } from "../fetchLens";
import { CreateProfileRequest } from "../graphql/generated";
import { pollUntilIndexed } from "../indexer/has-transaction-been-indexed";

type Params = Parameters<typeof createProfile>[0];

type Props = Params;

export default function useCreateLensProfile(
  props: Props,
  options: {
    enabled?: boolean;
    accessToken: string;
  }
) {
  const { enabled, accessToken } = options;
  return useQuery(
    ["create-lens-profile", props],
    async () => {
      return createProfile(props, { accessToken });
    },
    {
      enabled
    }
  );
}

async function createProfileRequest(
  { handle, profilePictureUri }: CreateProfileRequest,
  { accessToken }: { accessToken: string }
) {
  const query = gql`
    mutation CreateProfile($handle: CreateHandle!, $profilePictureUri: Url) {
      createProfile(
        request: {
          handle: $handle
          profilePictureUri: $profilePictureUri
          followNFTURI: null
          followModule: null
        }
      ) {
        ... on RelayerResult {
          txHash
        }
        ... on RelayError {
          reason
        }
        __typename
      }
    }
  `;
  return (
    (await fetchLens(
      query,
      { handle, profilePictureUri },
      { "x-access-token": accessToken }
      // TODO: change any
    )) as any
  ).createProfile;
}

async function createProfile(
  request: CreateProfileRequest,
  { accessToken }: { accessToken: string }
) {
  const createProfileResult = await createProfileRequest(request, {
    accessToken
  });

  console.log("create profile: result", createProfileResult);

  if (createProfileResult.__typename === "RelayError") {
    console.error("create profile: failed");
    return;
  }

  console.log("create profile: poll until indexed");
  const result = await pollUntilIndexed(
    { txHash: createProfileResult.txHash },
    { accessToken }
  );

  console.log("create profile: profile has been indexed", result);

  const logs = result.txReceipt!.logs;

  console.log("create profile: logs", logs);

  const topicId = utils.id(
    "ProfileCreated(uint256,address,address,string,string,address,bytes,string,uint256)"
  );
  console.log("topicid we care about", topicId);

  const profileCreatedLog = logs.find((l: any) => l.topics[0] === topicId);
  console.log("profile created log", profileCreatedLog);

  const profileCreatedEventLog = profileCreatedLog!.topics;
  console.log("profile created event logs", profileCreatedEventLog);

  const profileId = utils.defaultAbiCoder.decode(
    ["uint256"],
    profileCreatedEventLog[1]
  )[0];

  const hexProfileId = BigNumber.from(profileId).toHexString();
  console.log("profile id", hexProfileId);
  return hexProfileId;
}
