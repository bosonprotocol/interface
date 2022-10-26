import { CancelButton, Provider, subgraph } from "@bosonprotocol/react-kit";
import { Info as InfoComponent } from "phosphor-react";
import { useState } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";
import { useSigner } from "wagmi";

import { CONFIG } from "../../../../lib/config";
import { colors } from "../../../../lib/styles/colors";
import { getBuyerCancelPenalty } from "../../../../lib/utils/getPrices";
import { useAddPendingTransaction } from "../../../../lib/utils/hooks/transactions/usePendingTransactions";
import { Exchange } from "../../../../lib/utils/hooks/useExchanges";
import { useCoreSDK } from "../../../../lib/utils/useCoreSdk";
import { poll } from "../../../../pages/create-product/utils";
import DetailTable from "../../../detail/DetailTable";
import SimpleError from "../../../error/SimpleError";
import { Spinner } from "../../../loading/Spinner";
import { useConvertedPrice } from "../../../price/useConvertedPrice";
import SuccessTransactionToast from "../../../toasts/SuccessTransactionToast";
import Button from "../../../ui/Button";
import Grid from "../../../ui/Grid";
import { ModalProps } from "../../ModalContext";
import { useModal } from "../../useModal";

interface Props {
  exchange: Exchange;
  BASE_MODAL_DATA: {
    data: (
      | {
          name: string;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          info: any;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          value: any;
          hide?: undefined;
        }
      | {
          name: string;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          value: any;
          info?: undefined;
          hide?: undefined;
        }
      | {
          hide: boolean;
          name?: undefined;
          info?: undefined;
          value?: undefined;
        }
    )[];
    exchange: Exchange;
    animationUrl: string;
    image: string;
    name: string;
  };

  hideModal: NonNullable<ModalProps["hideModal"]>;
  title: ModalProps["title"];
  reload?: () => void;
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

const CancelButtonWrapper = styled.div`
  button {
    background: transparent;
    border-color: ${colors.orange};
    border: 2px solid ${colors.orange};
    color: ${colors.orange};
    &:hover {
      background: ${colors.orange};
      border-color: ${colors.orange};
      border: 2px solid ${colors.orange};
      color: ${colors.white};
    }
  }
`;

export default function CancelExchangeModal({
  exchange,
  hideModal,
  BASE_MODAL_DATA,
  reload
}: Props) {
  const coreSDK = useCoreSDK();
  const addPendingTransaction = useAddPendingTransaction();
  const { offer } = exchange;
  const { data: signer } = useSigner();
  const { showModal, modalTypes } = useModal();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cancelError, setCancelError] = useState<Error | null>(null);
  const convertedPrice = useConvertedPrice({
    value: offer.price,
    decimals: offer.exchangeToken.decimals,
    symbol: offer.exchangeToken.symbol
  });

  const { buyerCancelationPenalty, convertedBuyerCancelationPenalty } =
    getBuyerCancelPenalty(offer, convertedPrice);

  const refund =
    Number(offer.price) - (Number(offer.price) * buyerCancelationPenalty) / 100;
  const convertedRefund = useConvertedPrice({
    value: refund.toString(),
    decimals: offer.exchangeToken.decimals,
    symbol: offer.exchangeToken.symbol
  });
  const showConvertedPrice = !!convertedPrice?.converted;
  return (
    <>
      <DetailTable
        noBorder
        data={[
          {
            name: "Item price",
            value: `${convertedPrice.price} ${offer.exchangeToken.symbol} ${
              showConvertedPrice
                ? `(${convertedPrice.currency?.symbol} ${convertedPrice?.converted})`
                : ""
            }`
          },
          {
            name: "Buyer Cancel. Penalty",
            value: `-${buyerCancelationPenalty}% ${
              showConvertedPrice
                ? `(${convertedRefund.currency?.symbol} ${convertedBuyerCancelationPenalty})`
                : ""
            }`
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
            value: `${convertedRefund.price} ${offer.exchangeToken.symbol} ${
              showConvertedPrice
                ? `(${convertedPrice.currency?.symbol} ${convertedRefund?.converted})`
                : ""
            }`
          }
        ]}
      />
      <Info>
        <InfoIcon />
        Your rNFT will be burned after cancellation.
      </Info>
      {cancelError && <SimpleError />}
      <ButtonsSection>
        <CancelButtonWrapper>
          <CancelButton
            variant="accentInverted"
            exchangeId={exchange.id}
            envName={CONFIG.envName}
            disabled={isLoading}
            onError={(error) => {
              console.error(error);
              setCancelError(error);
              setIsLoading(false);
              const hasUserRejectedTx =
                "code" in error &&
                (error as unknown as { code: string }).code ===
                  "ACTION_REJECTED";
              if (hasUserRejectedTx) {
                showModal("CONFIRMATION_FAILED");
              } else {
                showModal(modalTypes.DETAIL_WIDGET, {
                  title: "An error occurred",
                  message: "An error occurred when trying to cancel!",
                  type: "ERROR",
                  state: "Cancelled",
                  ...BASE_MODAL_DATA
                });
              }
            }}
            onPendingSignature={() => {
              setIsLoading(true);
              setCancelError(null);
              showModal("WAITING_FOR_CONFIRMATION");
            }}
            onPendingTransaction={(hash, isMetaTx) => {
              showModal("TRANSACTION_SUBMITTED", {
                action: "Cancel",
                txHash: hash
              });
              addPendingTransaction({
                type: subgraph.EventType.VoucherCanceled,
                hash,
                isMetaTx,
                accountType: "Buyer",
                exchange: {
                  id: exchange.id
                }
              });
            }}
            onSuccess={async (_, { exchangeId }) => {
              await poll(
                async () => {
                  const canceledExchange = await coreSDK.getExchangeById(
                    exchangeId
                  );
                  return canceledExchange.cancelledDate;
                },
                (cancelledDate) => {
                  return !cancelledDate;
                },
                500
              );
              setIsLoading(false);
              hideModal();
              setCancelError(null);
              reload?.();
              toast((t) => (
                <SuccessTransactionToast
                  t={t}
                  action={`Cancelled exchange: ${offer.metadata.name}`}
                  onViewDetails={() => {
                    showModal(modalTypes.DETAIL_WIDGET, {
                      title: "You have successfully cancelled!",
                      message: "You have successfully cancelled!",
                      type: "SUCCESS",
                      state: "Cancelled",
                      id: exchangeId.toString(),
                      ...BASE_MODAL_DATA
                    });
                  }}
                />
              ));
            }}
            web3Provider={signer?.provider as Provider}
          >
            <Grid gap="0.5rem">
              Confirm cancellation
              {isLoading && <Spinner size="20" />}
            </Grid>
          </CancelButton>
        </CancelButtonWrapper>
        <Button theme="blankOutline" onClick={() => hideModal()}>
          Back
        </Button>
      </ButtonsSection>
    </>
  );
}
