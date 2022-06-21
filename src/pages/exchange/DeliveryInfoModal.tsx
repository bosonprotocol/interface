import { ethers } from "ethers";
import { useFormik } from "formik";
import { useMemo, useState } from "react";
import styled from "styled-components";

import CopyBadge from "../../components/copyBadge/CopyBadge";
import { Modal } from "../../components/modal/Modal";
import {
  FormControl,
  FormElement,
  FormElementsContainer,
  FormLabel,
  StyledForm
} from "../create-offer/CreateOffer";
import { encryptData } from "./crypto";

const ModalContent = styled.div`
  margin: -35px 5% 0 5%;
`;

const Title = styled.p`
  font-size: 1.8rem;
  text-align: center;
  margin: 0;
`;

const Body = styled.p`
  text-align: center;
  margin-bottom: 22px;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const EncryptedDeliveryInfo = styled.pre`
  all: unset;
  display: block;
  position: relative;
  code {
    overflow-wrap: break-word;
  }
`;

const CTA = styled.button`
  background-color: var(--secondary);
  color: var(--accentDark);
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
`;

const BackButton = styled(CTA)``;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  exchangeId: string;
  onClickToChat: () => void;
}

interface DeliveryInfoFields {
  name: string;
  streetNameAndNumber: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  email: string;
}

export default function DeliveryInfoModal({
  isOpen,
  onClose,
  exchangeId,
  onClickToChat
}: Props) {
  const [isFirstPage, setIsFirstPage] = useState<boolean>(true);
  const [encryptedDeliveryInfo, setEncryptedDeliveryInfo] = useState<string>();
  const styles = useMemo(
    () => ({
      width: "60%"
    }),
    []
  );
  const requestPublicKey = async () => {
    if (!window.ethereum) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);

    await provider.send("eth_requestAccounts", []);

    const signer = provider.getSigner();

    const walletAddress = await signer.getAddress();

    const publicKey = await provider.send("eth_getEncryptionPublicKey", [
      walletAddress
    ]);

    return publicKey;
  };
  const { values, handleChange, handleSubmit } = useFormik<DeliveryInfoFields>({
    initialValues: {
      name: "",
      streetNameAndNumber: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      email: ""
    },
    onSubmit: async (values: DeliveryInfoFields) => {
      const publicKey = await requestPublicKey();

      // TODO: encrypt 'values' with the seller's public key
      setEncryptedDeliveryInfo(encryptData(publicKey, JSON.stringify(values)));

      setIsFirstPage(false);
    }
  });

  return (
    <Modal isOpen={isOpen} onClose={() => onClose()} $styles={styles}>
      <ModalContent>
        {exchangeId ? (
          <>
            <Title>Redeem your item</Title>
            {isFirstPage ? (
              <>
                <p>Input your address</p>
                <StyledForm onSubmit={handleSubmit}>
                  <FormElementsContainer>
                    <FormElement>
                      <FormLabel>Name</FormLabel>
                      <FormControl
                        value={values.name}
                        onChange={handleChange}
                        name="name"
                        type="text"
                        placeholder="..."
                      />
                    </FormElement>
                    <FormElement>
                      <FormLabel>Street Name and Number</FormLabel>
                      <FormControl
                        value={values.streetNameAndNumber}
                        onChange={handleChange}
                        name="streetNameAndNumber"
                        type="text"
                        placeholder="..."
                      />
                    </FormElement>
                    <FormElement>
                      <FormLabel>City</FormLabel>
                      <FormControl
                        value={values.city}
                        onChange={handleChange}
                        name="city"
                        type="text"
                        placeholder="..."
                      />
                    </FormElement>
                    <FormElement>
                      <FormLabel>State</FormLabel>

                      <FormControl
                        value={values.state}
                        onChange={handleChange}
                        name="state"
                        type="text"
                        placeholder="..."
                      />
                    </FormElement>
                    <FormElement>
                      <FormLabel>ZIP</FormLabel>
                      <FormControl
                        value={values.zip}
                        onChange={handleChange}
                        name="zip"
                        type="text"
                        placeholder="..."
                      />
                    </FormElement>
                    <FormElement>
                      <FormLabel>Country</FormLabel>
                      <FormControl
                        value={values.country}
                        onChange={handleChange}
                        name="country"
                        type="text"
                        placeholder="..."
                      />
                    </FormElement>
                    <FormElement>
                      <FormLabel>Email</FormLabel>
                      <FormControl
                        value={values.email}
                        onChange={handleChange}
                        name="email"
                        type="email"
                        placeholder="..."
                      />
                    </FormElement>
                  </FormElementsContainer>
                  <Buttons>
                    <CTA type="submit">Continue</CTA>
                  </Buttons>
                </StyledForm>
              </>
            ) : (
              <>
                <p>Your delivery info has been encrypted:</p>
                <EncryptedDeliveryInfo>
                  <CopyBadge textToCopy={encryptedDeliveryInfo || ""} />
                  <code>{encryptedDeliveryInfo}</code>
                </EncryptedDeliveryInfo>

                <p>
                  Please copy it and click on the following button to open a
                  conversation with the seller and paste it there
                </p>
                <Buttons>
                  <BackButton
                    type="button"
                    onClick={() => setIsFirstPage(true)}
                  >
                    Back
                  </BackButton>
                  <BackButton type="button" onClick={() => onClickToChat()}>
                    Continue
                  </BackButton>
                </Buttons>
              </>
            )}
          </>
        ) : (
          <>
            <Title>Error</Title>
            <Body>Something has gone wrong</Body>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
