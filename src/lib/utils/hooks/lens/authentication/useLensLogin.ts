import { gql } from "graphql-request";
import { useQuery } from "react-query";
import { useSigner } from "wagmi";

import { fetchLens } from "../fetchLens";

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

export const useLensLogin = (
  props: { address: string | undefined },
  options: {
    enabled?: boolean;
  } = {}
) => {
  const { data: signer } = useSigner();

  // return authenticationToken;
  return useQuery(
    ["lens-login", props],
    async () => {
      const { address = "" } = props;

      // we request a challenge from the server
      const challengeResponse = await generateChallenge({ address });

      // sign the text with the wallet
      const signature =
        (await signer?.signMessage(challengeResponse.text)) || "";

      const authenticatedResult = await authenticate({ address, signature });
      console.log("login: result", authenticatedResult);

      return authenticatedResult;
    },
    {
      enabled: options.enabled && !!props.address && !!signer
    }
  );
};
