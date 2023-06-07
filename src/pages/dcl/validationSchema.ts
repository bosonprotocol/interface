import * as Yup from "yup";

export enum LocationValues {
  OwnLand = "OwnLand",
  BosonLand = "BosonLand"
}

export const validationSchema = Yup.object({
  step0: Yup.object({
    location: Yup.string().oneOf([
      LocationValues.OwnLand,
      LocationValues.BosonLand
    ])
  })
});

export type FormType = Yup.InferType<typeof validationSchema>;
