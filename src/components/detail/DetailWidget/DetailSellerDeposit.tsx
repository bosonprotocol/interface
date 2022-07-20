import { Offer } from "../../../lib/types/offer";
import Typography from "../../ui/Typography";

export const DetailSellerDeposit = {
  name: "Seller deposit",
  info: (
    <>
      <Typography tag="h6">
        <b>Seller deposit</b>
      </Typography>
      <Typography tag="p">
        The Seller deposit is used to hold the seller accountable to follow
        through with their commitment to deliver the physical item. If the
        seller breaks their commitment, the deposit will be transferred to the
        buyer.
      </Typography>
    </>
  ),
  value: ({
    offer,
    conversionRate
  }: {
    offer: Offer;
    conversionRate?: number;
  }) => {
    const sellerDepositPercentage =
      Number(offer.sellerDeposit) / Number(offer.price);

    const sellerDeposit = sellerDepositPercentage * 100;
    const sellerDepositDollars = conversionRate
      ? (sellerDepositPercentage * conversionRate).toFixed(2)
      : "";
    return (
      <Typography tag="p">
        {sellerDeposit}%
        {sellerDepositDollars && <small>(${sellerDepositDollars})</small>}
      </Typography>
    );
  }
};
