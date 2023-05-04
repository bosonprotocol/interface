import { subgraph } from "@bosonprotocol/react-kit";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";

import { Profile } from "../../../../../lib/utils/hooks/lens/graphql/generated";
import useSetLensProfileMetadata from "../../../../../lib/utils/hooks/lens/profile/useSetLensProfileMetadata";
import useSetProfileImageUri from "../../../../../lib/utils/hooks/lens/profile/useSetProfileImageUri";
import useUpdateSellerMetadata from "../../../../../lib/utils/hooks/seller/useUpdateSellerMetadata";
import SuccessToast from "../../../../toasts/common/SuccessToast";
import { BosonAccount } from "../bosonAccount/validationSchema";
import { ProfileType } from "../const";
import { LensStep } from "./const";
import CreateBosonLensAccountSummary from "./CreateBosonLensAccountSummary";
import CreateOrChoose from "./CreateOrChoose";
import LensBosonAccountForm from "./LensBosonAccountForm";
import LensForm from "./LensForm";
import { LensProfileType } from "./validationSchema";

interface Props {
  onSubmit: (
    id: string,
    lensProfile: Profile | null | undefined,
    values: LensProfileType
  ) => Promise<void>;
  seller: subgraph.SellerFieldsFragment | null;
  lensProfile?: Profile;
  changeToRegularProfile: () => void;
  updateSellerMetadata?: ReturnType<
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
  updateSellerMetadata,
  isEdit,
  forceDirty
}: Props) {
  const [steps, setSteps] = useState<{
    current: null | LensStep;
    previous: null | LensStep;
  }>({ current: LensStep.CREATE_OR_CHOOSE, previous: null });
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
    setStep(LensStep.CREATE_OR_CHOOSE);
  }, [setStep]);
  const { mutateAsync: setProfileImage } = useSetProfileImageUri();
  const { mutateAsync: setMetadata } = useSetLensProfileMetadata();

  if (
    isEdit &&
    (step === LensStep.CREATE_OR_CHOOSE || !lensProfile) &&
    selectedProfile
  ) {
    setLensProfile(selectedProfile);
    setStep(LensStep.USE);
  }
  console.log({ step });
  return (
    <>
      {step === LensStep.CREATE_OR_CHOOSE ? (
        <CreateOrChoose
          changeToRegularProfile={changeToRegularProfile}
          onChooseCreateNew={() => {
            setLensProfile(null);
            setStep(LensStep.CREATE);
          }}
          onChooseUseExisting={(profile) => {
            setLensProfile(profile);
            setStep(LensStep.USE);
          }}
        />
      ) : step === LensStep.CREATE ? (
        <LensForm
          changeToRegularProfile={changeToRegularProfile}
          profile={null}
          seller={seller}
          formValues={lensFormValues}
          isEditViewOnly={false}
          onSubmit={async (formValues) => {
            setLensFormValues(formValues);
            setStep(LensStep.BOSON_ACCOUNT);
          }}
          onBackClick={handleOnBackClick}
          setStepBasedOnIndex={setStep}
          forceDirty={forceDirty}
        />
      ) : step === LensStep.USE ? (
        <LensForm
          changeToRegularProfile={changeToRegularProfile}
          profile={lensProfile}
          seller={seller}
          formValues={null}
          isEditViewOnly={true}
          forceDirty={forceDirty}
          onSubmit={async (formValues, { dirty }) => {
            setLensFormValues(formValues);
            if (dirty && lensProfile) {
              const profileId = lensProfile.id || "";
              await setMetadata({
                profileId,
                name: formValues.name,
                bio: formValues.description,
                cover_picture: formValues.coverPicture?.[0].src ?? "",
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
              await setProfileImage({
                profileId,
                url: formValues.logo?.[0].src ?? ""
              });
              toast((t) => (
                <SuccessToast t={t}>Lens profile has been updated</SuccessToast>
              ));
              if (updateSellerMetadata) {
                await updateSellerMetadata({
                  values: formValues,
                  kind: ProfileType.LENS
                });
                toast((t) => (
                  <SuccessToast t={t}>
                    Seller profile has been updated
                  </SuccessToast>
                ));
              }
            }
            setStep(LensStep.BOSON_ACCOUNT);
          }}
          onBackClick={handleOnBackClick}
          setStepBasedOnIndex={setStep}
        />
      ) : step === LensStep.BOSON_ACCOUNT && lensFormValues ? (
        <LensBosonAccountForm
          isExistingProfile={!!lensProfile}
          formValues={bosonAccount}
          onSubmit={(values) => {
            setBosonAccount(values);
            if (seller) {
              // In case the boson seller already exists, we wont show the summary page
              onSubmit("", lensProfile, lensFormValues);
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
          profile={lensProfile}
          values={lensFormValues}
          bosonAccount={bosonAccount}
          setStepBasedOnIndex={setStep}
          onSubmit={async (...args) => {
            await onSubmit(...args);
          }}
        />
      ) : (
        <p>There has been an error, please try again...</p>
      )}
    </>
  );
}
