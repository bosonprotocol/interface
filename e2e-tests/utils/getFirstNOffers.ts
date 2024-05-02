import { Offer } from "../../src/lib/types/offer";
import { expect } from "../baseFixtures";
import { defaultMockOffers } from "../mocks/defaultMockOffers";
import { sortOffersBy } from "../utils/sort";

export const getFirstNOffers = (numberOfOffers: number): Offer[] => {
  const offers: Offer[] = [
    ...Array(Math.max(0, numberOfOffers))
      .fill(0)
      .map((_v, idx) => {
        const id = `${idx}`.padStart(3, "0");
        return {
          ...defaultMockOffers[0],
          id,
          metadata: {
            ...defaultMockOffers[0].metadata,
            name: `offer with id ${id}`
          },
          seller: {
            ...defaultMockOffers[0].seller,
            id
          }
        } as Offer;
      })
  ]
    .slice(0, numberOfOffers)
    .sort(sortOffersBy({ property: "name", asc: true }));
  expect(offers.length).toStrictEqual(numberOfOffers);
  return offers;
};
