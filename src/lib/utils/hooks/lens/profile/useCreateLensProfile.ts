import * as Sentry from "@sentry/browser";
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BigNumber, utils } from "ethers";
import { useQuery } from "react-query";

import { fetchLens } from "../fetchLens";
import {
  CreateProfileDocument,
  CreateProfileRequest
} from "../graphql/generated";
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
      return await createProfile(props, { accessToken });
    },
    {
      enabled
    }
  );
}

async function createProfileRequest(
  request: CreateProfileRequest,
  { accessToken }: { accessToken: string }
) {
  return (
    (await fetchLens(
      CreateProfileDocument,
      { request },
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

  if (createProfileResult.__typename === "RelayError") {
    console.error("create profile: failed", createProfileResult);
    const error = new Error(
      createProfileResult.reason ||
        "There has been an error while creating your profile"
    );
    Sentry.captureException(error);
    throw error;
  }

  const result = await pollUntilIndexed(
    { txHash: createProfileResult.txHash },
    { accessToken }
  );

  const logs = result.txReceipt!.logs;

  const topicId = utils.id(
    "ProfileCreated(uint256,address,address,string,string,address,bytes,string,uint256)"
  );

  const profileCreatedLog = logs.find((l: any) => l.topics[0] === topicId);

  const profileCreatedEventLog = profileCreatedLog!.topics;

  const profileId = utils.defaultAbiCoder.decode(
    ["uint256"],
    profileCreatedEventLog[1]
  )[0];

  const hexProfileId = BigNumber.from(profileId).toHexString();
  return hexProfileId;
}
