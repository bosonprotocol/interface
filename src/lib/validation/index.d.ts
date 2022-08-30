/* eslint @typescript-eslint/no-explicit-any: "off" */
import * as Yup from "yup";
import { BaseSchema } from "yup";
import { AnyObject } from "yup/lib/types";

declare module "Yup" {
  interface MixedSchema<TType = any, TContext = AnyObject, TDefault = undefined>
    extends BaseSchema<TType, TContext, TDefault> {
    isRedemptionDatesValid(): this;
    isOfferValidityDatesValid(path: string): this;
  }
}

export default Yup;
