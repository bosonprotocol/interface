import { Currencies, CurrencyDisplay } from "@bosonprotocol/react-kit";
import { utils } from "ethers";

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
  value: ({ offer }: { offer: Offer }) => {
    const sellerDepositPercentage =
      Number(offer.price) === 0
        ? 0
        : Number(offer.sellerDeposit) / Number(offer.price);

    const sellerDeposit = sellerDepositPercentage * 100;
    const sellerDepositFormatted =
      offer.sellerDeposit === "0"
        ? "0"
        : utils.formatUnits(offer.sellerDeposit, offer.exchangeToken.decimals);
    return (
      <Typography tag="p">
        <CurrencyDisplay
          currency={offer.exchangeToken.symbol as Currencies}
          value={sellerDepositFormatted}
          height={20}
        />
        <small>({isNaN(sellerDeposit) ? "-" : sellerDeposit}%)</small>
      </Typography>
    );
  }
};
