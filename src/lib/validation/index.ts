import type { Dayjs } from "dayjs";
import * as Yup from "yup";

import disputePeriodValue from "./disputePeriodValue";
import isItBeforeNow from "./isItBeforeNow";
import isOfferValidityDatesValid from "./isOfferValidityDatesValid";
import isRedemptionDatesValid from "./isRedemptionDatesValid";
import returnPeriodValue from "./returnPeriodValue";

Yup.addMethod(
  Yup.array<Dayjs>,
  "isRedemptionDatesValid",
  isRedemptionDatesValid
);
Yup.addMethod<Yup.MixedSchema<Dayjs[] | undefined>>(
  Yup.mixed<Dayjs[]>,
  "isRedemptionDatesValid",
  isRedemptionDatesValid
);
Yup.addMethod(
  Yup.array<Dayjs>,
  "isOfferValidityDatesValid",
  isOfferValidityDatesValid
);
Yup.addMethod<Yup.MixedSchema<Dayjs[] | undefined>>(
  Yup.mixed<Dayjs[]>,
  "isOfferValidityDatesValid",
  isOfferValidityDatesValid
);
Yup.addMethod(Yup.array<Dayjs>, "isItBeforeNow", isItBeforeNow);
Yup.addMethod<Yup.StringSchema>(
  Yup.string,
  "disputePeriodValue",
  disputePeriodValue
);
Yup.addMethod<Yup.StringSchema>(
  Yup.string,
  "returnPeriodValue",
  returnPeriodValue
);

export default Yup;
