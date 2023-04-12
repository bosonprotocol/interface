import { subgraph } from "@bosonprotocol/react-kit";
import { Form, Formik } from "formik";
import { useCallback, useState } from "react";

import { Profile } from "../../../../../lib/utils/hooks/lens/graphql/generated";
import { preAppendHttps } from "../../../../../lib/validation/regex/url";
import Button from "../../../../ui/Button";
import CreateLensProfile from "./CreateLensProfile";
import LensFormFields from "./LensFormFields";
import {
  LensProfileType,
  lensProfileValidationSchema,
  viewLensProfileValidationSchema
} from "./validationSchema";
import ViewOrEditLensProfile from "./ViewOrEditLensProfile";

interface Props {
  onSubmit: (
    createValues: LensProfileType,
    opts: {
      touched: boolean;
    }
  ) => void;
  profile: Profile | null;
  seller: subgraph.SellerFieldsFragment | null;
  formValues: LensProfileType | null | undefined;
  onBackClick: () => void;
  setStepBasedOnIndex: (index: number) => void;
  isEditViewOnly: boolean;
  changeToRegularProfile: () => void;
}

export default function LensForm({
  onSubmit,
  profile,
  seller,
  onBackClick,
  formValues,
  setStepBasedOnIndex,
  isEditViewOnly,
  changeToRegularProfile
}: Props) {
  const [formTouched, setFormChanged] = useState<boolean>(false);
  const defaultInitialValues: LensProfileType = {
    logo: [],
    coverPicture: [],
    name: "",
    handle: "",
    email: "",
    description: "",
    website: "",
    legalTradingName: ""
  };
  const UseRegularProfile = useCallback(() => {
    return (
      <Button
        onClick={changeToRegularProfile}
        theme="blankSecondary"
        style={{ marginTop: "1rem" }}
      >
        <small>Use regular profile instead</small>
      </Button>
    );
  }, [changeToRegularProfile]);
  return (
    <Formik<LensProfileType>
      initialValues={formValues ? formValues : defaultInitialValues}
      onSubmit={(values) => {
        if (profile) {
          onSubmit(values, { touched: formTouched });
        } else {
          onSubmit(
            { ...values, website: preAppendHttps(values.website) },
            { touched: formTouched }
          );
        }
      }}
      validationSchema={
        profile ? viewLensProfileValidationSchema : lensProfileValidationSchema
      }
    >
      <Form>
        {profile ? (
          <ViewOrEditLensProfile
            profile={profile}
            seller={seller as subgraph.SellerFieldsFragment}
            onBackClick={onBackClick}
            setStepBasedOnIndex={setStepBasedOnIndex}
            setFormChanged={setFormChanged}
            isEditViewOnly={isEditViewOnly}
          >
            <LensFormFields disableCover disableHandle disableLogo />
            {isEditViewOnly && <UseRegularProfile />}
          </ViewOrEditLensProfile>
        ) : (
          <CreateLensProfile
            onBackClick={onBackClick}
            setStepBasedOnIndex={setStepBasedOnIndex}
          >
            <>
              <LensFormFields
                logoSubtitle="Please choose an image that is no larger than 300KB to ensure it can be uploaded."
                coverSubtitle="Please choose an image that is no larger than 300KB to ensure it can be uploaded."
              />
              <UseRegularProfile />
            </>
          </CreateLensProfile>
        )}
      </Form>
    </Formik>
  );
}
