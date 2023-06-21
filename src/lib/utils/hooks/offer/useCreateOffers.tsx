import { accounts, offers, subgraph } from "@bosonprotocol/react-kit";
import { useMutation } from "react-query";
import { useAccount } from "wagmi";

import { useModal } from "../../../../components/modal/useModal";
import { TOKEN_TYPES } from "../../../../components/product/utils";
import { poll } from "../../../../pages/create-product/utils";
import {
  buildCondition,
  PartialTokenGating
} from "../../../../pages/create-product/utils/buildCondition";
import { useCoreSDK } from "../../useCoreSdk";
import { useAddPendingTransaction } from "../transactions/usePendingTransactions";

type OfferFieldsFragment = subgraph.OfferFieldsFragment;

type UseCreateOffersProps = {
  sellerToCreate: accounts.CreateSellerArgs | null;
  offersToCreate: offers.CreateOfferArgs[];
  isMultiVariant: boolean;
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
  const { address } = useAccount();
  const { showModal, hideModal } = useModal();
  const addPendingTransaction = useAddPendingTransaction();
  const isMetaTx = Boolean(coreSDK.isMetaTxConfigSet && address);
  return useMutation(
    async ({
      sellerToCreate,
      offersToCreate,
      isMultiVariant,
      tokenGatedInfo,
      conditionDecimals,
      onGetExchangeTokenDecimals,
      onCreatedOffersWithVariants,
      onCreatedSingleOffers
    }: UseCreateOffersProps) => {
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
              await coreSDK.getExchangeTokenInfo(tokenGatedInfo.tokenContract);
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
      let txResponse;
      if (isMultiVariant) {
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
          showModal("WAITING_FOR_CONFIRMATION", undefined, "auto", undefined, {
            xs: "400px"
          });
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
            action: "Create offer with variants",
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
          showModal("WAITING_FOR_CONFIRMATION", undefined, "auto", undefined, {
            xs: "400px"
          });
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
            txResponse = await coreSDK.createGroup({ offerIds, ...condition });
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
                : await coreSDK.createOfferWithCondition(offerData, condition);
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
        let createdOffer: OfferFieldsFragment | null = null;
        await poll(
          async () => {
            createdOffer = await coreSDK.getOfferById(offerId as string);
            return createdOffer;
          },
          (offer) => {
            return !offer;
          },
          500
        );
        if (!createdOffer) {
          return;
        }

        onCreatedSingleOffers?.({
          offer: createdOffer
        });
      }

      hideModal();
    }
  );
}
