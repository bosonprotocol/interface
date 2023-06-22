import * as Yup from "yup";

export enum LocationValues {
  OwnLand = "OwnLand",
  BosonLand = "BosonLand"
}

export const validationSchema = Yup.object({
  location: Yup.string()
    .oneOf([LocationValues.OwnLand, LocationValues.BosonLand])
    .required()
});

export type FormType = Yup.InferType<typeof validationSchema>;
