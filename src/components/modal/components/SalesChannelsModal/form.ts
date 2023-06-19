import * as Yup from "yup";

export const validationSchema = Yup.object({
  channels: Yup.array(
    Yup.object({
      label: Yup.string().required(),
      value: Yup.string().required(),
      disabled: Yup.boolean()
    })
  )
});

export type FormType = Yup.InferType<typeof validationSchema>;

export enum Channels {
  dApp = "dApp",
  "Boson Boulevard" = "Boson Boulevard",
  "Own land" = "Own land"
}
