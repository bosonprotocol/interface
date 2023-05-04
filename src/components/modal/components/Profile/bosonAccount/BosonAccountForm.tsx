import * as Sentry from "@sentry/browser";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";

import { useCurrentSellers } from "../../../../../lib/utils/hooks/useCurrentSellers";
import { useIpfsStorage } from "../../../../../lib/utils/hooks/useIpfsStorage";
import Grid from "../../../../ui/Grid";
import Typography from "../../../../ui/Typography";
import BosonAccountFormFields from "./BosonAccountFormFields";
import { BosonAccount, bosonAccountValidationSchema } from "./validationSchema";

interface Props {
  onSubmit: (createValues: BosonAccount) => void;
  onBackClick: () => void;
  formValues: BosonAccount | null;
  submitButtonText?: string;
}

export default function BosonAccountForm({
  onSubmit,
  onBackClick,
  formValues,
  submitButtonText
}: Props) {
  const ipfsMetadataStorage = useIpfsStorage();
  const [isError, setIsError] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<BosonAccount>(
    formValues ?? {
      secondaryRoyalties: 0,
      addressForRoyaltyPayment: ""
    }
  );
  const { sellers } = useCurrentSellers();
  const seller = sellers?.[0];
  const { contractURI } = seller || {};
  const alreadyHasRoyaltiesDefined = !!contractURI;
  useEffect(() => {
    if (contractURI && !formValues) {
      (async () => {
        try {
          const openSeaMetadata = await ipfsMetadataStorage.get<{
            name: string;
            description: string;
            image: string;
            external_link: string;
            seller_fee_basis_points: string;
            fee_recipient: string;
          }>(contractURI, true);
          if (typeof openSeaMetadata !== "string") {
            setInitialValues({
              secondaryRoyalties:
                Number(openSeaMetadata.seller_fee_basis_points) / 100,
              addressForRoyaltyPayment: openSeaMetadata.fee_recipient
            });
          }
        } catch (error) {
          console.error(error);
          Sentry.captureException(error);
          setIsError(true);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractURI]);
  return (
    <Grid flexDirection="column" gap="0.5rem" alignItems="flex-start">
      <Typography fontWeight="600" $fontSize="2rem" lineHeight="2.4rem">
        Boson Account
      </Typography>
      <Typography>
        You are creating a seller account in Boson Protocol. Input the relevant
        information relating to your secondary royalty
      </Typography>
      <Formik<BosonAccount>
        initialValues={initialValues}
        onSubmit={(values) => {
          const percentage = values.secondaryRoyalties || 0;
          onSubmit({
            secondaryRoyalties: percentage,
            addressForRoyaltyPayment: values.addressForRoyaltyPayment
          });
        }}
        enableReinitialize
        validationSchema={bosonAccountValidationSchema}
      >
        <Form style={{ width: "100%" }}>
          <BosonAccountFormFields
            onBackClick={onBackClick}
            alreadyHasRoyaltiesDefined={alreadyHasRoyaltiesDefined}
            isError={isError}
            submitButtonText={submitButtonText}
          />
        </Form>
      </Formik>
    </Grid>
  );
}
