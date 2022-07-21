import styled from "styled-components";

import { colors } from "../../../lib/styles/colors";
import { getBuyerCancelPenalty } from "../../../lib/utils/getPrices";
import { Exchange } from "../../../lib/utils/hooks/useExchanges";
import DetailTable from "../../detail/DetailTable";
import { useConvertedPrice } from "../../price/useConvertedPrice";

interface Props {
  exchange: Exchange;
}

const Line = styled.hr`
  all: unset;
  display: block;
  width: 100%;
  border-bottom: 2px solid ${colors.black};
  margin: 1rem 0;
`;

export default function CancelExchange({ exchange }: Props) {
  const { offer } = exchange;
  const convertedPrice = useConvertedPrice({
    value: offer.price,
    decimals: offer.exchangeToken.decimals
  });
  const oneEthInDollars = useConvertedPrice({
    value: "1",
    decimals: offer.exchangeToken.decimals
  });
  const { buyerCancelationPenalty, convertedBuyerCancelationPenalty } =
    getBuyerCancelPenalty(offer, convertedPrice);

  const refund =
    Number(convertedPrice.price) -
    (Number(convertedPrice.price) * buyerCancelationPenalty) / 100;
  const refundInDollars = refund * Number(oneEthInDollars.converted);
  return (
    <>
      <DetailTable
        noBorder
        data={[
          {
            name: "Item price",
            value: `${convertedPrice.price} ETH (${convertedPrice.currency?.symbol} ${convertedPrice?.converted})`
          },
          {
            name: "Buyer Cancel. Penalty",
            value: `-${buyerCancelationPenalty}% (${convertedPrice.currency?.symbol} ${convertedBuyerCancelationPenalty})`
          }
        ]}
      />
      <Line />
      <DetailTable
        noBorder
        tag="strong"
        data={[
          {
            name: "Your refund",
            value: `${refund} ETH (${convertedPrice.currency?.symbol} ${refundInDollars})`
          }
        ]}
      />
    </>
  );
}
