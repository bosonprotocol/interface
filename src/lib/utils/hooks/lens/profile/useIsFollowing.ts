// import { FollowingDocument } from './../graphql/generated';
import { useMutation, useQuery } from "react-query";

import { fetchLens } from "../fetchLens";
import {
  CreateFollowTypedDataDocument,
  CreateFollowTypedDataMutation,
  DoesFollowDocument,
  DoesFollowQuery,
  DoesFollowRequest,
  FollowRequest
} from "../graphql/generated";

type ParamsIsFollowing = Parameters<typeof getIsFollowing>[0];

const getIsFollowing = async (request: DoesFollowRequest) => {
  return (await fetchLens<DoesFollowQuery>(DoesFollowDocument, { request }))
    .doesFollow;
};

export const useIsFollowing = (
  props: ParamsIsFollowing,
  options: {
    enabled?: boolean;
  }
) => {
  const { enabled } = options;
  return useQuery(
    ["get-lens-profiles", props],
    async () => {
      return getIsFollowing(props);
    },
    {
      enabled
    }
  );
};

/**
 *
 */

const setFollow = async (request: FollowRequest) => {
  return await fetchLens<CreateFollowTypedDataMutation>(
    CreateFollowTypedDataDocument,
    {
      request
    }
  );
};

export const useSetFollow = (props: FollowRequest) => {
  return useMutation(["get-lens-profiles", props], async () => {
    return setFollow(props);
  });
};
