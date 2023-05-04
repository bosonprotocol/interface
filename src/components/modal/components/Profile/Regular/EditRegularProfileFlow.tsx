import React, { useEffect, useState } from "react";

import { CreateProfile } from "../../../../product/utils";
import { useModal } from "../../../useModal";
import BosonAccountForm from "../bosonAccount/BosonAccountForm";
import CreateYourRegularProfile from "./CreateYourRegularProfile";
import { RegularProfileMultiSteps } from "./RegularProfileMultiSteps";

interface EditRegularProfileFlowProps {
  onSubmit: (data: CreateProfile, dirty: boolean) => void;
  profileInitialData: CreateProfile;
  changeToLensProfile: () => void;
  forceDirty?: boolean;
}

enum Step {
  CREATE,
  BOSON_ACCOUNT
}

export const EditRegularProfileFlow: React.FC<EditRegularProfileFlowProps> = ({
  onSubmit,
  profileInitialData,
  changeToLensProfile,
  forceDirty
}) => {
  const [step, setStep] = useState<Step>(Step.CREATE);
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
            setStepBasedOnIndex={setStep}
          />
        )
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {step === Step.CREATE ? (
        <CreateYourRegularProfile
          initial={profileInitialData}
          onSubmit={(profile, formDirty) => {
            setRegularProfile(profile);
            setDirty(formDirty);
            setStep(Step.BOSON_ACCOUNT);
          }}
          isEdit={true}
          changeToLensProfile={changeToLensProfile}
        />
      ) : step === Step.BOSON_ACCOUNT && regularProfile ? (
        <BosonAccountForm
          formValues={null}
          onSubmit={() => {
            onSubmit(regularProfile, dirty);
          }}
          onBackClick={() => {
            setStep(Step.CREATE);
          }}
          submitButtonText={dirty || forceDirty ? "Save & close" : "Close"}
        />
      ) : (
        <p>There has been an error, please try again...</p>
      )}
    </>
  );
};
