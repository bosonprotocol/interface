import { Form, Formik, FormikProps } from "formik";
import { useEffect, useMemo, useRef, useState } from "react";
import * as Yup from "yup";

import useOffer from "../../../../lib/utils/hooks/offer/useOffer";
import { useCurrentSellers } from "../../../../lib/utils/hooks/useCurrentSellers";
import Loading from "../../../ui/Loading";
import { ContactPreference } from "../Profile/const";
import Confirmation from "./Confirmation/Confirmation";
import RedeemForm from "./RedeemForm/RedeemForm";
import { FormModel } from "./RedeemModalFormModel";
import StepsOverview from "./StepsOverview/StepsOverview";

interface Props {
  exchangeId: string;
  offerName: string;
  offerId: string;
  buyerId: string;
  sellerId: string;
  sellerAddress: string;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  reload?: () => void;
}

enum Step {
  OVERVIEW,
  FORM,
  CONFIRMATION
}

export default function RedeemModal({
  exchangeId,
  offerName,
  offerId,
  buyerId,
  sellerId,
  sellerAddress,
  reload,
  setIsLoading
}: Props) {
  const [activeStep, setActiveStep] = useState<Step>(Step.OVERVIEW);
  const { data: offer } = useOffer(
    {
      offerId
    },
    {
      enabled: !!offerId
    }
  );
  const { sellers, isLoading } = useCurrentSellers({
    sellerId: offer?.seller.id
  });
  const seller = sellers?.[0];
  const emailPreference =
    seller.metadata?.contactPreference === ContactPreference.EMAIL ||
    offer?.metadata.productV1Seller.contactPreference ===
      ContactPreference.EMAIL;
  const validationSchema = useMemo(() => {
    return Yup.object({
      [FormModel.formFields.name.name]: Yup.string()
        .trim()
        .required(FormModel.formFields.name.requiredErrorMessage),
      [FormModel.formFields.streetNameAndNumber.name]: Yup.string()
        .trim()
        .required(
          FormModel.formFields.streetNameAndNumber.requiredErrorMessage
        ),
      [FormModel.formFields.city.name]: Yup.string()
        .trim()
        .required(FormModel.formFields.city.requiredErrorMessage),
      [FormModel.formFields.state.name]: Yup.string()
        .trim()
        .required(FormModel.formFields.state.requiredErrorMessage),
      [FormModel.formFields.zip.name]: Yup.string()
        .trim()
        .required(FormModel.formFields.zip.requiredErrorMessage),
      [FormModel.formFields.country.name]: Yup.string()
        .trim()
        .required(FormModel.formFields.country.requiredErrorMessage),
      [FormModel.formFields.email.name]: emailPreference
        ? Yup.string()
            .trim()
            .required(FormModel.formFields.email.requiredErrorMessage)
            .email(FormModel.formFields.email.mustBeEmail)
        : Yup.string().trim().email(FormModel.formFields.email.mustBeEmail),
      [FormModel.formFields.phone.name]: Yup.string()
        .trim()
        .required(FormModel.formFields.phone.requiredErrorMessage)
    });
  }, [emailPreference]);
  type FormType = Yup.InferType<typeof validationSchema>;
  const formRef = useRef<FormikProps<FormType> | null>(null);

  useEffect(() => {
    // TODO: this should not be necessary as validateOnMount should handle that
    if (formRef.current) {
      formRef.current.validateForm();
    }
  }, [activeStep]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Formik<FormType>
        innerRef={formRef}
        validationSchema={validationSchema}
        onSubmit={() => {}} // eslint-disable-line @typescript-eslint/no-empty-function
        initialValues={{
          [FormModel.formFields.name.name]: "",
          [FormModel.formFields.streetNameAndNumber.name]: "",
          [FormModel.formFields.city.name]: "",
          [FormModel.formFields.state.name]: "",
          [FormModel.formFields.zip.name]: "",
          [FormModel.formFields.country.name]: "",
          [FormModel.formFields.email.name]: "",
          [FormModel.formFields.phone.name]: ""
        }}
        validateOnMount
      >
        {(props) => {
          const isRedeemFormOK =
            !props.errors[FormModel.formFields.name.name] &&
            !props.errors[FormModel.formFields.streetNameAndNumber.name] &&
            !props.errors[FormModel.formFields.city.name] &&
            !props.errors[FormModel.formFields.state.name] &&
            !props.errors[FormModel.formFields.zip.name] &&
            !props.errors[FormModel.formFields.country.name] &&
            !props.errors[FormModel.formFields.email.name] &&
            !props.errors[FormModel.formFields.phone.name];
          return (
            <Form>
              {activeStep === Step.OVERVIEW ? (
                <StepsOverview onNextClick={() => setActiveStep(Step.FORM)} />
              ) : activeStep === Step.FORM ? (
                <RedeemForm
                  onBackClick={() => setActiveStep(Step.OVERVIEW)}
                  onNextClick={() => setActiveStep(Step.CONFIRMATION)}
                  isValid={isRedeemFormOK}
                />
              ) : (
                <Confirmation
                  exchangeId={exchangeId}
                  offerName={offerName}
                  offerId={offerId}
                  buyerId={buyerId}
                  sellerId={sellerId}
                  sellerAddress={sellerAddress}
                  onBackClick={() => setActiveStep(Step.FORM)}
                  reload={reload}
                  setIsLoading={setIsLoading}
                />
              )}
            </Form>
          );
        }}
      </Formik>
    </>
  );
}
