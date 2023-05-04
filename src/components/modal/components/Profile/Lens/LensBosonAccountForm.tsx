import { useEffect } from "react";

import { useCurrentSellers } from "../../../../../lib/utils/hooks/useCurrentSellers";
import { useModal } from "../../../useModal";
import BosonAccountForm from "../bosonAccount/BosonAccountForm";
import { BosonAccount } from "../bosonAccount/validationSchema";
import { LensStep } from "./const";
import LensProfileMultiSteps from "./LensProfileMultiSteps";

interface Props {
  onSubmit: (createValues: BosonAccount) => void;
  onBackClick: () => void;
  isExistingProfile: boolean;
  setStepBasedOnIndex: (lensStep: LensStep) => void;
  formValues: BosonAccount | null;
}

export default function LensBosonAccountForm({
  onSubmit,
  onBackClick,
  setStepBasedOnIndex,
  formValues,
  isExistingProfile
}: Props) {
  const { sellers } = useCurrentSellers();
  const seller = sellers?.[0];
  const { contractURI } = seller || {};
  const alreadyHasRoyaltiesDefined = !!contractURI;
  const { updateProps, store } = useModal();
  useEffect(() => {
    if (isExistingProfile) {
      updateProps<"EDIT_PROFILE">({
        ...store,
        modalProps: {
          ...store.modalProps,
          headerComponent: (
            <LensProfileMultiSteps
              profileOption={"edit"}
              activeStep={LensStep.BOSON_ACCOUNT}
              createOrViewRoyalties={
                alreadyHasRoyaltiesDefined ? "view" : "create"
              }
              key="BosonAccountFormFields"
              setStepBasedOnIndex={setStepBasedOnIndex}
            />
          )
        }
      });
      return;
    }
    updateProps<"CREATE_PROFILE">({
      ...store,
      modalProps: {
        ...store.modalProps,
        headerComponent: (
          <LensProfileMultiSteps
            profileOption={"create"}
            activeStep={LensStep.BOSON_ACCOUNT}
            createOrViewRoyalties={
              alreadyHasRoyaltiesDefined ? "view" : "create"
            }
            key="BosonAccountFormFields"
            setStepBasedOnIndex={setStepBasedOnIndex}
          />
        )
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <BosonAccountForm
      formValues={formValues}
      onBackClick={onBackClick}
      onSubmit={onSubmit}
      submitButtonText={isExistingProfile ? "Close" : "Next"}
    />
  );
}
