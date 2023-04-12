import { useEffect } from "react";
import { useAccount } from "wagmi";

import { useSellers } from "../../../../../lib/utils/hooks/useSellers";
import { useModal } from "../../../useModal";
import BosonAccountForm from "../bosonAccount/BosonAccountForm";
import { BosonAccount } from "../bosonAccount/validationSchema";
import ProfileMultiSteps from "./ProfileMultiSteps";

interface Props {
  onSubmit: (createValues: BosonAccount) => void;
  onBackClick: () => void;
  isExistingProfile: boolean;
  setStepBasedOnIndex: (index: number) => void;
  formValues: BosonAccount | null;
}

export default function LensBosonAccountForm({
  onSubmit,
  onBackClick,
  setStepBasedOnIndex,
  formValues,
  isExistingProfile
}: Props) {
  const { address } = useAccount();
  const { data: admins } = useSellers({
    admin: address
  });
  const seller = admins?.[0];
  const { contractURI } = seller || {};
  const alreadyHasRoyaltiesDefined = !!contractURI;

  const { updateProps, store } = useModal();
  useEffect(() => {
    updateProps<"CREATE_PROFILE">({
      ...store,
      modalProps: {
        ...store.modalProps,
        headerComponent: (
          <ProfileMultiSteps
            createOrSelect={isExistingProfile ? "select" : "create"}
            activeStep={2}
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
    />
  );
}
