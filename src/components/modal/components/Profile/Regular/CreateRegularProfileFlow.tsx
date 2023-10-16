import React, { ReactElement, useEffect, useState } from "react";

import { CreateProfile } from "../../../../product/utils";
import { useModal } from "../../../useModal";
import BosonAccountForm from "../bosonAccount/BosonAccountForm";
import { BosonAccount } from "../bosonAccount/validationSchema";
import { RegularStep } from "./const";
import CreateYourRegularProfile from "./CreateYourRegularProfile";
import { RegularProfileMultiSteps } from "./RegularProfileMultiSteps";
import RegularProfileSummary from "./RegularProfileSummary";

interface CreateRegularProfileFlowProps {
  onSubmit: (data: CreateProfile) => Promise<void>;
  initialData?: CreateProfile;
  switchButton: ReactElement;
}

export const CreateRegularProfileFlow: React.FC<
  CreateRegularProfileFlowProps
> = ({ onSubmit, initialData, switchButton }) => {
  const [step, setStep] = useState<RegularStep>(RegularStep.CREATE);
  const [regularProfile, setRegularProfile] = useState<CreateProfile | null>(
    initialData ?? null
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
          forceDirty={false}
          initial={regularProfile ?? undefined}
          onSubmit={async (profile) => {
            setRegularProfile(profile);
            setStep(RegularStep.BOSON_ACCOUNT);
          }}
          isEdit={false}
          switchButton={switchButton}
        />
      ) : step === RegularStep.BOSON_ACCOUNT ? (
        <BosonAccountForm
          formValues={bosonAccount}
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
          onSubmit={async () => {
            await onSubmit(regularProfile);
          }}
        />
      ) : (
        <p>There has been an error, please try again...</p>
      )}
    </>
  );
};
