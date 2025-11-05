import * as Yup from "yup";

export const validationSchemas = {
  reserveRange: Yup.object({
    to: Yup.object({
      label: Yup.string().required(),
      value: Yup.string().required(),
      disabled: Yup.boolean()
    }),
    rangeLength: Yup.number()
      .required()
      .min(1, "Must be greater than 0")
      .typeError("This is not a number")
  }),
  premintVouchers: Yup.object({
    premintQuantity: Yup.number()
      .required()
      .min(1, "Must be greater than 0")
      .typeError("This is not a number")
  })
};

export type FormType = Yup.InferType<
  typeof validationSchemas.premintVouchers &
    typeof validationSchemas.reserveRange
>;
