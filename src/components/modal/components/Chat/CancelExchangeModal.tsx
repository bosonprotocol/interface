import { CancelButton, Provider, subgraph } from "@bosonprotocol/react-kit";
import * as Sentry from "@sentry/browser";
import { useConfigContext } from "components/config/ConfigContext";
import { Info as InfoComponent } from "phosphor-react";
import { useState } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";

import { colors } from "../../../../lib/styles/colors";
import { displayFloat } from "../../../../lib/utils/calcPrice";
import { useSigner } from "../../../../lib/utils/hooks/ethers/connection";
import { useAddPendingTransaction } from "../../../../lib/utils/hooks/transactions/usePendingTransactions";
import { Exchange } from "../../../../lib/utils/hooks/useExchanges";
import useRefundData from "../../../../lib/utils/hooks/useRefundData";
import { useCoreSDK } from "../../../../lib/utils/useCoreSdk";
import { poll } from "../../../../pages/create-product/utils";
import DetailTable from "../../../detail/DetailTable";
import SimpleError from "../../../error/SimpleError";
import { Spinner } from "../../../loading/Spinner";
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
  const { config } = useConfigContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cancelError, setCancelError] = useState<Error | null>(null);
  const { offer } = exchange;

  const coreSDK = useCoreSDK();
  const addPendingTransaction = useAddPendingTransaction();
  const signer = useSigner();
  const { showModal, modalTypes } = useModal();

  const { currency, price, penalty, refund } = useRefundData(
    exchange,
    exchange.offer.price
  );

  return (
    <>
      <DetailTable
        noBorder
        data={[
          price && {
            name: "Item price",
            value: (
              <>
                {displayFloat(price.value)} {currency}
                {price.show ? (
                  <small>
                    ({price.converted.currency}{" "}
                    {displayFloat(price.converted.value)})
                  </small>
                ) : (
                  ""
                )}
              </>
            )
          },
          penalty && {
            name: "Buyer Cancel. Penalty",
            value: (
              <>
                -{displayFloat(penalty.value)}%
                {penalty.show ? (
                  <small>
                    ({penalty.converted.currency}{" "}
                    {displayFloat(penalty.converted.value)})
                  </small>
                ) : (
                  ""
                )}
              </>
            )
          }
        ]}
      />
      <Line />
      <DetailTable
        noBorder
        tag="strong"
        data={[
          refund && {
            name: "Your refund",
            value: (
              <>
                {displayFloat(refund.value)} {currency}
                {refund.show ? (
                  <small>
                    ({refund.converted.currency}{" "}
                    {displayFloat(refund.converted.value)})
                  </small>
                ) : (
                  ""
                )}
              </>
            )
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
            coreSdkConfig={{
              envName: config.envName,
              configId: config.envConfig.configId,
              web3Provider: signer?.provider as Provider,
              metaTx: config.metaTx
            }}
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
                showModal("TRANSACTION_FAILED");
              } else {
                Sentry.captureException(error);
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
