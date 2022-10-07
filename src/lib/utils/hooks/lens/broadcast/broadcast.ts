/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchLens } from "../fetchLens";
import { BroadcastDocument, BroadcastRequest } from "../graphql/generated";

export async function broadcastRequest(
  request: BroadcastRequest,
  { accessToken }: { accessToken: string }
) {
  return (
    await fetchLens<any>(
      BroadcastDocument,
      {
        request
      },
      { "x-access-token": accessToken }
    )
  ).broadcast;
}
