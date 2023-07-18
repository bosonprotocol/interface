import {
  MessageData,
  ProposalContent
} from "@bosonprotocol/chat-sdk/dist/esm/util/v0.0.1/definitions";
import { BigNumber } from "ethers";
import { Info } from "phosphor-react";

import { PERCENTAGE_FACTOR } from "../../../../../components/modal/components/Chat/const";
import { useModal } from "../../../../../components/modal/useModal";
import Grid from "../../../../../components/ui/Grid";
import Typography from "../../../../../components/ui/Typography";
import { colors } from "../../../../../lib/styles/colors";
import { calcPrice } from "../../../../../lib/utils/calcPrice";
import { Exchange } from "../../../../../lib/utils/hooks/useExchanges";

type DrHasDecidedProps = {
  exchange: Exchange;
  proposal: MessageData | null;
  buyerPercent: string;
};
const message =
  "The third party dispute resolver has decided on the outcome of this dispute. The dispute has been resolved and the exchange has been finalised.";

export const DrHasDecided: React.FC<DrHasDecidedProps> = ({
  exchange,
  proposal,
  buyerPercent
}) => {
  const { showModal } = useModal();
  const inEscrow: string = BigNumber.from(exchange.offer.price)
    .add(BigNumber.from(exchange.offer.sellerDeposit || "0"))
    .toString();

  const fixedPercentageAmount: number =
    Number(buyerPercent) / PERCENTAGE_FACTOR;
  const refundBuyerWillReceive = Math.round(
    (Number(inEscrow) * Number(fixedPercentageAmount)) / 100
  );
  const refundSellerWillReceive = BigNumber.from(inEscrow).sub(
    refundBuyerWillReceive
  );
  const refundBuyerWillReceiveFormatted = calcPrice(
    refundBuyerWillReceive.toString(),
    exchange.offer.exchangeToken.decimals
  );
  const refundSellerWillReceiveFormatted = calcPrice(
    refundSellerWillReceive.toString(),
    exchange.offer.exchangeToken.decimals
  );
  return (
    <Grid flexDirection="column" padding="1rem 1rem 0 1rem" gap="1rem">
      <Typography
        padding="1rem"
        background={colors.lightGrey}
        flexDirection="column"
        style={{ width: "100%" }}
      >
        <Grid gap="1rem">
          <div style={{ flex: "0" }}>
            <Info
              size={25}
              color={colors.black}
              style={{ cursor: "pointer" }}
              onClick={() => {
                showModal("RESOLUTION_SUMMARY", {
                  title: "Dispute Resolution Summary",
                  exchange,
                  proposal: {
                    type:
                      (proposal?.data?.content as ProposalContent)?.value
                        ?.proposals?.[0]?.type || "Refund",
                    percentageAmount: buyerPercent
                  },
                  message
                });
              }}
            />
          </div>
          <div style={{ flex: "1" }}>
            <p>
              {message} The seller will receive{" "}
              {refundSellerWillReceiveFormatted}{" "}
              {exchange.offer.exchangeToken.symbol} and the buyer will receive{" "}
              {refundBuyerWillReceiveFormatted}{" "}
              {exchange.offer.exchangeToken.symbol}.
            </p>
          </div>
        </Grid>
      </Typography>
    </Grid>
  );
};
