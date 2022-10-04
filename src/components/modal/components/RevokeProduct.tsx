import { Provider, RevokeButton } from "@bosonprotocol/react-kit";
import toast from "react-hot-toast";
import styled from "styled-components";
import { useSigner } from "wagmi";

import { CONFIG } from "../../../lib/config";
import { Exchange } from "../../../lib/utils/hooks/useExchanges";
import { useCoreSDK } from "../../../lib/utils/useCoreSdk";
import { poll } from "../../../pages/create-product/utils";
import { Break } from "../../detail/Detail.style";
import Price from "../../price/index";
import { useConvertedPrice } from "../../price/useConvertedPrice";
import SuccessTransactionToast from "../../toasts/SuccessTransactionToast";
import Grid from "../../ui/Grid";
import Image from "../../ui/Image";
import SellerID from "../../ui/SellerID";
import Typography from "../../ui/Typography";
import { useModal } from "../useModal";

const OfferWrapper = styled.div`
  width: 100%;
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
  const { data: signer } = useSigner();
  const { showModal, hideModal } = useModal();
  const coreSDK = useCoreSDK();

  const convertedPrice = useConvertedPrice({
    value: exchange?.offer?.price,
    decimals: exchange?.offer?.exchangeToken?.decimals,
    symbol: exchange?.offer?.exchangeToken?.symbol
  });
  const conversionRate = Number(convertedPrice?.converted);
  const sellerDepositPercentage =
    Number(exchange?.offer?.sellerDeposit) / Number(exchange?.offer?.price);

  const sellerDeposit = sellerDepositPercentage * 100;
  const sellerDepositDollars = conversionRate
    ? (sellerDepositPercentage * conversionRate).toFixed(2)
    : "";

  return (
    <Grid flexDirection="column" alignItems="flex-start" gap="2rem">
      <OfferWrapper>
        <Grid justifyContent="space-between" alignItems="center" gap="1rem">
          <Grid justifyContent="flex-start" gap="1rem">
            <Image
              src={exchange?.offer?.metadata?.image}
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
                offer={exchange?.offer}
                buyerOrSeller={exchange?.offer?.seller}
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
        <RevokeButton
          variant="secondary"
          exchangeId={exchangeId || 0}
          envName={CONFIG.envName}
          onError={(error) => {
            console.error("onError", error);
            const hasUserRejectedTx =
              "code" in error &&
              (error as unknown as { code: string }).code === "ACTION_REJECTED";
            if (hasUserRejectedTx) {
              showModal("CONFIRMATION_FAILED");
            }
          }}
          onPendingSignature={() => {
            showModal("WAITING_FOR_CONFIRMATION");
          }}
          onPendingTransaction={(hash) => {
            showModal("TRANSACTION_SUBMITTED", {
              action: "Revoke",
              txHash: hash
            });
          }}
          onSuccess={async (receipt, { exchangeId }) => {
            await poll(
              async () => {
                const canceledExchange = await coreSDK.getExchangeById(
                  exchangeId
                );
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
                action={`Revoked exchange: ${exchange.offer.metadata.name}`}
                url={CONFIG.getTxExplorerUrl?.(receipt.transactionHash)}
              />
            ));
            refetch();
          }}
          web3Provider={signer?.provider as Provider}
        />
      </Grid>
    </Grid>
  );
}
