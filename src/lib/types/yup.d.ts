import type { Dayjs } from "dayjs";
import * as yup from "yup";
declare module "yup" {
  interface StringSchema<
    TType extends Maybe<string> = string | undefined,
    TContext extends AnyObject = AnyObject,
    TOut extends TType = TType
  > extends yup.BaseSchema<TType, TContext, TOut> {
    emptyAsUndefined(): StringSchema<TType, TContext>;
  }
  interface ArraySchema<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T extends AnySchema | Lazy<any, any>,
    C extends AnyObject = AnyObject,
    TIn extends Maybe<TypeOf<T>[]> = TypeOf<T>[] | undefined,
    TOut extends Maybe<Asserts<T>[]> = Asserts<T>[] | Optionals<TIn>
  > extends BaseSchema<TIn, C, TOut> {
    isItBeforeNow(): ArraySchema<T, C, TIn, Dayjs[]>;
    isOfferValidityDatesValid(): ArraySchema<T, C, TIn, Dayjs[]>;
    isRedemptionDatesValid(): ArraySchema<T, C, TIn, Dayjs[]>;
  }
}

export default yup;
