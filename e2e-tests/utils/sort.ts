import { Offer } from "../../src/lib/types/offer";

export function sortOffersBy(by: { property: "name"; asc: boolean }) {
  return (
    offer1: Offer | { offer: Offer },
    offer2: Offer | { offer: Offer }
  ) => {
    const isASC = !!by.asc;
    const o1 = "offer" in offer1 ? offer1.offer : offer1;
    const o2 = "offer" in offer2 ? offer2.offer : offer2;
    if (by.property === "name") {
      return ((isASC ? o1 : o2)?.metadata?.name || "").localeCompare(
        (isASC ? o2 : o1)?.metadata?.name || ""
      );
    }
    if (
      ["validUntilDate", "quantityAvailable", "validFromDate"].includes(
        by.property
      )
    ) {
      return (
        Number((isASC ? o1 : o2)?.[by.property] || "") -
        Number((isASC ? o2 : o1)?.[by.property] || "")
      );
    }
    throw new Error(`sortOffersBy cannot sort by ${by.property}`);
  };
}
