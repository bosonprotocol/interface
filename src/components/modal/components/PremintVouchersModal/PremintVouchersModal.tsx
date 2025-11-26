import {
  PreMintButton,
  Provider,
  ReserveRangeButton,
  Typography
} from "@bosonprotocol/react-kit";
import { useConfigContext } from "components/config/ConfigContext";
import { Form, Formik } from "formik";
import { colors } from "lib/styles/colors";
import { Offer } from "lib/types/offer";
import { useSigner } from "lib/utils/hooks/connection/connection";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import SimpleError from "../../../error/SimpleError";
import { useModal } from "../../useModal";
import { FormType, validationSchemas } from "./form";
import { PremintVouchersForm } from "./PremintVouchersForm";

interface PremintVouchersModalProps {
  offer?: Offer;
  offerId?: string;
  refetch: () => void;
}

const PremintButtonWrapper = styled.div`
  button {
    background: transparent;
    border-color: ${colors.orange};
    color: ${colors.orange};
    &:hover {
      background: ${colors.orange};
      border-color: ${colors.orange};
      color: ${colors.white};
    }
  }
`;

const ReserveRangeButtonWrapper = styled.div`
  button {
    background: transparent;
    border-color: ${colors.orange};
    color: ${colors.orange};
    &:hover {
      background: ${colors.orange};
      border-color: ${colors.orange};
      color: ${colors.white};
    }
  }
`;

export const PremintVouchersModal: React.FC<PremintVouchersModalProps> = ({
  offerId,
  offer,
  refetch
}) => {
  const [hasError, setError] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const { hideModal } = useModal();
  const signer = useSigner();
  const { config } = useConfigContext();

  // If the offer doesnt have reserved range, the seller shall specify the quantity to be reserved, then the ReserveRange button shall be clicked
  // When the offer has already a reserved range, we prefill the form's rangeQuantity it can't be changed
  // The number of vouchers to be preminted is specified in the premintQuantity field and can't exceed the reserved range length + the number of already minted vouchers

  const [rangeLength, setRangeLength] = useState<number>(0);
  const [minted, setMinted] = useState<number>(0);
  const rangeToContract =
    offer?.range &&
    offer.collection &&
    offer.range.owner === offer.collection.collectionContract.address;
  const initialValues = {
    to: rangeToContract
      ? { value: "contract", label: "voucher contract", disabled: false }
      : { value: "seller", label: "seller wallet", disabled: false },
    rangeLength: rangeLength || Number(offer?.quantityAvailable || "1"),
    premintQuantity: rangeLength - minted
  };
  const [values, setValues] = useState<FormType>(initialValues);
  useEffect(() => {
    if (offer?.range) {
      setRangeLength(Number(offer.range.end) - Number(offer.range.start) + 1);
      setMinted(Number(offer.range.minted));
    }
  }, [offer?.range]);

  return (
    <div>
      <Typography tag="h6">What are preminted vouchers?</Typography>
      <Typography tag="p" margin="0">
        The seller can premint one or more vouchers for an offer. A preminted
        voucher is an NFT that can be traded on an NFT marketplace. When a buyer
        acquires the NFT, the resulting NFT transfer is causing the offer to be
        committed to on behalf of the buyer.
      </Typography>
      <p></p>
      <Formik<FormType>
        initialValues={initialValues}
        onSubmit={async (_values) => {
          console.log("Submitting form with values: ", _values);
          // setValues(_values);
        }}
        validate={async (_values) => {
          console.log("Validating form with values: ", _values);
          setValues(_values);
        }}
        validateOnMount
        validationSchema={
          rangeLength > 0
            ? validationSchemas.premintVouchers
            : validationSchemas.reserveRange
        }
        enableReinitialize
        validateOnChange
      >
        {() => {
          return (
            <Form>
              <PremintVouchersForm
                isRangeReserved={rangeLength > 0}
                alreadyMinted={minted}
                availableQuantity={Number(offer?.quantityAvailable || "0")}
                onValidityChanged={(isValid) => {
                  setError(!isValid);
                }}
              >
                {hasError && <SimpleError />}
                {rangeLength === 0 ? (
                  <ReserveRangeButtonWrapper>
                    <ReserveRangeButton
                      coreSdkConfig={{
                        envName: config.envName,
                        configId: config.envConfig.configId,
                        web3Provider: signer?.provider as Provider,
                        metaTx: config.metaTx
                      }}
                      disabled={hasError || isLoading}
                      offerId={offerId || ""}
                      length={values?.rangeLength || 0}
                      to={
                        (values?.to?.value as "seller" | "contract") || "none"
                      }
                      onPendingSignature={() => {
                        setLoading(true);
                      }}
                      onPendingTransaction={() => {
                        setLoading(true);
                      }}
                      onSuccess={async (_, { length }) => {
                        setLoading(false);
                        refetch();
                        setRangeLength(length);
                      }}
                      onError={(error) => {
                        setLoading(false);
                        console.error(error);
                        setError(true);
                      }}
                    />
                  </ReserveRangeButtonWrapper>
                ) : (
                  <PremintButtonWrapper>
                    <PreMintButton
                      type="submit"
                      disabled={hasError || isLoading}
                      coreSdkConfig={{
                        envName: config.envName,
                        configId: config.envConfig.configId,
                        web3Provider: signer?.provider as Provider,
                        metaTx: config.metaTx
                      }}
                      offerId={offerId || ""}
                      amount={values?.premintQuantity || 0}
                      metaTxApiId={
                        config.metaTx
                          ? config.metaTx.apiIds?.["FORWARDER"]?.["FORWARD"]
                          : undefined
                      }
                      onPendingSignature={() => {
                        setLoading(true);
                      }}
                      onPendingTransaction={() => {
                        setLoading(true);
                      }}
                      onSuccess={async () => {
                        setLoading(false);
                        refetch();
                        hideModal();
                      }}
                      onError={() => {
                        setLoading(false);
                        setError(true);
                      }}
                    />
                  </PremintButtonWrapper>
                )}
              </PremintVouchersForm>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
