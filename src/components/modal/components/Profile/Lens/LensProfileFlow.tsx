import { subgraph } from "@bosonprotocol/react-kit";
import { ReactElement, useCallback, useState } from "react";
import toast from "react-hot-toast";

import { Profile } from "../../../../../lib/utils/hooks/lens/graphql/generated";
import useUpdateSellerMetadata from "../../../../../lib/utils/hooks/seller/useUpdateSellerMetadata";
import SuccessToast from "../../../../toasts/common/SuccessToast";
import { BosonAccount } from "../bosonAccount/validationSchema";
import { ProfileType } from "../const";
import ChooseLensProfile from "./ChooseLensProfile";
import { LensStep } from "./const";
import CreateBosonLensAccountSummary from "./CreateBosonLensAccountSummary";
import LensBosonAccountForm from "./LensBosonAccountForm";
import LensForm from "./LensForm";
import { LensProfileType } from "./validationSchema";

interface Props {
  onSubmit: (id: string, values: LensProfileType) => Promise<void>;
  seller: subgraph.SellerFieldsFragment | null;
  lensProfile?: Profile;
  changeToRegularProfile: () => void;
  switchButton: () => ReactElement;
  updateSellerMetadata: ReturnType<
    typeof useUpdateSellerMetadata
  >["mutateAsync"];
  isEdit: boolean;
  forceDirty?: boolean;
}

export default function LensProfileFlow({
  onSubmit,
  seller,
  lensProfile: selectedProfile,
  changeToRegularProfile,
  switchButton,
  updateSellerMetadata,
  isEdit,
  forceDirty
}: Props) {
  const [steps, setSteps] = useState<{
    current: null | LensStep;
    previous: null | LensStep;
  }>({ current: LensStep.CHOOSE, previous: null });
  const step = steps.current;
  const [lensProfile, setLensProfile] = useState<Profile | null>(null);
  const [lensFormValues, setLensFormValues] = useState<LensProfileType | null>(
    null
  );
  const [bosonAccount, setBosonAccount] = useState<BosonAccount | null>(null);
  const setStep = useCallback((newStep: LensStep) => {
    setSteps(({ current }) => {
      return {
        previous: current,
        current: newStep
      };
    });
  }, []);
  const goBack = useCallback(() => {
    setSteps(({ previous }) => {
      return {
        previous: null,
        current: previous
      };
    });
  }, []);
  const handleOnBackClick = useCallback(() => {
    setStep(LensStep.CHOOSE);
  }, [setStep]);

  if (isEdit && (step === LensStep.CHOOSE || !lensProfile) && selectedProfile) {
    setLensProfile(selectedProfile);
    setStep(LensStep.USE);
  }
  return (
    <>
      {step === LensStep.CHOOSE ? (
        <ChooseLensProfile
          changeToRegularProfile={changeToRegularProfile}
          onChooseUseExisting={(profile) => {
            setLensProfile(profile);
            setStep(LensStep.USE);
          }}
          isEdit={isEdit}
        />
      ) : step === LensStep.USE && lensProfile ? (
        <LensForm
          switchButton={switchButton}
          profile={lensProfile}
          seller={seller}
          formValues={null}
          isEdit={isEdit}
          forceDirty={forceDirty}
          onSubmit={async (formValues, { dirtyFields }) => {
            setLensFormValues(formValues);

            if (
              isEdit &&
              (forceDirty ||
                (
                  [
                    "legalTradingName",
                    "contactPreference",
                    "email",
                    "website"
                  ] as (keyof typeof dirtyFields)[]
                ).some((key) => dirtyFields[key]))
            ) {
              await updateSellerMetadata({
                // update fields that are not saved in lens
                values: {
                  legalTradingName: formValues.legalTradingName,
                  contactPreference: formValues.contactPreference,
                  email: formValues.email,
                  website: formValues.website,
                  authTokenId: lensProfile.id
                },
                kind: ProfileType.LENS
              });
              toast((t) => (
                <SuccessToast t={t}>
                  Seller profile has been updated
                </SuccessToast>
              ));
            }
            setStep(LensStep.BOSON_ACCOUNT);
          }}
          onBackClick={handleOnBackClick}
          setStepBasedOnIndex={setStep}
        />
      ) : step === LensStep.BOSON_ACCOUNT && lensFormValues ? (
        <LensBosonAccountForm
          isEdit={isEdit}
          formValues={bosonAccount}
          onSubmit={(values) => {
            setBosonAccount(values);
            if (seller) {
              // In case the boson seller already exists, we wont show the summary page
              onSubmit("", lensFormValues);
            } else {
              setStep(LensStep.SUMMARY);
            }
          }}
          onBackClick={() => {
            goBack();
          }}
          setStepBasedOnIndex={setStep}
        />
      ) : step === LensStep.SUMMARY && lensFormValues && bosonAccount ? (
        <CreateBosonLensAccountSummary
          isEdit={isEdit}
          profile={lensProfile}
          values={lensFormValues}
          bosonAccount={bosonAccount}
          setStepBasedOnIndex={setStep}
          onSubmit={async (id) => {
            await onSubmit(id, lensFormValues);
          }}
        />
      ) : (
        <p>There has been an error, please try again...</p>
      )}
    </>
  );
}
