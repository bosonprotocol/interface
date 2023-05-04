import React, { useEffect, useState } from "react";

import { CreateProfile } from "../../../../product/utils";
import { useModal } from "../../../useModal";
import BosonAccountForm from "../bosonAccount/BosonAccountForm";
import { BosonAccount } from "../bosonAccount/validationSchema";
import { RegularStep } from "./const";
import CreateYourRegularProfile from "./CreateYourRegularProfile";
import { RegularProfileMultiSteps } from "./RegularProfileMultiSteps";
import RegularProfileSummary from "./RegularProfileSummary";

interface CreateRegularProfileFlowProps {
  onSubmit: (data: CreateProfile) => void;
  initialData?: CreateProfile;
  changeToLensProfile: () => void;
}

export const CreateRegularProfileFlow: React.FC<
  CreateRegularProfileFlowProps
> = ({ onSubmit, initialData, changeToLensProfile }) => {
  const [step, setStep] = useState<RegularStep>(RegularStep.CREATE);
  const [regularProfile, setRegularProfile] = useState<CreateProfile | null>(
    null
  );
  const [bosonAccount, setBosonAccount] = useState<BosonAccount | null>(null);
  const { updateProps, store } = useModal();
  useEffect(() => {
    updateProps<"CREATE_PROFILE">({
      ...store,
      modalProps: {
        ...store.modalProps,
        headerComponent: (
          <RegularProfileMultiSteps
            isCreate
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
      {step === RegularStep.CREATE ? (
        <CreateYourRegularProfile
          forceDirty={false}
          initial={initialData}
          onSubmit={async (profile) => {
            setRegularProfile(profile);
            setStep(RegularStep.BOSON_ACCOUNT);
          }}
          isEdit={false}
          changeToLensProfile={changeToLensProfile}
        />
      ) : step === RegularStep.BOSON_ACCOUNT ? (
        <BosonAccountForm
          formValues={null}
          onSubmit={(values) => {
            setBosonAccount(values);
            setStep(RegularStep.SUMMARY);
          }}
          onBackClick={() => {
            setStep(RegularStep.CREATE);
          }}
        />
      ) : step === RegularStep.SUMMARY && regularProfile && bosonAccount ? (
        <RegularProfileSummary
          bosonAccount={bosonAccount}
          values={regularProfile}
          onSubmit={() => {
            onSubmit(regularProfile);
          }}
        />
      ) : (
        <p>There has been an error, please try again...</p>
      )}
    </>
  );
};
