import { useCallback, useState } from "react";

import type { Profile } from "../../../../../lib/utils/hooks/lens/profile/useGetLensProfiles";
import CreateOrChoose from "./CreateOrChoose";
import LensForm from "./LensForm";

interface Props {
  onSubmit: Parameters<typeof LensForm>[0]["onSubmit"];
}

const steps = {
  CREATE_OR_CHOOSE: 0,
  CREATE: 1,
  USE: 3
} as const;

export default function LensProfile({ onSubmit }: Props) {
  const [step, setStep] = useState<number>(steps.CREATE_OR_CHOOSE);
  const [lensProfile, setLensProfile] = useState<Profile | null>(null);
  const handleOnBackClick = useCallback(() => {
    setStep(steps.CREATE_OR_CHOOSE);
  }, []);
  return (
    <>
      {step === steps.CREATE_OR_CHOOSE ? (
        <CreateOrChoose
          onChooseCreateNew={() => setStep(steps.CREATE)}
          onChooseUseExisting={(profile) => {
            setLensProfile(profile);
            setStep(steps.USE);
          }}
        />
      ) : step === steps.CREATE ? (
        <LensForm
          profile={null}
          onSubmit={onSubmit}
          onBackClick={handleOnBackClick}
        />
      ) : step === steps.USE ? (
        <LensForm
          profile={lensProfile}
          onSubmit={onSubmit}
          onBackClick={handleOnBackClick}
        />
      ) : null}
    </>
  );
}
