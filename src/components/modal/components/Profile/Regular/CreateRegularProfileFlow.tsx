import React, { useState } from "react";

import { CreateProfile } from "../../../../product/utils";
import Button from "../../../../ui/Button";
import BosonAccountForm from "../bosonAccount/BosonAccountForm";
import { BosonAccount } from "../bosonAccount/validationSchema";
import CreateYourRegularProfile from "./CreateYourRegularProfile";
import RegularProfileSummary from "./RegularProfileSummary";

interface CreateRegularProfileFlowProps {
  onSubmit: (data: CreateProfile) => void;
  initialData?: CreateProfile;
  changeToLensProfile: () => void;
}

enum Step {
  CREATE,
  BOSON_ACCOUNT,
  SUMMARY
}

export const CreateRegularProfileFlow: React.FC<
  CreateRegularProfileFlowProps
> = ({ onSubmit, initialData, changeToLensProfile }) => {
  const [step, setStep] = useState<Step>(Step.CREATE);
  const [regularProfile, setRegularProfile] = useState<CreateProfile | null>(
    null
  );
  const [bosonAccount, setBosonAccount] = useState<BosonAccount | null>(null);
  return (
    <>
      <>
        <Button
          onClick={() => {
            if (step === Step.SUMMARY) {
              setStep(Step.BOSON_ACCOUNT);
              return;
            }
            if (step === Step.BOSON_ACCOUNT) {
              setStep(Step.CREATE);
              return;
            }
          }}
        >
          back
        </Button>
      </>
      {step === Step.CREATE ? (
        <CreateYourRegularProfile
          initial={initialData}
          onSubmit={(profile) => {
            setRegularProfile(profile);
            setStep(Step.BOSON_ACCOUNT);
          }}
          isEdit={false}
          changeToLensProfile={changeToLensProfile}
        />
      ) : step === Step.BOSON_ACCOUNT ? (
        <BosonAccountForm
          formValues={null}
          onSubmit={(values) => {
            setBosonAccount(values);
            setStep(Step.SUMMARY);
          }}
          onBackClick={() => {
            setStep(Step.CREATE);
          }}
        />
      ) : step === Step.SUMMARY && regularProfile && bosonAccount ? (
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
