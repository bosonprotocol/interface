import { subgraph } from "@bosonprotocol/react-kit";
import { useConfigContext } from "components/config/ConfigContext";
import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { Offer } from "../../types/offer";
import { fetchSubgraph } from "../core-components/subgraph";
import { useCurationLists } from "./useCurationLists";

export type Exchange = subgraph.ExchangeFieldsFragment & {
  offer: Offer;
};

export type Disputes = subgraph.DisputeFieldsFragment & {
  exchange: { offer: Offer } & subgraph.ExchangeFieldsFragment;
};

interface Props {
  disputed: boolean | null;
  sellerId?: string;
  buyerId?: string;
  state?: subgraph.ExchangeState;
  id?: string;
  id_in?: string[];
  orderBy?: string | null | undefined;
  orderDirection?: string | null | undefined;
  offerId?: string;
  first?: number;
  skip?: number;
  seller_in?: string[];
}

const getExchangesFunction = (subgraphUrl: string) => async (props: Props) => {
  const {
    disputed,
    sellerId,
    state,
    buyerId,
    id,
    id_in,
    orderBy = "id",
    orderDirection = "desc",
    offerId,
    first,
    skip,
    seller_in
  } = props;

  return await fetchSubgraph<{
    exchanges: Exchange[];
  }>(
    subgraphUrl,
    gql`
    ${subgraph.BaseOfferFieldsFragmentDoc}
    query GetExchanges(
      $disputed: Boolean
      $sellerId: String
      $buyerId: String
      $orderBy: String
      $orderDirection: String
      $offerId: String
      ${first ? "$first: Int" : ""}
      ${skip ? "$skip: Int" : ""}
    ) {
      exchanges(
        ${orderBy ? `orderBy: "${orderBy}"` : ""}
        ${orderDirection ? `orderDirection: "${orderDirection}"` : ""}
        ${first ? `first: ${first}` : ""}
        ${skip ? `skip: ${skip}` : ""}
        where: {
        ${id ? `id: "${id}"` : ""}
        ${state ? `state: "${state}"` : ""}
        ${id_in ? `id_in: [${id_in.join(",")}]` : ""}
        ${
          seller_in
            ? `seller_in: [${seller_in.map((id) => `"${id}"`).join(",")}]`
            : ""
        }
        ${sellerId !== undefined ? "seller: $sellerId" : ""}
        ${buyerId !== undefined ? "buyer: $buyerId" : ""}
        ${
          [true, false].includes(disputed as boolean)
            ? "disputed: $disputed"
            : ""
        }
        ${offerId ? "offer: $offerId" : ""}
        }) {
        dispute {
          id
          buyerPercent
          exchangeId
          state
          buyerPercent
          disputedDate
          escalatedDate
          finalizedDate
          retractedDate
          resolvedDate
          decidedDate
          refusedDate
          timeout
        }
        cancelledDate
        committedDate
        disputedDate
        disputed
        expired
        finalizedDate
        id
        redeemedDate
        revokedDate
        state
        validUntilDate
        seller {
          id
          assistant
          admin
          treasury
          authTokenId
          authTokenType
          voucherCloneAddress
          active
          metadata {
            name
          }
        }
        buyer {
          id
          wallet
          active
        }
        offer {
          ...BaseOfferFields
        }
      }
    }
    
  `,
    {
      disputed,
      sellerId: sellerId?.length ? sellerId : null,
      buyerId: buyerId?.length ? buyerId : null,
      orderBy,
      orderDirection,
      offerId,
      skip
    }
  );
};

const OFFERS_PER_PAGE = 1000;
export function useExchanges(
  props: Props,
  options: {
    enabled?: boolean;
    onlyCuratedSeller?: boolean;
  } = {}
) {
  const { config } = useConfigContext();
  const { subgraphUrl } = config.envConfig;

  const fetchExchanges = getExchangesFunction(subgraphUrl);
  const curationLists = useCurationLists();
  const onlyCuratedSeller =
    options.onlyCuratedSeller === undefined || options.onlyCuratedSeller;
  const sellerIn = onlyCuratedSeller
    ? curationLists.sellerCurationList
    : undefined;

  return useQuery(
    ["exchanges", props, sellerIn, subgraphUrl, OFFERS_PER_PAGE, curationLists],
    async () => {
      const result = await fetchExchanges({
        ...props,
        first: OFFERS_PER_PAGE,
        seller_in: sellerIn
      });
      const data = result?.exchanges;
      let loop = data?.length === OFFERS_PER_PAGE;
      let productsSkip = OFFERS_PER_PAGE;
      while (loop) {
        const newResults = await fetchExchanges({
          ...props,
          first: OFFERS_PER_PAGE,
          skip: productsSkip,
          seller_in: sellerIn
        });
        const dataToAdd = newResults?.exchanges || [];
        data.push(...dataToAdd);
        loop = dataToAdd?.length === OFFERS_PER_PAGE;
        productsSkip += OFFERS_PER_PAGE;
      }
      return (
        data?.map((exchange) => {
          const isCuratedSeller =
            !curationLists.sellerCurationList ||
            curationLists.sellerCurationList?.includes(exchange.seller.id);
          return {
            ...exchange,
            offer: {
              ...exchange.offer,
              metadata: isCuratedSeller
                ? {
                    ...exchange.offer.metadata,
                    imageUrl: exchange.offer.metadata?.image || ""
                  }
                : {
                    name: `${exchange.offer.id}`,
                    imageUrl: "../../assets/placeholder-thumbnail.png"
                  },
              isValid: true
            } as Offer
          };
        }) ?? []
      );
    },
    {
      ...options
    }
  );
}
