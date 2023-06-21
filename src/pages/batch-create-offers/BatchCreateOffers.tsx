/* eslint-disable @typescript-eslint/no-empty-function */
import { offers } from "@bosonprotocol/react-kit";
import { Form, Formik } from "formik";
import { useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";

import DetailTable, { Data } from "../../components/detail/DetailTable";
import { FormField } from "../../components/form";
import { useModal } from "../../components/modal/useModal";
import {
  ContainerProductPage,
  SectionTitle
} from "../../components/product/Product.styles";
import SuccessTransactionToast from "../../components/toasts/SuccessTransactionToast";
import BosonButton from "../../components/ui/BosonButton";
import Typography from "../../components/ui/Typography";
import { useCreateOffers } from "../../lib/utils/hooks/offer/useCreateOffers";
import { useOffers } from "../../lib/utils/hooks/offers";
import { useGetOfferMetadata } from "../../lib/utils/hooks/offers/useGetOfferMetadata";
import { useCurrentSellers } from "../../lib/utils/hooks/useCurrentSellers";

// see https://dev.to/atosh502/file-uploads-and-validation-with-react-and-formik-2mbk

const FileUpload = ({ fileRef, name, onChange }: any) => {
  return (
    <div>
      <label htmlFor="files">Choose files</label>{" "}
      <input
        ref={fileRef}
        multiple={true}
        type="file"
        name={name}
        onChange={onChange}
      />
    </div>
  );
};

const ButtonsSection = styled.div`
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
`;

const readOffersList = async (
  file: File
): Promise<offers.CreateOfferArgs[]> => {
  return new Promise<any>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = (e: ProgressEvent<FileReader>) => {
      const text = e.target?.result?.toString() || "";
      console.log(text);
      const json = JSON.parse(text) as offers.CreateOfferArgs[];
      console.log(json);
      if (Array.isArray(json)) {
        json.forEach((o: offers.CreateOfferArgs) => {
          if (!o.metadataHash || !o.metadataUri) {
            reject(`Invalid content from file ${file.name}`);
            return;
          }
        });
        resolve(json);
      } else {
        reject(`Invalid content from file ${file.name}`);
      }
    };
    reader.onerror = (error) => {
      console.error(error);
      reject(error);
    };
    reader.readAsText(file);
  });
};

function BatchCreateOffers() {
  const [tableData, setTableData] = useState<Data[]>([]);
  const [offersList, setOffersList] = useState<offers.CreateOfferArgs[]>([]);
  const [offersToBeCreated, setOffersToBeCreated] = useState<
    offers.CreateOfferArgs[]
  >([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [invalidFile, setInvalidFile] = useState(false);
  const [decimals, setDecimals] = useState<number | undefined>(undefined);

  const fileRef = useRef<{ files: File[] | null } | null>(null);

  const currentSeller = useCurrentSellers();
  const { mutateAsync: createOffers } = useCreateOffers();
  const { showModal } = useModal();

  useMemo(async () => {
    if (selectedFile) {
      try {
        setOffersList(await readOffersList(selectedFile));
        setInvalidFile(false);
      } catch (e) {
        setOffersList([]);
        setInvalidFile(true);
      }
    } else {
      setOffersList([]);
      setInvalidFile(false);
    }
  }, [selectedFile]);

  const sellerOffers = useOffers(
    {
      sellerId: currentSeller.sellerIds[0]
    },
    {
      enabled:
        !!selectedFile &&
        !!currentSeller.sellerIds &&
        currentSeller.sellerIds.length > 0 &&
        !!offersList &&
        offersList.length > 0
    }
  );

  const offerMetadatas = useGetOfferMetadata(
    { metadataUris: offersList.map((offer) => offer.metadataUri) },
    {
      enabled: !!offersList && offersList.length > 0
    }
  );

  useMemo(async () => {
    console.log("offersList", offersList);
    const existingHashes: string[] = [];
    if (sellerOffers.isSuccess) {
      for (const offer of sellerOffers.data) {
        const hash = offer.metadataHash;
        if (!existingHashes.includes(hash)) {
          existingHashes.push(hash);
        }
      }
    }
    const existingOffers: offers.CreateOfferArgs[] = [];
    const notExistingOffers: offers.CreateOfferArgs[] = [];
    const existing: Data[] = [];
    const notExisting: Data[] = [];
    for (let i = 0; i < offersList.length; i++) {
      const offer = offersList[i];
      const metadata = offerMetadatas.isSuccess
        ? offerMetadatas.data?.[i]
        : undefined;
      const variation = metadata?.variations?.map((v) => v.option).join(" ");
      const name = metadata
        ? `${offer.metadataHash} (${metadata.name} ${variation || ""})`
        : offer.metadataHash;
      if (existingHashes.includes(offer.metadataHash)) {
        existingOffers.push(offer);
        existing.push({
          name,
          value: (
            <>
              <Typography tag="p">offer already exists</Typography>
            </>
          )
        });
      } else {
        notExistingOffers.push(offer);
        notExisting.push({
          name,
          value: (
            <>
              <Typography tag="p">to be created</Typography>
            </>
          )
        });
      }
    }
    setTableData([...notExisting, ...existing]);
    setOffersToBeCreated(notExistingOffers);
  }, [
    offersList,
    sellerOffers.isSuccess,
    sellerOffers.data,
    offerMetadatas.isSuccess,
    offerMetadatas.data
  ]);

  const handleCreateOffers = async () => {
    console.log(
      "Create Offers",
      offersToBeCreated.map((offer) => offer.metadataHash)
    );
    // TODO: call coreSDK to create the offers (taking into account the max number of offers that can be created in a batch transaction)
    try {
      await createOffers({
        sellerToCreate: null,
        offersToCreate: offersToBeCreated,
        tokenGatedInfo: null, // TODO: add token gated info
        conditionDecimals: decimals,
        onGetExchangeTokenDecimals: setDecimals,
        onCreatedOffersWithVariants: () => {
          toast((t) => (
            <SuccessTransactionToast
              t={t}
              action={`${offersToBeCreated.length} offers created`}
            />
          ));
        },
        onCreatedSingleOffers: ({ offer: createdOffer }) => {
          toast((t) => (
            <SuccessTransactionToast
              t={t}
              action={`Created offer: ${createdOffer?.metadata?.name}`}
            />
          ));
        }
      });
    } catch (error: any) {
      // TODO: FAILURE MODAL
      console.error("error->", error.errors ?? error);
      const hasUserRejectedTx =
        "code" in error &&
        (error as unknown as { code: string })?.code === "ACTION_REJECTED";
      if (hasUserRejectedTx) {
        showModal("TRANSACTION_FAILED");
      } else {
        showModal("TRANSACTION_FAILED", {
          errorMessage: "Something went wrong"
        });
      }
    }
  };

  return (
    <>
      <Formik
        initialValues={{ files: "" }}
        onSubmit={() => handleCreateOffers()}
      >
        <Form>
          <ContainerProductPage>
            <SectionTitle tag="h2">Batch Create Offers</SectionTitle>
            <FormField
              title="Offers list"
              required
              subTitle="Upload the JSON file which list all offers to be created."
            >
              <FileUpload
                name="files"
                fileRef={fileRef}
                onChange={(e: any) => {
                  console.log("setSelectedFile", e.target.files[0]);
                  setSelectedFile(e.target.files[0]);
                }}
              />
            </FormField>
          </ContainerProductPage>
          <DetailTable data={tableData}></DetailTable>
          {invalidFile && <p>Invalid file</p>}
          <ButtonsSection>
            <BosonButton
              type="submit"
              variant="primaryFill"
              disabled={!offersToBeCreated || offersToBeCreated.length == 0}
            >
              Create Offers
            </BosonButton>
          </ButtonsSection>{" "}
        </Form>
      </Formik>
    </>
  );
}

export default BatchCreateOffers;
