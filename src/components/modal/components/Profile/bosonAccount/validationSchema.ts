import { ethers } from "ethers";
import * as Yup from "yup";

export const bosonAccountValidationSchema = Yup.object({
  secondaryRoyalties: Yup.number()
    .min(0, "Must be greater than or equal to 0%")
    .max(10, "Must be less than or equal to 10%")
    .typeError("This is not a number"),
  addressForRoyaltyPayment: Yup.string()
    .trim()
    .test("FORMAT", "Must be an address", (value) =>
      value ? ethers.utils.isAddress(value) : true
    )
});

export type BosonAccount = Yup.InferType<typeof bosonAccountValidationSchema>;
