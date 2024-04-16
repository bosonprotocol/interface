import { Provider, RevokeButton, subgraph } from "@bosonprotocol/react-kit";
import {
  extractUserFriendlyError,
  getHasUserRejectedTx
} from "@bosonprotocol/react-kit";
import * as Sentry from "@sentry/browser";
import { useConfigContext } from "components/config/ConfigContext";
import { getOfferDetails } from "lib/utils/offer/getOfferDetails";
import { poll } from "lib/utils/promises";
import toast from "react-hot-toast";
import styled from "styled-components";

import { colors } from "../../../lib/styles/colors";
import { useSigner } from "../../../lib/utils/hooks/connection/connection";
import { useAddPendingTransaction } from "../../../lib/utils/hooks/transactions/usePendingTransactions";
import { Exchange } from "../../../lib/utils/hooks/useExchanges";
import { useCoreSDK } from "../../../lib/utils/useCoreSdk";
import { Break } from "../../detail/Detail.style";
import Price from "../../price/index";
import { useConvertedPrice } from "../../price/useConvertedPrice";
import SuccessTransactionToast from "../../toasts/SuccessTransactionToast";
import { Grid } from "../../ui/Grid";
import Image from "../../ui/Image";
import SellerID from "../../ui/SellerID";
import { Typography } from "../../ui/Typography";
import { useModal } from "../useModal";

const OfferWrapper = styled.div`
  width: 100%;
`;

const RevokeButtonWrapper = styled.div`
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

interface Props {
  exchange: Exchange;
  exchangeId?: string;
  refetch: () => void;
}

export default function RevokeProduct({
  exchangeId,
  exchange,
  refetch
}: Props) {
  const { config } = useConfigContext();
  const signer = useSigner();
  const { showModal, hideModal } = useModal();
  const coreSDK = useCoreSDK();
  const addPendingTransaction = useAddPendingTransaction();

  const convertedPrice = useConvertedPrice({
    value: exchange?.offer?.price,
    decimals: exchange?.offer?.exchangeToken?.decimals,
    symbol: exchange?.offer?.exchangeToken?.symbol
  });
  const conversionRate = Number(convertedPrice?.converted);
  const sellerDepositPercentage =
    exchange?.offer?.sellerDeposit === "0"
      ? 0
      : Number(exchange?.offer?.sellerDeposit) / Number(exchange?.offer?.price);
  const sellerDeposit = sellerDepositPercentage * 100;
  const sellerDepositDollars = conversionRate
    ? (sellerDepositPercentage * conversionRate).toFixed(2)
    : "";
  const { mainImage } = getOfferDetails(exchange.offer.metadata);

  return (
    <Grid flexDirection="column" alignItems="flex-start" gap="2rem">
      <OfferWrapper>
        <Grid justifyContent="space-between" alignItems="center" gap="1rem">
          <Grid justifyContent="flex-start" gap="1rem">
            <Image
              src={mainImage}
              showPlaceholderText={false}
              style={{
                width: "4rem",
                height: "4rem",
                paddingTop: "0%",
                fontSize: "0.75rem"
              }}
            />
            <div>
              <Typography tag="h5">
                <b>{exchange?.offer?.metadata?.name}</b>
              </Typography>
              <SellerID
                offerMetadata={exchange?.offer.metadata}
                accountToShow={exchange?.offer?.seller}
                withProfileImage
              />
            </div>
          </Grid>
          {exchange?.offer?.exchangeToken && (
            <Price
              currencySymbol={exchange?.offer?.exchangeToken?.symbol}
              value={exchange?.offer?.price}
              decimals={exchange?.offer?.exchangeToken?.decimals}
              convert
              isExchange
            />
          )}
        </Grid>
      </OfferWrapper>
      <Grid flexDirection="column" gap="1rem">
        <div>
          <Typography tag="h6">What is Revoke?</Typography>
          <Typography tag="p" margin="0" style={{ display: "inline" }}>
            If you Revoke the rNFT you default on your commitment to exchange,
            at no fault of the buyer.
            <b>
              This will result in the slashing of the seller deposit and the
              return of the item price to the buyer.
            </b>
          </Typography>
        </div>
        <Break />
        <Grid>
          <Typography tag="p" margin="0">
            <b>Seller deposit</b>
          </Typography>
          <Typography tag="p" margin="0">
            <b>{sellerDeposit}%</b>
            {sellerDepositDollars && <small>(${sellerDepositDollars})</small>}
          </Typography>
        </Grid>
      </Grid>
      <Grid justifyContent="center">
        <RevokeButtonWrapper>
          <RevokeButton
            variant="accentInverted"
            exchangeId={exchangeId || 0}
            coreSdkConfig={{
              envName: config.envName,
              configId: config.envConfig.configId,
              web3Provider: signer?.provider as Provider,
              metaTx: config.metaTx
            }}
            onError={async (error, { txResponse }) => {
              console.error("onError", error);
              const hasUserRejectedTx = getHasUserRejectedTx(error);
              if (hasUserRejectedTx) {
                showModal("TRANSACTION_FAILED");
              } else {
                Sentry.captureException(error);
                showModal("TRANSACTION_FAILED", {
                  errorMessage: "Something went wrong",
                  detailedErrorMessage: await extractUserFriendlyError(error, {
                    txResponse,
                    provider: signer?.provider as Provider
                  })
                });
              }
            }}
            onPendingSignature={() => {
              showModal(
                "WAITING_FOR_CONFIRMATION",
                undefined,
                "auto",
                undefined,
                {
                  xs: "400px"
                }
              );
            }}
            onPendingTransaction={(hash, isMetaTx) => {
              showModal("TRANSACTION_SUBMITTED", {
                action: "Revoke",
                txHash: hash
              });
              addPendingTransaction({
                type: subgraph.EventType.VOUCHER_REVOKED,
                hash,
                isMetaTx,
                accountType: "Seller",
                exchange: {
                  id: exchange.id
                }
              });
            }}
            onSuccess={async (receipt, { exchangeId }) => {
              await poll(
                async () => {
                  const canceledExchange =
                    await coreSDK.getExchangeById(exchangeId);
                  return canceledExchange.revokedDate;
                },
                (revokedDate) => {
                  return !revokedDate;
                },
                500
              );
              hideModal();
              toast((t) => (
                <SuccessTransactionToast
                  t={t}
                  action={`Revoked exchange: ${exchange.offer.metadata?.name}`}
                  url={config.envConfig.getTxExplorerUrl?.(
                    receipt.transactionHash
                  )}
                />
              ));
              refetch();
            }}
          />
        </RevokeButtonWrapper>
      </Grid>
    </Grid>
  );
}
