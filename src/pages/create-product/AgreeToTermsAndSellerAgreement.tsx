import { Checkbox } from "components/form";
import { useModal } from "components/modal/useModal";
import { usePreviewOffers } from "components/product/utils/usePreviewOffers";
import { Grid } from "components/ui/Grid";
import { colors } from "lib/styles/colors";
import { useForm } from "lib/utils/hooks/useForm";
import React from "react";
import styled from "styled-components";

const VariantsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin: 1rem 0 2rem 0;
  * {
    border: 1px solid ${colors.greyLight};
    padding: 0.5rem;
  }
`;

type AgreeToTermsAndSellerAgreementProps = {
  isMultiVariant: boolean;
};

export const AgreeToTermsAndSellerAgreement: React.FC<
  AgreeToTermsAndSellerAgreementProps
> = ({ isMultiVariant }) => {
  const { showModal } = useModal();
  const { values } = useForm();

  const previewOffers = usePreviewOffers({
    isMultiVariant
  });

  return (
    <Grid flexDirection="column" alignItems="flex-start">
      <Checkbox
        name="confirmProductDetails.acceptsTerms"
        text={
          <div style={{ all: "unset" }}>
            By confirming, you agree to the{" "}
            {previewOffers.length === 1 ? (
              <button
                style={{ color: colors.blue }}
                onClick={() =>
                  showModal("REDEEMABLE_NFT_TERMS", {
                    offerData: previewOffers?.[0].id
                      ? undefined
                      : previewOffers[0],
                    offerId: previewOffers?.[0].id
                      ? previewOffers[0].id
                      : undefined
                  })
                }
                type="button"
              >
                rNFT terms
              </button>
            ) : (
              <>rNFT terms</>
            )}{" "}
            and the{" "}
            {previewOffers.length === 1 ? (
              <button
                style={{ color: colors.blue }}
                onClick={() =>
                  showModal("BUYER_SELLER_AGREEMENT", {
                    offerData: previewOffers[0]
                  })
                }
                type="button"
              >
                Buyer and Seller Agreement
              </button>
            ) : (
              <>Buyer and Seller Agreements</>
            )}{" "}
            and acknowledge that you have read and understood both documents.
          </div>
        }
      />
      {previewOffers.length > 1 && (
        <VariantsGrid>
          <b>Variant</b>
          <div></div>
          <div></div>
          {previewOffers.map((offer, index) => {
            const { variants = [] } = values.productVariants;
            const variant = variants[index];
            return (
              <>
                <div>{variant.name}</div>
                <button
                  style={{ color: colors.blue }}
                  onClick={() =>
                    showModal("REDEEMABLE_NFT_TERMS", {
                      offerData: offer?.id ? undefined : offer,
                      offerId: offer?.id ? offer.id : undefined
                    })
                  }
                  type="button"
                >
                  rNFT terms
                </button>
                <button
                  style={{ color: colors.blue }}
                  onClick={() =>
                    showModal("BUYER_SELLER_AGREEMENT", {
                      offerData: offer
                    })
                  }
                  type="button"
                >
                  Buyer and Seller Agreement
                </button>
              </>
            );
          })}
        </VariantsGrid>
      )}
    </Grid>
  );
};
