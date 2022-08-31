// eslint-disable-next-line
// @ts-nocheck
import * as Yup from "yup";

// TODO: add unit tests for both functions
import isOfferValidityDatesValid from "./isOfferValidityDatesValid";
import isRedemptionDatesValid from "./isRedemptionDatesValid";

Yup.addMethod<Yup.MixedSchema>(
  Yup.mixed,
  "isRedemptionDatesValid",
  isRedemptionDatesValid
);
Yup.addMethod<Yup.MixedSchema>(
  Yup.mixed,
  "isOfferValidityDatesValid",
  isOfferValidityDatesValid
);

export default Yup;
