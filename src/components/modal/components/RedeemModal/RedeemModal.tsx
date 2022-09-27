import { Form, Formik, FormikProps } from "formik";
import { useEffect, useRef, useState } from "react";
import * as Yup from "yup";

import { ModalProps } from "../../ModalContext";
import Confirmation from "./Confirmation/Confirmation";
import RedeemForm from "./RedeemForm/RedeemForm";
import { FormModel } from "./RedeemModalFormModel";
import StepsOverview from "./StepsOverview/StepsOverview";

const validationSchemaPerStep = [
  Yup.object({}),
  Yup.object({
    [FormModel.formFields.name.name]: Yup.string()
      .trim()
      .required(FormModel.formFields.name.requiredErrorMessage),
    [FormModel.formFields.streetNameAndNumber.name]: Yup.string()
      .trim()
      .required(FormModel.formFields.streetNameAndNumber.requiredErrorMessage),
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
    [FormModel.formFields.email.name]: Yup.string()
      .trim()
      .required(FormModel.formFields.email.requiredErrorMessage)
      .email(FormModel.formFields.email.mustBeEmail)
  }),
  Yup.object({}),
  Yup.object({})
];

interface Props {
  exchangeId: string;
  offerName: string;
  buyerId: string;
  sellerId: string;
  sellerAddress: string;
  // modal props
  hideModal: NonNullable<ModalProps["hideModal"]>;
  reload?: () => void;
}

export default function RedeemModal({
  hideModal,
  exchangeId,
  offerName,
  buyerId,
  sellerId,
  sellerAddress,
  reload
}: Props) {
  const [activeStep, setActiveStep] = useState<number>(0);
  const validationSchema = validationSchemaPerStep[activeStep];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formRef = useRef<FormikProps<any> | null>(null);

  useEffect(() => {
    // TODO: this should not be necessary as validateOnMount should handle that
    if (formRef.current) {
      formRef.current.validateForm();
    }
  }, [activeStep]);
  return (
    <>
      <Formik
        innerRef={formRef}
        validationSchema={validationSchema}
        onSubmit={async () => {
          try {
            hideModal();
          } catch (error) {
            console.error(error);
          }
        }}
        initialValues={{
          [FormModel.formFields.name.name]: "",
          [FormModel.formFields.streetNameAndNumber.name]: "",
          [FormModel.formFields.city.name]: "",
          [FormModel.formFields.state.name]: "",
          [FormModel.formFields.zip.name]: "",
          [FormModel.formFields.country.name]: "",
          [FormModel.formFields.email.name]: ""
        }}
        validateOnMount
      >
        {(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          props: FormikProps<any>
        ) => {
          const isRedeemFormOK =
            !props.errors[FormModel.formFields.name.name] &&
            !props.errors[FormModel.formFields.streetNameAndNumber.name] &&
            !props.errors[FormModel.formFields.city.name] &&
            !props.errors[FormModel.formFields.state.name] &&
            !props.errors[FormModel.formFields.zip.name] &&
            !props.errors[FormModel.formFields.country.name] &&
            !props.errors[FormModel.formFields.email.name];
          return (
            <Form>
              {activeStep === 0 ? (
                <StepsOverview onNextClick={() => setActiveStep(1)} />
              ) : activeStep === 1 ? (
                <RedeemForm
                  onBackClick={() => setActiveStep(0)}
                  onNextClick={() => setActiveStep(2)}
                  isValid={isRedeemFormOK}
                />
              ) : (
                <Confirmation
                  exchangeId={exchangeId}
                  offerName={offerName}
                  buyerId={buyerId}
                  sellerId={sellerId}
                  sellerAddress={sellerAddress}
                  onBackClick={() => setActiveStep(1)}
                  reload={reload}
                />
              )}
            </Form>
          );
        }}
      </Formik>
    </>
  );
}
