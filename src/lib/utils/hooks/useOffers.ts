import { gql } from "graphql-request";
import { Offer } from "lib/types/offer";
import { fetchSubgraph } from "lib/utils/core-components/subgraph";
import { useQuery } from "react-query";

const offersGraphqlEndpoint = process.env
  .REACT_APP_SUBGRAPH_OFFERS_GRAPHQL_ENDPOINT as string;

const offerGraphQL = `
  {
    id
    price
    seller {
      id
      address
    }
    exchangeToken {
      symbol
    }
    metadata {
      title
      description
      additionalProperties
    }
  }
  `;

// TODO: cannot filter by id yet
const getOfferById = async (id: string) => {
  const result = await fetchSubgraph<{ offer: Offer[] }>(
    offersGraphqlEndpoint,
    gql`
      {
        offer(id: ${id}) 
        ${offerGraphQL}
      }
    `
  );
  return result?.offer;
};

// TODO: to be used in details page
export const useOffer = (offerId: string) => {
  return useQuery(["offer", offerId], () => getOfferById(offerId), {
    enabled: !!offerId
  });
};

interface Props {
  brand: string;
}
// TODO: use brand to filter once it's supported
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useOffers = ({ brand }: Props) => {
  return useQuery("offers", async () => {
    const result = await fetchSubgraph<{ offers: Offer[] }>(
      offersGraphqlEndpoint,
      gql`
        {
          offers(first: 10) 
          ${offerGraphQL}
        }
      `
    );
    return result?.offers;
  });
};
