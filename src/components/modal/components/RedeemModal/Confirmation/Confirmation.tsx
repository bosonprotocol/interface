import {
  MessageType,
  version
} from "@bosonprotocol/chat-sdk/dist/cjs/util/v0.0.1/definitions";
import { Provider, RedeemButton, subgraph } from "@bosonprotocol/react-kit";
import { utils } from "ethers";
import { useField } from "formik";
import { Warning } from "phosphor-react";
import { useState } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";
import { useSigner } from "wagmi";

import { CONFIG } from "../../../../../lib/config";
import { colors } from "../../../../../lib/styles/colors";
import { useChatStatus } from "../../../../../lib/utils/hooks/chat/useChatStatus";
import { useAddPendingTransaction } from "../../../../../lib/utils/hooks/transactions/usePendingTransactions";
import { useCoreSDK } from "../../../../../lib/utils/useCoreSdk";
import { useChatContext } from "../../../../../pages/chat/ChatProvider/ChatContext";
import { poll } from "../../../../../pages/create-product/utils";
import SimpleError from "../../../../error/SimpleError";
import { Spinner } from "../../../../loading/Spinner";
import SuccessTransactionToast from "../../../../toasts/SuccessTransactionToast";
import Button from "../../../../ui/Button";
import Grid from "../../../../ui/Grid";
import Typography from "../../../../ui/Typography";
import { useModal } from "../../../useModal";
import InitializeChatWithSuccess from "../../Chat/components/InitializeChatWithSuccess";
import { FormModel } from "../RedeemModalFormModel";

const StyledGrid = styled(Grid)`
  background-color: ${colors.lightGrey};
`;

interface Props {
  exchangeId: string;
  offerName: string;
  offerId: string;
  buyerId: string;
  sellerId: string;
  sellerAddress: string;
  onBackClick: () => void;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  reload?: () => void;
}

export default function Confirmation({
  onBackClick,
  exchangeId,
  offerName,
  offerId,
  buyerId,
  sellerId,
  sellerAddress,
  reload,
  setIsLoading: setLoading
}: Props) {
  const coreSDK = useCoreSDK();
  const addPendingTransaction = useAddPendingTransaction();
  const { showModal, hideModal } = useModal();
  const { bosonXmtp } = useChatContext();
  const [chatError, setChatError] = useState<Error | null>(null);
  const [redeemError, setRedeemError] = useState<Error | null>(null);
  const { chatInitializationStatus } = useChatStatus();
  const showSuccessInitialization =
    chatInitializationStatus === "INITIALIZED" && bosonXmtp;
  const isInitializationValid =
    !!bosonXmtp &&
    ["INITIALIZED", "ALREADY_INITIALIZED"].includes(chatInitializationStatus);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: signer } = useSigner();
  const [nameField] = useField(FormModel.formFields.name.name);
  const [streetNameAndNumberField] = useField(
    FormModel.formFields.streetNameAndNumber.name
  );
  const [cityField] = useField(FormModel.formFields.city.name);
  const [stateField] = useField(FormModel.formFields.state.name);
  const [zipField] = useField(FormModel.formFields.zip.name);
  const [countryField] = useField(FormModel.formFields.country.name);
  const [emailField] = useField(FormModel.formFields.email.name);

  const sendDeliveryDetailsToChat = async () => {
    const value = `DELIVERY ADDRESS:

${FormModel.formFields.name.placeholder}: ${nameField.value}
${FormModel.formFields.streetNameAndNumber.placeholder}: ${streetNameAndNumberField.value}
${FormModel.formFields.city.placeholder}: ${cityField.value}
${FormModel.formFields.state.placeholder}: ${stateField.value}
${FormModel.formFields.zip.placeholder}: ${zipField.value}
${FormModel.formFields.country.placeholder}: ${countryField.value}
${FormModel.formFields.email.placeholder}: ${emailField.value}`;

    const newMessage = {
      threadId: {
        exchangeId,
        buyerId,
        sellerId
      },
      content: {
        value
      },
      contentType: MessageType.String,
      version
    } as const;
    const destinationAddress = utils.getAddress(sellerAddress);
    setChatError(null);
    bosonXmtp
      ?.encodeAndSendMessage(newMessage, destinationAddress)
      .catch((error) => {
        console.error(
          "Error while sending a message with the delivery details",
          error
        );
        setChatError(error);
      });
  };
  return (
    <>
      <Typography
        fontWeight="600"
        $fontSize="1rem"
        lineHeight="1.5rem"
        margin="1rem 0"
      >
        Confirm your address
      </Typography>
      <Grid
        flexDirection="row"
        alignItems="flex-start"
        justifyContent="flex-start"
      >
        <Grid flexDirection="column" alignItems="flex-start">
          <div>{nameField.value}</div>
          <div>{streetNameAndNumberField.value}</div>
          <div>{cityField.value}</div>
          <div>{stateField.value}</div>
          <div>{zipField.value}</div>
          <div>{countryField.value}</div>
          <div>{emailField.value}</div>
        </Grid>
        <Grid flexDirection="row" flexBasis="0">
          <Button theme="blankSecondary" onClick={() => onBackClick()}>
            Edit
          </Button>
        </Grid>
      </Grid>
      <InitializeChatWithSuccess />
      {showSuccessInitialization && (
        <div>
          <StyledGrid
            justifyContent="flex-start"
            gap="0.5rem"
            margin="1.5rem 0"
            padding="1.5rem"
          >
            <Warning color={colors.darkOrange} size={16} />
            <Typography fontWeight="600" $fontSize="1rem" lineHeight="1.5rem">
              rNFTs are burned upon redemption to prevent double spend
            </Typography>
          </StyledGrid>
        </div>
      )}
      {(chatError || redeemError) && <SimpleError />}
      <Grid padding="2rem 0 0 0" justifyContent="space-between">
        <RedeemButton
          disabled={isLoading || !isInitializationValid}
          exchangeId={exchangeId}
          envName={CONFIG.envName}
          onError={(error) => {
            console.error("Error while redeeming", error);
            setRedeemError(error);
            setIsLoading(false);
            setLoading?.(false);
            const hasUserRejectedTx =
              "code" in error &&
              (error as unknown as { code: string }).code === "ACTION_REJECTED";
            if (hasUserRejectedTx) {
              showModal("CONFIRMATION_FAILED");
            }
          }}
          onPendingSignature={async () => {
            setRedeemError(null);
            setIsLoading(true);
            setLoading?.(true);
            await sendDeliveryDetailsToChat();
            showModal("WAITING_FOR_CONFIRMATION");
          }}
          onPendingTransaction={(hash, isMetaTx) => {
            showModal("TRANSACTION_SUBMITTED", {
              action: "Redeem",
              txHash: hash
            });
            addPendingTransaction({
              type: subgraph.EventType.VoucherRedeemed,
              hash,
              isMetaTx,
              accountType: "Buyer",
              exchange: {
                id: exchangeId,
                offer: {
                  id: offerId
                }
              }
            });
          }}
          onSuccess={async (_, { exchangeId }) => {
            let createdExchange: subgraph.ExchangeFieldsFragment;
            await poll(
              async () => {
                createdExchange = await coreSDK.getExchangeById(exchangeId);
                return createdExchange.redeemedDate;
              },
              (redeemedDate) => {
                return !redeemedDate;
              },
              500
            );
            setIsLoading(false);
            setLoading?.(false);
            hideModal();
            toast((t) => (
              <SuccessTransactionToast
                t={t}
                action={`Redeemed exchange: ${offerName}`}
                onViewDetails={() => {
                  showModal("REDEEM_SUCCESS", {
                    title: "Congratulations!",
                    name: nameField.value,
                    streetNameAndNumber: streetNameAndNumberField.value,
                    city: cityField.value,
                    state: stateField.value,
                    zip: zipField.value,
                    country: countryField.value,
                    email: emailField.value
                  });
                }}
              />
            ));

            reload?.();
          }}
          web3Provider={signer?.provider as Provider}
        >
          <Grid gap="0.5rem">
            Confirm address and redeem
            {isLoading && <Spinner size="20" />}
          </Grid>
        </RedeemButton>
        <Button theme="outline" onClick={() => onBackClick()}>
          Back
        </Button>
      </Grid>
    </>
  );
}
