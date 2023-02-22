import { subgraph } from "@bosonprotocol/react-kit";
import { Form, Formik } from "formik";
import { useState } from "react";

import { Profile } from "../../../../../lib/utils/hooks/lens/graphql/generated";
import { preAppendHttps } from "../../../../../lib/validation/regex/url";
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
}

export default function LensForm({
  onSubmit,
  profile,
  seller,
  onBackClick,
  formValues,
  setStepBasedOnIndex,
  isEditViewOnly
}: Props) {
  const [formTouched, setFormChanged] = useState<boolean>(false);
  return (
    <Formik<LensProfileType>
      initialValues={
        formValues
          ? formValues
          : ({
              logo: [],
              coverPicture: [],
              name: "",
              handle: "",
              email: "",
              description: "",
              website: "",
              legalTradingName: ""
            } as LensProfileType)
      }
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
            <LensFormFields disable={false} mode="view" />
          </ViewOrEditLensProfile>
        ) : (
          <CreateLensProfile
            onBackClick={onBackClick}
            setStepBasedOnIndex={setStepBasedOnIndex}
          >
            <LensFormFields disable={false} mode="edit" />
          </CreateLensProfile>
        )}
      </Form>
    </Formik>
  );
}
