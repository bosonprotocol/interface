import { useCallback, useState } from "react";

import { Profile } from "../../../../../lib/utils/hooks/lens/graphql/generated";
import BosonAccountForm from "./BosonAccountForm";
import CreateBosonLensAccountSummary from "./CreateBosonLensAccountSummary";
import CreateOrChoose from "./CreateOrChoose";
import LensForm from "./LensForm";
import { BosonAccount, LensProfileType } from "./validationSchema";

interface Props {
  onSubmit: (profile: Profile, bosonAccount: BosonAccount) => void;
}

const steps = {
  CREATE_OR_CHOOSE: 0,
  CREATE: 1,
  USE: 2,
  BOSON_ACCOUNT: 3,
  SUMMARY: 4
} as const;

export default function LensProfile({ onSubmit }: Props) {
  const [step, setStep] = useState<number>(steps.CREATE_OR_CHOOSE);
  const [lensProfile, setLensProfile] = useState<Profile | null>(null);
  const [lensFormValues, setLensFormValues] = useState<LensProfileType | null>(
    null
  );
  const [bosonAccount, setBosonAccount] = useState<BosonAccount | null>(null);
  const handleOnBackClick = useCallback(() => {
    setStep(steps.CREATE_OR_CHOOSE);
  }, []);

  return (
    <>
      {step === steps.CREATE_OR_CHOOSE ? (
        <CreateOrChoose
          onChooseCreateNew={() => {
            setLensProfile(null);
            setStep(steps.CREATE);
          }}
          onChooseUseExisting={(profile) => {
            setLensProfile(profile);
            setStep(steps.USE);
          }}
        />
      ) : step === steps.CREATE ? (
        <LensForm
          profile={null}
          onSubmit={(formValues) => {
            setLensFormValues(formValues);
            setStep(steps.BOSON_ACCOUNT);
          }}
          onBackClick={handleOnBackClick}
        />
      ) : step === steps.USE ? (
        <LensForm
          profile={lensProfile}
          onSubmit={(formValues) => {
            setLensFormValues(formValues);
            setStep(steps.BOSON_ACCOUNT);
          }}
          onBackClick={handleOnBackClick}
        />
      ) : step === steps.BOSON_ACCOUNT ? (
        <BosonAccountForm
          isExistingProfile={!!lensProfile}
          onSubmit={(values) => {
            setBosonAccount(values);
            setStep(steps.SUMMARY);
          }}
          onBackClick={() => {
            setStep(steps.USE);
          }}
        />
      ) : step === steps.SUMMARY && lensFormValues && bosonAccount ? (
        <CreateBosonLensAccountSummary
          profile={lensProfile}
          values={lensFormValues}
          bosonAccount={bosonAccount}
          onSubmit={onSubmit}
        />
      ) : (
        <p>There has been an error, please try again...</p>
      )}
    </>
  );
}
