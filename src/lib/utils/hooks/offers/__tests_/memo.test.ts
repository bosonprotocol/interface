import { getFirstNOffers } from "../../../../../../e2e-tests/utils/getFirstNOffers";
import { memoMergeAndSortOffers } from "../memo";

jest.mock("@bosonprotocol/ipfs-storage", () => {
  return {
    validation: {
      validateMetadata: () => true
    }
  };
});

describe("#makeMemoizedMergeAndSortOffers()", () => {
  test("merge and sort offers correctly", () => {
    // offers with ids 000 - 009
    const sellerWhitelistOffers = getFirstNOffers(10);
    const sellerWhitelistResult = {
      baseMetadataEntities: sellerWhitelistOffers.map((offer) => ({
        offer
      }))
    };
    // offers with ids 000 - 004
    const offerWhitelistOffers = getFirstNOffers(5);
    const offerWhitelistResult = {
      baseMetadataEntities: offerWhitelistOffers.map((offer) => ({
        offer
      }))
    };

    const memoizedMergeAndSortOffers = memoMergeAndSortOffers();

    const mergedAndSortedOffers = memoizedMergeAndSortOffers(
      "key",
      sellerWhitelistResult,
      offerWhitelistResult
    );

    // remove duplicates
    expect(mergedAndSortedOffers.length).toBe(10);
    // correct order
    for (let i = 0; i < 10; i++) {
      expect(mergedAndSortedOffers[i].id).toBe(`00${i}`);
    }
  });

  test("memoize previous results", () => {
    const offers = getFirstNOffers(10);

    // offers with ids 000 - 004
    const sellerWhitelistResult = {
      baseMetadataEntities: offers.slice(0, 5).map((offer) => ({
        offer
      }))
    };
    // offers with ids 004 - 009
    const offerWhitelistResult = {
      baseMetadataEntities: offers.slice(5).map((offer) => ({
        offer
      }))
    };

    const memoizedMergeAndSortOffers = memoMergeAndSortOffers();

    const firstMergedAndSortedOffers = memoizedMergeAndSortOffers(
      "firstKey",
      sellerWhitelistResult,
      offerWhitelistResult
    );
    const secondMergedAndSortedOffers = memoizedMergeAndSortOffers(
      "firstKey",
      { baseMetadataEntities: [] },
      { baseMetadataEntities: [] }
    );
    const thirdMergedAndSortedOffers = memoizedMergeAndSortOffers(
      "thirdKey",
      { baseMetadataEntities: [] },
      { baseMetadataEntities: [] }
    );
    expect(firstMergedAndSortedOffers.length).toBe(
      secondMergedAndSortedOffers.length
    );
    expect(thirdMergedAndSortedOffers.length).toBe(0);
  });
});
