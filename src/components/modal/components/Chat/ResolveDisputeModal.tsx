import { TransactionResponse } from "@bosonprotocol/common";
import { CoreSDK, subgraph } from "@bosonprotocol/react-kit";
import { BigNumber, BigNumberish, utils } from "ethers";
import { Info as InfoComponent } from "phosphor-react";
import { useState } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";
import { useAccount } from "wagmi";

import { CONFIG } from "../../../../lib/config";
import { colors } from "../../../../lib/styles/colors";
import { displayFloat } from "../../../../lib/utils/calcPrice";
import { useAddPendingTransaction } from "../../../../lib/utils/hooks/transactions/usePendingTransactions";
import { Exchange } from "../../../../lib/utils/hooks/useExchanges";
import { useCoreSDK } from "../../../../lib/utils/useCoreSdk";
import { ProposalItem } from "../../../../pages/chat/types";
import { poll } from "../../../../pages/create-product/utils";
import SimpleError from "../../../error/SimpleError";
import { useConvertedPrice } from "../../../price/useConvertedPrice";
import SuccessTransactionToast from "../../../toasts/SuccessTransactionToast";
import BosonButton from "../../../ui/BosonButton";
import Button from "../../../ui/Button";
import Grid from "../../../ui/Grid";
import { useModal } from "../../useModal";
import ExchangePreview from "./components/ExchangePreview";
import ProposalTypeSummary from "./components/ProposalTypeSummary";
import { PERCENTAGE_FACTOR } from "./const";

interface Props {
  exchange: Exchange;
  proposal: ProposalItem;
}

const ProposedSolution = styled.h4`
  font-size: 1.25rem;
  font-weight: 600;
`;

const StyledTable = styled.table`
  width: 100%;
  color: ${colors.darkGrey};
  .receive {
    font-weight: 600;
    color: ${colors.black};
  }
  td {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
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

async function resolveDisputeWithMetaTx(
  coreSdk: CoreSDK,
  exchangeId: BigNumberish,
  buyerPercent: BigNumberish,
  counterpartySig: {
    r: string;
    s: string;
    v: number;
  }
): Promise<TransactionResponse> {
  const nonce = Date.now();
  const { r, s, v, functionName, functionSignature } =
    await coreSdk.signMetaTxResolveDispute({
      exchangeId,
      buyerPercent,
      counterpartySig,
      nonce
    });
  return coreSdk.relayMetaTransaction({
    functionName,
    functionSignature,
    sigR: r,
    sigS: s,
    sigV: v,
    nonce
  });
}

function Line() {
  return (
    <tr>
      <td style={{ paddingRight: 0 }}>
        <div style={{ width: "110%", border: `1px solid ${colors.black}` }} />
      </td>
      <td style={{ paddingLeft: 0 }}>
        <div style={{ width: "100%", border: `1px solid ${colors.black}` }} />
      </td>
    </tr>
  );
}

export default function ResolveDisputeModal({ exchange, proposal }: Props) {
  const { showModal, hideModal } = useModal();
  const coreSDK = useCoreSDK();
  const addPendingTransaction = useAddPendingTransaction();
  const { address } = useAccount();
  const [resolveDisputeError, setResolveDisputeError] = useState<Error | null>(
    null
  );
  const symbol = exchange.offer.exchangeToken.symbol;
  const price = useConvertedPrice({
    value: exchange.offer.price,
    decimals: exchange.offer.exchangeToken.decimals,
    symbol: symbol
  });
  const sellerDeposit = useConvertedPrice({
    value: exchange.offer.sellerDeposit,
    decimals: exchange.offer.exchangeToken.decimals,
    symbol: symbol
  });
  const inEscrow: string = BigNumber.from(exchange.offer.price)
    .add(BigNumber.from(exchange.offer.sellerDeposit || "0"))
    .toString();
  const totalEligibleRefund = useConvertedPrice({
    value: inEscrow,
    decimals: exchange.offer.exchangeToken.decimals,
    symbol: symbol
  });

  const fixedPercentageAmount: number =
    Number(proposal.percentageAmount) / PERCENTAGE_FACTOR;
  const refundBuyerWillReceive = Math.round(
    (Number(inEscrow) * Number(fixedPercentageAmount)) / 100
  );

  const refundBuyerWillReceivePrice = useConvertedPrice({
    value: refundBuyerWillReceive.toString(),
    decimals: exchange.offer.exchangeToken.decimals,
    symbol: symbol
  });
  const sellerWillReceive = BigNumber.from(inEscrow)
    .sub(refundBuyerWillReceive)
    .toString();
  const sellerWillReceivePrice = useConvertedPrice({
    value: sellerWillReceive.toString(),
    decimals: exchange.offer.exchangeToken.decimals,
    symbol: symbol
  });

  return (
    <>
      <Grid justifyContent="space-between" padding="0 0 2rem 0">
        <ExchangePreview exchange={exchange} />
      </Grid>
      <ProposedSolution>Proposed solution</ProposedSolution>
      <div style={{ marginBottom: "3.44rem" }}>
        <ProposalTypeSummary exchange={exchange} proposal={proposal} />
      </div>
      <StyledTable>
        <tr>
          <td>Item price</td>
          <td>
            <Grid justifyContent="flex-end">
              {price.price} {symbol} ({price.currency?.symbol}
              {displayFloat(price.converted, { fixed: 2 })})
            </Grid>
          </td>
        </tr>
        <tr>
          <td>Seller deposit</td>
          <td>
            <Grid justifyContent="flex-end">
              {sellerDeposit.price} {symbol} ({sellerDeposit.currency?.symbol}
              {displayFloat(sellerDeposit.converted, { fixed: 2 })})
            </Grid>
          </td>
        </tr>
        <Line />
        <tr>
          <td>Total eligible refund</td>
          <td>
            <Grid justifyContent="flex-end">
              {totalEligibleRefund.price} {symbol} (
              {totalEligibleRefund.currency?.symbol}
              {displayFloat(totalEligibleRefund.converted, { fixed: 2 })})
            </Grid>
          </td>
        </tr>
        <tr>
          <td>Refund proposal</td>
          <td>
            <Grid justifyContent="flex-end">{fixedPercentageAmount}%</Grid>
          </td>
        </tr>
        <Line />
        <tr className="receive">
          <td>Buyer will receive</td>
          <td>
            <Grid justifyContent="flex-end">
              {refundBuyerWillReceivePrice.price} {symbol} (
              {refundBuyerWillReceivePrice.currency?.symbol}
              {displayFloat(refundBuyerWillReceivePrice.converted, {
                fixed: 2
              })}
              )
            </Grid>
          </td>
        </tr>
        <tr className="receive">
          <td>Seller will receive</td>
          <td>
            <Grid justifyContent="flex-end">
              {sellerWillReceivePrice.price} {symbol} (
              {sellerWillReceivePrice.currency?.symbol}
              {displayFloat(sellerWillReceivePrice.converted, { fixed: 2 })})
            </Grid>
          </td>
        </tr>
      </StyledTable>
      <Info>
        <InfoIcon />
        By accepting this proposal the dispute will be resolved and the buyer
        will be refunded {refundBuyerWillReceivePrice.price} {symbol}. The
        seller will receive {sellerWillReceivePrice.price} {symbol} for this
        exchange.
      </Info>
      {resolveDisputeError && <SimpleError />}
      <ButtonsSection>
        <BosonButton
          variant="primaryFill"
          onClick={async () => {
            try {
              setResolveDisputeError(null);
              const signature = utils.splitSignature(proposal.signature);
              let tx: TransactionResponse;
              showModal("WAITING_FOR_CONFIRMATION");
              const isMetaTx = Boolean(coreSDK?.isMetaTxConfigSet && address);
              if (isMetaTx) {
                tx = await resolveDisputeWithMetaTx(
                  coreSDK,
                  exchange.id,
                  proposal.percentageAmount,
                  signature
                );
              } else {
                tx = await coreSDK.resolveDispute({
                  exchangeId: exchange.id,
                  buyerPercentBasisPoints: proposal.percentageAmount,
                  sigR: signature.r,
                  sigS: signature.s,
                  sigV: signature.v
                });
              }
              showModal("TRANSACTION_SUBMITTED", {
                action: "Raise dispute",
                txHash: tx.hash
              });
              addPendingTransaction({
                type: subgraph.EventType.DisputeRaised,
                hash: tx.hash,
                isMetaTx,
                accountType: "Buyer",
                exchange: {
                  id: exchange.id
                }
              });
              await tx.wait();
              await poll(
                async () => {
                  const resolvedDispute = await coreSDK.getDisputeById(
                    exchange.dispute?.id as BigNumberish
                  );
                  return resolvedDispute.resolvedDate;
                },
                (resolvedDate) => {
                  return !resolvedDate;
                },
                500
              );
              hideModal();
              toast((t) => (
                <SuccessTransactionToast
                  t={t}
                  action={`Raised dispute: ${exchange.offer.metadata.name}`}
                  url={CONFIG.getTxExplorerUrl?.(tx.hash)}
                />
              ));
            } catch (error) {
              const hasUserRejectedTx =
                (error as unknown as { code: string }).code ===
                "ACTION_REJECTED";
              if (hasUserRejectedTx) {
                showModal("TRANSACTION_FAILED");
              } else {
                showModal("TRANSACTION_FAILED", {
                  errorMessage: "Something went wrong"
                });
              }
              setResolveDisputeError(error as Error);
            }
          }}
        >
          Accept proposal
        </BosonButton>
        <Button theme="blankOutline" onClick={() => hideModal()}>
          Back
        </Button>
      </ButtonsSection>
    </>
  );
}
