import { gql } from "graphql-request";
import { useMutation } from "react-query";
import { useSigner } from "wagmi";

import { fetchLens } from "../fetchLens";

type Signer = ReturnType<typeof useSigner>["data"];

export const generateChallenge = async ({ address }: { address: string }) => {
  const result = await fetchLens<{
    challenge: { text: string };
  }>(
    gql`
      query Challenge($address: EthereumAddress!) {
        challenge(request: { address: $address }) {
          text
        }
      }
    `,
    { address }
  );

  return result.challenge;
};

const authenticate = async ({
  address,
  signature
}: {
  address: string;
  signature: string;
}) => {
  const result = await fetchLens<{
    authenticate: { accessToken: string; refreshToken: string };
  }>(
    gql`
      mutation Authenticate(
        $address: EthereumAddress!
        $signature: Signature!
      ) {
        authenticate(request: { address: $address, signature: $signature }) {
          accessToken
          refreshToken
        }
      }
    `,
    { address, signature }
  );

  return result.authenticate;
};

async function login({
  address = "",
  signer
}: {
  address: string | undefined;
  signer: Signer;
}) {
  // we request a challenge from the server
  const challengeResponse = await generateChallenge({ address });

  // sign the text with the wallet
  const signature = (await signer?.signMessage(challengeResponse.text)) || "";

  const authenticatedResult = await authenticate({ address, signature });

  return authenticatedResult;
}

export const useLensLogin = () => {
  const { data: signer } = useSigner();

  return useMutation(async ({ address }: { address: string | undefined }) => {
    return login({
      address,
      signer
    });
  });
};
