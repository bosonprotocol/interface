import { subgraph } from "@bosonprotocol/react-kit";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";

import { Profile } from "../../../../../lib/utils/hooks/lens/graphql/generated";
import useSetLensProfileMetadata from "../../../../../lib/utils/hooks/lens/profile/useSetLensProfileMetadata";
import SuccessToast from "../../../../toasts/common/SuccessToast";
import { BosonAccount } from "../bosonAccount/validationSchema";
import CreateBosonLensAccountSummary from "./CreateBosonLensAccountSummary";
import CreateOrChoose from "./CreateOrChoose";
import LensBosonAccountForm from "./LensBosonAccountForm";
import LensForm from "./LensForm";
import { getLensCoverPictureUrl } from "./utils";
import { LensProfileType } from "./validationSchema";

interface Props {
  onSubmit: (
    id: string,
    lensProfile: Profile | null | undefined,
    overrides?: LensProfileType
  ) => void;
  seller: subgraph.SellerFieldsFragment | null;
  lensProfile?: Profile;
  changeToRegularProfile: () => void;
  isEdit: boolean;
}

enum Step {
  CREATE_OR_CHOOSE,
  CREATE,
  USE,
  BOSON_ACCOUNT,
  SUMMARY
}

export default function LensProfileFlow({
  onSubmit,
  seller,
  lensProfile: selectedProfile,
  changeToRegularProfile,
  isEdit
}: Props) {
  const [step, setStep] = useState<Step>(Step.CREATE_OR_CHOOSE);
  const [isEditViewOnly, setIsEditView] = useState<boolean>(false);

  const [lensProfile, setLensProfile] = useState<Profile | null>(null);
  const [lensFormValues, setLensFormValues] = useState<LensProfileType | null>(
    null
  );
  const [bosonAccount, setBosonAccount] = useState<BosonAccount | null>(null);
  const handleOnBackClick = useCallback(() => {
    setStep(Step.CREATE_OR_CHOOSE);
  }, [setStep]);
  const setStepBasedOnIndex = useCallback(
    (index: number) => {
      if (index === 0) {
        setStep(Step.CREATE_OR_CHOOSE);
      } else if (index === 1) {
        if (lensProfile) {
          setStep(Step.USE);
        } else {
          setStep(Step.CREATE);
        }
      } else if (index === 2) {
        setStep(Step.BOSON_ACCOUNT);
      } else if (index === 3) {
        setStep(Step.SUMMARY);
      }
    },
    [lensProfile, setStep]
  );
  const { mutateAsync: setMetadata } = useSetLensProfileMetadata();

  if (
    isEdit &&
    (step === Step.CREATE_OR_CHOOSE || !lensProfile) &&
    selectedProfile
  ) {
    setLensProfile(selectedProfile);
    setStep(Step.USE);
    setIsEditView(true);
  }

  return (
    <>
      {step === Step.CREATE_OR_CHOOSE ? (
        <CreateOrChoose
          changeToRegularProfile={changeToRegularProfile}
          onChooseCreateNew={() => {
            setLensProfile(null);
            setStep(Step.CREATE);
          }}
          onChooseUseExisting={(profile) => {
            setLensProfile(profile);
            setStep(Step.USE);
          }}
        />
      ) : step === Step.CREATE ? (
        <LensForm
          changeToRegularProfile={changeToRegularProfile}
          profile={null}
          seller={seller}
          formValues={lensFormValues}
          isEditViewOnly={false}
          onSubmit={(formValues) => {
            setLensFormValues(formValues);
            setStep(Step.BOSON_ACCOUNT);
          }}
          onBackClick={handleOnBackClick}
          setStepBasedOnIndex={setStepBasedOnIndex}
        />
      ) : step === Step.USE ? (
        <LensForm
          changeToRegularProfile={changeToRegularProfile}
          profile={lensProfile}
          seller={seller}
          formValues={null}
          isEditViewOnly={isEditViewOnly}
          onSubmit={async (formValues, { touched }) => {
            setLensFormValues(formValues);
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
              toast((t) => (
                <SuccessToast t={t}>Lens profile has been updated</SuccessToast>
              ));
            }
            if (seller) {
              // In case the boson seller already exists, go next
              onSubmit("", lensProfile, formValues);
            } else {
              setStep(Step.BOSON_ACCOUNT);
            }
          }}
          onBackClick={handleOnBackClick}
          setStepBasedOnIndex={setStepBasedOnIndex}
        />
      ) : step === Step.BOSON_ACCOUNT ? (
        <LensBosonAccountForm
          isExistingProfile={!!lensProfile}
          formValues={bosonAccount}
          onSubmit={(values) => {
            setBosonAccount(values);
            setStep(Step.SUMMARY);
          }}
          onBackClick={() => {
            setStepBasedOnIndex(1);
          }}
          setStepBasedOnIndex={setStepBasedOnIndex}
        />
      ) : step === Step.SUMMARY && lensFormValues && bosonAccount ? (
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
