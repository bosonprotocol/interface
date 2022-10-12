import { ReactNode, useEffect } from "react";
import { useAccount } from "wagmi";

import { useSellers } from "../../../../../lib/utils/hooks/useSellers";
import Button from "../../../../ui/Button";
import Grid from "../../../../ui/Grid";
import { useModal } from "../../../useModal";
import ProfileMultiSteps from "./ProfileMultiSteps";

interface Props {
  children: ReactNode;
  onBackClick: () => void;
  setStepBasedOnIndex: (index: number) => void;
}

export default function ViewLensProfile({
  children,
  onBackClick,
  setStepBasedOnIndex
}: Props) {
  const { updateProps, store } = useModal();
  const { address } = useAccount();
  const { data: admins } = useSellers({
    admin: address
  });
  const seller = admins?.[0];
  const alreadyHasRoyaltiesDefined = !!seller?.royaltyPercentage;

  useEffect(() => {
    updateProps<"CREATE_PROFILE">({
      ...store,
      modalProps: {
        ...store.modalProps,
        headerComponent: (
          <ProfileMultiSteps
            createOrSelect="select"
            activeStep={1}
            createOrViewRoyalties={
              alreadyHasRoyaltiesDefined ? "view" : "create"
            }
            key="ViewLensProfile"
            setStepBasedOnIndex={setStepBasedOnIndex}
          />
        )
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {children}
      <Grid justifyContent="flex-start" gap="2rem">
        <Button theme="bosonSecondary" type="button" onClick={onBackClick}>
          Back
        </Button>
        <Button theme="bosonPrimary" type="submit">
          Next
        </Button>
      </Grid>
    </div>
  );
}
