import React, { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";

import useUpdateSellerMetadata from "../../../../../lib/utils/hooks/seller/useUpdateSellerMetadata";
import { CreateProfile } from "../../../../product/utils";
import SuccessToast from "../../../../toasts/common/SuccessToast";
import { useModal } from "../../../useModal";
import BosonAccountForm from "../bosonAccount/BosonAccountForm";
import { ProfileType } from "../const";
import { RegularStep } from "./const";
import CreateYourRegularProfile from "./CreateYourRegularProfile";
import { RegularProfileMultiSteps } from "./RegularProfileMultiSteps";

interface EditRegularProfileFlowProps {
  onSubmit: (data: CreateProfile, dirty: boolean) => void;
  profileInitialData: CreateProfile;
  switchButton: () => ReactElement;
  updateSellerMetadata: ReturnType<
    typeof useUpdateSellerMetadata
  >["mutateAsync"];
  forceDirty: boolean;
}

export const EditRegularProfileFlow: React.FC<EditRegularProfileFlowProps> = ({
  onSubmit,
  profileInitialData,
  switchButton,
  forceDirty,
  updateSellerMetadata
}) => {
  const [step, setStep] = useState<RegularStep>(RegularStep.CREATE);
  const [regularProfile, setRegularProfile] = useState<CreateProfile | null>(
    null
  );
  const [dirty, setDirty] = useState<boolean>(false);
  const { updateProps, store } = useModal();
  useEffect(() => {
    updateProps<"EDIT_PROFILE">({
      ...store,
      modalProps: {
        ...store.modalProps,
        headerComponent: (
          <RegularProfileMultiSteps
            isCreate={false}
            activeStep={step}
            key={step}
            setStepBasedOnIndex={setStep}
          />
        )
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);
  return (
    <>
      {step === RegularStep.CREATE ? (
        <CreateYourRegularProfile
          forceDirty={forceDirty}
          initial={profileInitialData}
          onSubmit={async (
            profile,
            formDirty,
            resetDirty,
            coverImageTouched
          ) => {
            setRegularProfile(profile);
            setDirty(formDirty);
            if (formDirty || forceDirty || coverImageTouched) {
              await updateSellerMetadata({
                values: { ...profile, authTokenId: "0" },
                kind: ProfileType.REGULAR
              });
              toast((t) => (
                <SuccessToast t={t}>
                  Seller profile has been updated
                </SuccessToast>
              ));
              resetDirty?.();
            }
            setStep(RegularStep.BOSON_ACCOUNT);
          }}
          isEdit={true}
          switchButton={switchButton}
        />
      ) : step === RegularStep.BOSON_ACCOUNT && regularProfile ? (
        <BosonAccountForm
          formValues={null}
          onSubmit={() => {
            onSubmit(regularProfile, dirty);
          }}
          onBackClick={() => {
            setStep(RegularStep.CREATE);
          }}
          submitButtonText={"Close"}
        />
      ) : (
        <p>There has been an error, please try again...</p>
      )}
    </>
  );
};
