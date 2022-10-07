import { useCallback, useState } from "react";

import { Profile } from "../../../../../lib/utils/hooks/lens/graphql/generated";
import { removeLocalStorageItems } from "../../../../../lib/utils/removeLocalStorageItems";
import BosonAccountForm from "./BosonAccountForm";
import CreateBosonLensAccountSummary from "./CreateBosonLensAccountSummary";
import CreateOrChoose from "./CreateOrChoose";
import LensForm from "./LensForm";
import { IMAGES_KEY, useInitialValues } from "./useInitialValues";
import { BosonAccount, LensProfileType } from "./validationSchema";

interface Props {
  onSubmit: () => void;
}

const steps = {
  CREATE_OR_CHOOSE: 0,
  CREATE: 1,
  USE: 2,
  BOSON_ACCOUNT: 3,
  SUMMARY: 4
} as const;

export default function LensProfile({ onSubmit }: Props) {
  const initial = useInitialValues();
  console.log("initial", initial);
  const [step, setStep] = useState<number>(steps.CREATE_OR_CHOOSE);
  const [lensProfile, setLensProfile] = useState<Profile | null>(null);
  const [lensFormValues, setLensFormValues] = useState<LensProfileType | null>(
    null
  );
  const [bosonAccount, setBosonAccount] = useState<BosonAccount | null>(null);
  const handleOnBackClick = useCallback(() => {
    setStep(steps.CREATE_OR_CHOOSE);
  }, []);
  const setStepBasedOnIndex = useCallback(
    (index: number) => {
      if (index === 0) {
        setStep(steps.CREATE_OR_CHOOSE);
      } else if (index === 1) {
        if (lensProfile) {
          setStep(steps.USE);
        } else {
          setStep(steps.CREATE);
        }
      } else if (index === 2) {
        setStep(steps.BOSON_ACCOUNT);
      } else if (index === 3) {
        setStep(steps.SUMMARY);
      }
    },
    [lensProfile]
  );
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
          formValues={initial}
          onSubmit={(formValues) => {
            setLensFormValues(formValues);
            setStep(steps.BOSON_ACCOUNT);
            removeLocalStorageItems({ key: `${IMAGES_KEY}_` });
          }}
          onBackClick={handleOnBackClick}
          setStepBasedOnIndex={setStepBasedOnIndex}
        />
      ) : step === steps.USE ? (
        <LensForm
          profile={lensProfile}
          formValues={lensFormValues}
          onSubmit={(formValues) => {
            setLensFormValues(formValues);
            setStep(steps.BOSON_ACCOUNT);
            removeLocalStorageItems({ key: `${IMAGES_KEY}_` });
          }}
          onBackClick={handleOnBackClick}
          setStepBasedOnIndex={setStepBasedOnIndex}
        />
      ) : step === steps.BOSON_ACCOUNT ? (
        <BosonAccountForm
          isExistingProfile={!!lensProfile}
          onSubmit={(values) => {
            setBosonAccount(values);
            setStep(steps.SUMMARY);
          }}
          onBackClick={() => {
            setStepBasedOnIndex(1);
          }}
          setStepBasedOnIndex={setStepBasedOnIndex}
        />
      ) : step === steps.SUMMARY && lensFormValues && bosonAccount ? (
        <CreateBosonLensAccountSummary
          profile={lensProfile}
          values={lensFormValues}
          bosonAccount={bosonAccount}
          setStepBasedOnIndex={setStepBasedOnIndex}
          onSubmit={onSubmit}
        />
      ) : (
        <p>There has been an error, please try again...</p>
      )}
    </>
  );
}
