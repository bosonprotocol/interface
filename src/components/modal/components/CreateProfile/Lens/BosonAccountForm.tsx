import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { useIpfsStorage } from "../../../../../lib/utils/hooks/useIpfsStorage";
import { useSellers } from "../../../../../lib/utils/hooks/useSellers";
import Grid from "../../../../ui/Grid";
import Typography from "../../../../ui/Typography";
import { useModal } from "../../../useModal";
import BosonAccountFormFields from "./BosonAccountFormFields";
import ProfileMultiSteps from "./ProfileMultiSteps";
import { BosonAccount, bosonAccountValidationSchema } from "./validationSchema";

interface Props {
  onSubmit: (createValues: BosonAccount) => void;
  onBackClick: () => void;
  isExistingProfile: boolean;
  setStepBasedOnIndex: (index: number) => void;
  formValues: BosonAccount | null;
}

export default function BosonAccountForm({
  onSubmit,
  onBackClick,
  setStepBasedOnIndex,
  formValues,
  isExistingProfile
}: Props) {
  const ipfsMetadataStorage = useIpfsStorage();
  const [isError, setIsError] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<BosonAccount>(
    formValues ?? {
      secondaryRoyalties: 0,
      addressForRoyaltyPayment: ""
    }
  );
  const { address } = useAccount();
  const { data: admins } = useSellers({
    admin: address
  });
  const seller = admins?.[0];
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
              secondaryRoyalties: Number(
                openSeaMetadata.seller_fee_basis_points
              ),
              addressForRoyaltyPayment: openSeaMetadata.fee_recipient
            });
          }
        } catch (error) {
          console.error(error);
          setIsError(true);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractURI]);
  const { updateProps, store } = useModal();
  useEffect(() => {
    updateProps<"CREATE_PROFILE">({
      ...store,
      modalProps: {
        ...store.modalProps,
        headerComponent: (
          <ProfileMultiSteps
            createOrSelect={isExistingProfile ? "select" : "create"}
            activeStep={2}
            createOrViewRoyalties={
              alreadyHasRoyaltiesDefined ? "view" : "create"
            }
            key="BosonAccountFormFields"
            setStepBasedOnIndex={setStepBasedOnIndex}
          />
        )
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
          />
        </Form>
      </Formik>
    </Grid>
  );
}
