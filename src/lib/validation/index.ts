// eslint-disable-next-line
// @ts-nocheck
import * as Yup from "yup";

import disputePeriodValue from "./disputePeriodValue";
// TODO: add unit tests for all of these functions
import isItBeforeNow from "./isItBeforeNow";
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
Yup.addMethod<Yup.MixedSchema>(Yup.mixed, "isItBeforeNow", isItBeforeNow);
Yup.addMethod<Yup.StringSchema>(
  Yup.string,
  "disputePeriodValue",
  disputePeriodValue
);

export default Yup;
