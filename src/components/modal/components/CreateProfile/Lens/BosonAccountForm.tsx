import { Form, Formik } from "formik";

import Grid from "../../../../ui/Grid";
import Typography from "../../../../ui/Typography";
import BosonAccountFormFields from "./BosonAccountFormFields";
import { BosonAccount, bosonAccountValidationSchema } from "./validationSchema";

interface Props {
  onSubmit: (createValues: BosonAccount) => void;
  onBackClick: () => void;
  isExistingProfile: boolean;
}

export default function BosonAccountForm({
  onSubmit,
  onBackClick,
  isExistingProfile
}: Props) {
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
        initialValues={
          {
            secondaryRoyalties: 0,
            addressForRoyaltyPayment: ""
          } as BosonAccount
        }
        onSubmit={(values) => {
          onSubmit(values);
        }}
        validationSchema={bosonAccountValidationSchema}
      >
        <Form style={{ width: "100%" }}>
          <BosonAccountFormFields
            onBackClick={onBackClick}
            isExistingProfile={isExistingProfile}
          />
        </Form>
      </Formik>
    </Grid>
  );
}
