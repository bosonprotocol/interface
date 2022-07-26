import { Info as InfoComponent } from "phosphor-react";
import styled from "styled-components";

import { colors } from "../../../../lib/styles/colors";
import { getBuyerCancelPenalty } from "../../../../lib/utils/getPrices";
import { Exchange } from "../../../../lib/utils/hooks/useExchanges";
import DetailTable from "../../../detail/DetailTable";
import { useConvertedPrice } from "../../../price/useConvertedPrice";
import Button from "../../../ui/Button";
import { ModalProps } from "../../ModalContext";

interface Props {
  exchange: Exchange;

  hideModal: NonNullable<ModalProps["hideModal"]>;
  title: ModalProps["title"];
}

const Line = styled.hr`
  all: unset;
  display: block;
  width: 100%;
  border-bottom: 2px solid ${colors.black};
  margin: 1rem 0;
`;

const Info = styled.div`
  padding: 1.5rem;
  background-color: ${colors.lightGrey};
  margin: 2rem 0;
  color: ${colors.darkGrey};
  display: flex;
  align-items: center;
`;

const InfoIcon = styled(InfoComponent)`
  margin-right: 1.1875rem;
`;

const ButtonsSection = styled.div`
  border-top: 2px solid ${colors.border};
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
`;

export default function CancelExchange({ exchange, hideModal }: Props) {
  const { offer } = exchange;
  const convertedPrice = useConvertedPrice({
    value: offer.price,
    decimals: offer.exchangeToken.decimals
  });

  const { buyerCancelationPenalty, convertedBuyerCancelationPenalty } =
    getBuyerCancelPenalty(offer, convertedPrice);

  const refund =
    Number(offer.price) - (Number(offer.price) * buyerCancelationPenalty) / 100;
  const convertedRefund = useConvertedPrice({
    value: refund.toString(),
    decimals: offer.exchangeToken.decimals
  });
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
            value: `-${buyerCancelationPenalty}% (${convertedRefund.currency?.symbol} ${convertedBuyerCancelationPenalty})`
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
            value: `${convertedRefund.price} ETH (${convertedPrice.currency?.symbol} ${convertedRefund.converted})`
          }
        ]}
      />
      <Info>
        <InfoIcon />
        Your rNFT will be burned after cancellation.
      </Info>
      <ButtonsSection>
        <Button theme="secondary">Confirm cancellation</Button>
        <Button theme="blankOutline" onClick={() => hideModal()}>
          Back
        </Button>
      </ButtonsSection>
    </>
  );
}
