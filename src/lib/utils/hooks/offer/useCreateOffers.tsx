import { TransactionResponse } from "@bosonprotocol/common";
import { accounts, hooks, offers, subgraph } from "@bosonprotocol/react-kit";
import { poll } from "lib/utils/promises";
import toast from "react-hot-toast";
import { useMutation } from "react-query";

import { useModal } from "../../../../components/modal/useModal";
import { TOKEN_TYPES } from "../../../../components/product/utils";
import LoadingToast from "../../../../components/toasts/common/LoadingToast";
import {
  buildCondition,
  PartialTokenGating
} from "../../../../pages/create-product/utils/buildCondition";
import { useCoreSDK } from "../../useCoreSdk";
import { useAddPendingTransaction } from "../transactions/usePendingTransactions";

const getOfferCreationToast = () => {
  const toastId = toast((t) => {
    t.duration = Infinity;
    return <LoadingToast t={t}>Offer creation in progress</LoadingToast>;
  });
  return toastId;
};

type OfferFieldsFragment = subgraph.OfferFieldsFragment;

type UseCreateOffersProps = {
  sellerToCreate: accounts.CreateSellerArgs | null;
  offersToCreate: offers.CreateOfferArgs[];
  tokenGatedInfo?: PartialTokenGating | null;
  conditionDecimals?: number;
  onGetExchangeTokenDecimals?: (decimals: number | undefined) => unknown;
  onCreatedOffersWithVariants?: (arg0: {
    firstOffer: OfferFieldsFragment;
    createdOffers: OfferFieldsFragment[];
  }) => void;
  onCreatedSingleOffers?: (arg0: { offer: OfferFieldsFragment }) => void;
};

export function useCreateOffers() {
  const coreSDK = useCoreSDK();
  const { isMetaTx } = hooks.useMetaTx(coreSDK);
  const { showModal, hideModal } = useModal();
  const addPendingTransaction = useAddPendingTransaction();

  return useMutation(
    async ({
      sellerToCreate,
      offersToCreate,
      tokenGatedInfo,
      conditionDecimals,
      onGetExchangeTokenDecimals,
      onCreatedOffersWithVariants,
      onCreatedSingleOffers
    }: UseCreateOffersProps): Promise<void | {
      txResponse: TransactionResponse | undefined;
    }> => {
      let toastId: string | undefined;
      let txResponse: TransactionResponse | undefined;
      try {
        const hasSellerAccount = !sellerToCreate;
        const isTokenGated = !!tokenGatedInfo;
        const onBeforeBuildCondition = async () => {
          let decimalsLocal: number | undefined = conditionDecimals;
          if (
            tokenGatedInfo?.tokenContract &&
            tokenGatedInfo.tokenType?.value === TOKEN_TYPES[0].value
          ) {
            try {
              const { decimals: tokenDecimals } =
                await coreSDK.getExchangeTokenInfo(
                  tokenGatedInfo.tokenContract
                );
              decimalsLocal = tokenDecimals;
              onGetExchangeTokenDecimals?.(decimalsLocal);
            } catch (error) {
              decimalsLocal = undefined;
              onGetExchangeTokenDecimals?.(decimalsLocal);
            }
          }
          return decimalsLocal;
        };
        showModal("WAITING_FOR_CONFIRMATION", undefined, "auto", undefined, {
          xs: "400px"
        });
        if (!sellerToCreate && !hasSellerAccount) {
          return showModal(
            "TRANSACTION_FAILED",
            {
              errorMessage: "Can't create seller",
              detailedErrorMessage:
                "No seller data was provided to create a seller account"
            },
            "auto",
            undefined,
            {
              xs: "400px"
            }
          );
        }
        // seller should always exist at this point as it should have been created in the modal at the beginning of the offer creation flow
        const seller: accounts.CreateSellerArgs | null = sellerToCreate;
        if (offersToCreate.length > 1) {
          if (!hasSellerAccount && seller) {
            if (isMetaTx) {
              // createSeller with meta-transaction
              const nonce = Date.now();
              const { r, s, v, functionName, functionSignature } =
                await coreSDK.signMetaTxCreateSeller({
                  createSellerArgs: seller,
                  nonce
                });
              txResponse = await coreSDK.relayMetaTransaction({
                functionName,
                functionSignature,
                sigR: r,
                sigS: s,
                sigV: v,
                nonce
              });
            } else {
              txResponse = await coreSDK.createSeller(seller);
            }
            showModal(
              "TRANSACTION_SUBMITTED",
              {
                action: "Create seller",
                txHash: txResponse.hash
              },
              "auto",
              undefined,
              {
                xs: "400px"
              }
            );
            addPendingTransaction({
              type: subgraph.EventType.SellerCreated,
              hash: txResponse.hash,
              isMetaTx,
              accountType: "Seller"
            });
            await txResponse.wait();
            showModal(
              "WAITING_FOR_CONFIRMATION",
              undefined,
              "auto",
              undefined,
              {
                xs: "400px"
              }
            );
          }
          if (isMetaTx) {
            // createOfferBatch with meta-transaction
            const nonce = Date.now();
            const { r, s, v, functionName, functionSignature } =
              await coreSDK.signMetaTxCreateOfferBatch({
                createOffersArgs: offersToCreate,
                nonce
              });
            txResponse = await coreSDK.relayMetaTransaction({
              functionName,
              functionSignature,
              sigR: r,
              sigS: s,
              sigV: v,
              nonce
            });
          } else {
            txResponse = await coreSDK.createOfferBatch(offersToCreate);
          }
          showModal(
            "TRANSACTION_SUBMITTED",
            {
              action: `Create ${offersToCreate.length} offers`,
              txHash: txResponse.hash
            },
            "auto",
            undefined,
            {
              xs: "400px"
            }
          );
          addPendingTransaction({
            type: subgraph.EventType.OfferCreated,
            hash: txResponse.hash,
            isMetaTx,
            accountType: "Seller"
          });
          const txReceipt = await txResponse.wait();
          const offerIds = coreSDK.getCreatedOfferIdsFromLogs(txReceipt.logs);

          if (isTokenGated) {
            showModal(
              "WAITING_FOR_CONFIRMATION",
              undefined,
              "auto",
              undefined,
              {
                xs: "400px"
              }
            );
            const decimals = await onBeforeBuildCondition();
            const condition = buildCondition(tokenGatedInfo, decimals);

            if (isMetaTx) {
              const nonce = Date.now();
              const { r, s, v, functionName, functionSignature } =
                await coreSDK.signMetaTxCreateGroup({
                  createGroupArgs: { offerIds, ...condition },
                  nonce
                });
              txResponse = await coreSDK.relayMetaTransaction({
                functionName,
                functionSignature,
                sigR: r,
                sigS: s,
                sigV: v,
                nonce
              });
            } else {
              txResponse = await coreSDK.createGroup({
                offerIds,
                ...condition
              });
            }
            showModal(
              "TRANSACTION_SUBMITTED",
              {
                action: "Create condition group for offers",
                txHash: txResponse.hash
              },
              "auto",
              undefined,
              {
                xs: "400px"
              }
            );
            await txResponse.wait();
          }
          toastId = getOfferCreationToast();
          let createdOffers: OfferFieldsFragment[] | null = null;
          await poll(
            async () => {
              createdOffers = (
                await Promise.all(
                  offerIds.map((offerId) =>
                    coreSDK.getOfferById(offerId as string)
                  )
                )
              ).filter((offer) => !!offer);
              return createdOffers;
            },
            (offers) => {
              return offers.length !== offerIds.length;
            },
            500
          );
          toast.dismiss(toastId);
          const allCreatedOffers =
            createdOffers as unknown as OfferFieldsFragment[];
          const [firstOffer] = allCreatedOffers;
          onCreatedOffersWithVariants?.({
            firstOffer,
            createdOffers: allCreatedOffers
          });
        } else {
          // no variants
          const [offerData] = offersToCreate;
          if (isMetaTx) {
            // meta-transaction
            if (!hasSellerAccount && seller) {
              // createSeller with meta-transaction
              const nonce = Date.now();
              const { r, s, v, functionName, functionSignature } =
                await coreSDK.signMetaTxCreateSeller({
                  createSellerArgs: seller,
                  nonce
                });
              const createSellerResponse = await coreSDK.relayMetaTransaction({
                functionName,
                functionSignature,
                sigR: r,
                sigS: s,
                sigV: v,
                nonce
              });
              showModal(
                "TRANSACTION_SUBMITTED",
                {
                  action: "Create seller",
                  txHash: createSellerResponse.hash
                },
                "auto",
                undefined,
                {
                  xs: "400px"
                }
              );
              addPendingTransaction({
                type: subgraph.EventType.SellerCreated,
                hash: createSellerResponse.hash,
                isMetaTx,
                accountType: "Seller"
              });
              await createSellerResponse.wait();
              showModal(
                "WAITING_FOR_CONFIRMATION",
                undefined,
                "auto",
                undefined,
                {
                  xs: "400px"
                }
              );
            }
            // createOffer with meta-transaction
            const nonce = Date.now();
            if (isTokenGated) {
              const decimals = await onBeforeBuildCondition();
              const condition = buildCondition(tokenGatedInfo, decimals);
              const { r, s, v, functionName, functionSignature } =
                await coreSDK.signMetaTxCreateOfferWithCondition({
                  offerToCreate: offerData,
                  condition,
                  nonce
                });
              txResponse = await coreSDK.relayMetaTransaction({
                functionName,
                functionSignature,
                sigR: r,
                sigS: s,
                sigV: v,
                nonce
              });
            } else {
              const { r, s, v, functionName, functionSignature } =
                await coreSDK.signMetaTxCreateOffer({
                  createOfferArgs: offerData,
                  nonce
                });
              txResponse = await coreSDK.relayMetaTransaction({
                functionName,
                functionSignature,
                sigR: r,
                sigS: s,
                sigV: v,
                nonce
              });
            }
          } else {
            // no meta tx
            if (isTokenGated) {
              const decimals = await onBeforeBuildCondition();
              const condition = buildCondition(tokenGatedInfo, decimals);
              txResponse =
                !hasSellerAccount && seller
                  ? await coreSDK.createSellerAndOfferWithCondition(
                      seller,
                      offerData,
                      condition
                    )
                  : await coreSDK.createOfferWithCondition(
                      offerData,
                      condition
                    );
            } else {
              txResponse =
                !hasSellerAccount && seller
                  ? await coreSDK.createSellerAndOffer(seller, offerData)
                  : await coreSDK.createOffer(offerData);
            }
          }
          showModal(
            "TRANSACTION_SUBMITTED",
            {
              action: "Create offer",
              txHash: txResponse.hash
            },
            "auto",
            undefined,
            {
              xs: "400px"
            }
          );

          addPendingTransaction({
            type: subgraph.EventType.OfferCreated,
            hash: txResponse.hash,
            isMetaTx,
            accountType: "Seller"
          });

          if (!hasSellerAccount && seller) {
            addPendingTransaction({
              type: subgraph.EventType.SellerCreated,
              hash: txResponse.hash,
              isMetaTx,
              accountType: "Seller"
            });
          }

          const txReceipt = await txResponse.wait();
          const offerId = coreSDK.getCreatedOfferIdFromLogs(txReceipt.logs);
          if (!offerId) {
            return;
          }
          let createdOffer: OfferFieldsFragment | null = null;
          toastId = getOfferCreationToast();
          await poll(
            async () => {
              createdOffer = await coreSDK.getOfferById(offerId);
              return createdOffer;
            },
            (offer) => {
              return !offer;
            },
            500
          );
          toast.dismiss(toastId);
          if (!createdOffer) {
            return;
          }

          onCreatedSingleOffers?.({
            offer: createdOffer
          });
        }

        hideModal();
      } finally {
        if (toastId) {
          toast.dismiss(toastId);
        }
      }
      return { txResponse };
    }
  );
}
