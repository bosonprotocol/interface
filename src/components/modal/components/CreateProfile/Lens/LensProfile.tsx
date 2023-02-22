import { subgraph } from "@bosonprotocol/react-kit";
import { useCallback, useState } from "react";

import { Profile } from "../../../../../lib/utils/hooks/lens/graphql/generated";
import useSetLensProfileMetadata from "../../../../../lib/utils/hooks/lens/profile/useSetLensProfileMetadata";
import { useIpfsStorage } from "../../../../../lib/utils/hooks/useIpfsStorage";
import BosonAccountForm from "./BosonAccountForm";
import CreateBosonLensAccountSummary from "./CreateBosonLensAccountSummary";
import CreateOrChoose from "./CreateOrChoose";
import LensForm from "./LensForm";
import { getLensCoverPictureUrl } from "./utils";
import { BosonAccount, LensProfileType } from "./validationSchema";

interface Props {
  onSubmit: (
    id: string,
    lensProfile: Profile | null | undefined,
    overrides?: LensProfileType
  ) => void;
  seller: subgraph.SellerFieldsFragment | null;
  lensProfile?: Profile;
}

const steps = {
  CREATE_OR_CHOOSE: 0,
  CREATE: 1,
  USE: 2,
  BOSON_ACCOUNT: 3,
  SUMMARY: 4
} as const;
type Step = typeof steps[keyof typeof steps];

export default function LensProfile({
  onSubmit,
  seller,
  lensProfile: selectedProfile
}: Props) {
  const storage = useIpfsStorage();
  const [step, setCurrentStep] = useState<number>(steps.CREATE_OR_CHOOSE);
  const [visitedStepsSet, setVisitedStepsSet] = useState<Set<Step>>(new Set());
  const setStep = useCallback((step: Step) => {
    setCurrentStep(step);
    setVisitedStepsSet(
      (prevSteps) => new Set([...Array.from(prevSteps), step])
    );
  }, []);
  const [lensProfile, setLensProfile] = useState<Profile | null>(null);
  const [lensFormValues, setLensFormValues] = useState<LensProfileType | null>(
    null
  );
  const [bosonAccount, setBosonAccount] = useState<BosonAccount | null>(null);
  const handleOnBackClick = useCallback(() => {
    setStep(steps.CREATE_OR_CHOOSE);
  }, [setStep]);
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
    [lensProfile, setStep]
  );
  const { mutateAsync: setMetadata } = useSetLensProfileMetadata();
  if ((step === steps.CREATE_OR_CHOOSE || !lensProfile) && selectedProfile) {
    setLensProfile(selectedProfile);
    setStep(steps.USE);
  }
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
          seller={seller}
          formValues={lensFormValues}
          isEditViewOnly={false}
          onSubmit={(formValues) => {
            setLensFormValues(formValues);
            setStep(steps.BOSON_ACCOUNT);
          }}
          onBackClick={handleOnBackClick}
          setStepBasedOnIndex={setStepBasedOnIndex}
        />
      ) : step === steps.USE ? (
        <LensForm
          profile={lensProfile}
          seller={seller}
          formValues={null}
          isEditViewOnly={
            visitedStepsSet.size === 1 && visitedStepsSet.has(steps.USE)
          }
          onSubmit={async (formValues, { touched }) => {
            setLensFormValues(formValues);
            if (seller) {
              if (touched && lensProfile) {
                await setMetadata({
                  profileId: lensProfile.id || "",
                  name: formValues.name,
                  bio: formValues.description,
                  cover_picture: getLensCoverPictureUrl(lensProfile) || "", // is disabled in the form so we set the same cover picture
                  attributes: [
                    {
                      traitType: "string",
                      value: formValues.email || "",
                      key: "email"
                    },
                    {
                      traitType: "string",
                      value: formValues.website || "",
                      key: "website"
                    },
                    {
                      traitType: "string",
                      value: formValues.legalTradingName || "",
                      key: "legalTradingName"
                    }
                  ],
                  version: "1.0.0",
                  metadata_id: window.crypto.randomUUID()
                });
              }

              // In case the boson seller already exists, go next
              onSubmit("", lensProfile, formValues);
            } else {
              setStep(steps.BOSON_ACCOUNT);
            }
          }}
          onBackClick={handleOnBackClick}
          setStepBasedOnIndex={setStepBasedOnIndex}
        />
      ) : step === steps.BOSON_ACCOUNT ? (
        <BosonAccountForm
          isExistingProfile={!!lensProfile}
          formValues={bosonAccount}
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
