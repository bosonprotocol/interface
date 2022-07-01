import { Offer } from "../../../types/offer";
import { fetchSubgraph } from "../../core-components/subgraph";
import { checkOfferMetadata } from "../../validators";
import { getOffersQuery } from "./graphql";
import { UseOffersProps } from "./types";

export const getOffers = async (props: UseOffersProps) => {
  const now = Math.floor(Date.now() / 1000);

  const validFromDate_lte =
    props.type !== "soon" && props.valid ? now + "" : null;
  const validFromDate_gte = props.type === "soon" ? now + "" : null;
  const validUntilDate_gte =
    props.type !== "soon" && props.valid ? now + "" : null;

  const variables = {
    first: props.first,
    skip: props.skip,
    validFromDate_lte: validFromDate_lte,
    validFromDate_gte: validFromDate_gte,
    validUntilDate_gte: validUntilDate_gte,
    name_contains_nocase: props.name || "",
    exchangeToken: props.exchangeTokenAddress,
    seller: props.sellerId,
    orderBy: "name",
    orderDirection: "asc",
    quantityAvailable_lte: props.quantityAvailable_lte
  };

  const result = await fetchSubgraph<{
    baseMetadataEntities: { offer: Offer }[];
  }>(
    getOffersQuery({
      exchangeToken: !!props.exchangeTokenAddress,
      sellerId: !!props.sellerId,
      validFromDate_lte: !!validFromDate_lte,
      validFromDate_gte: !!validFromDate_gte,
      validUntilDate_gte: !!validUntilDate_gte,
      skip: !!props.skip,
      quantityAvailable_lte: ![null, undefined].includes(
        props.quantityAvailable_lte as null
      ),
      offer: false
    }),
    variables
  );
  return result?.baseMetadataEntities?.map((base) => {
    const isValid = checkOfferMetadata(base.offer);
    return {
      ...base.offer,
      metadata: {
        ...base.offer.metadata,
        imageUrl: `https://picsum.photos/seed/${base.offer.id}/700`
      },
      isValid
    } as Offer;
  });
};
