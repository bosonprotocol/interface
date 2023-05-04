import { useField, useFormikContext } from "formik";
import { cloneElement, ReactElement, useCallback, useEffect } from "react";

import { CONFIG } from "../../../../../lib/config";
import useGetLensProfile from "../../../../../lib/utils/hooks/lens/profile/useGetLensProfile";
import BosonButton from "../../../../ui/BosonButton";
import Grid from "../../../../ui/Grid";
import { useModal } from "../../../useModal";
import { LensStep } from "./const";
import LensProfileMultiSteps from "./LensProfileMultiSteps";
import { LensProfileType } from "./validationSchema";

interface Props {
  children: ReactElement;
  onBackClick: () => void;
  setStepBasedOnIndex: (lensStep: LensStep) => void;
}

export default function CreateLensProfile({
  children,
  onBackClick,
  setStepBasedOnIndex
}: Props) {
  const { updateProps, store } = useModal();

  useEffect(() => {
    updateProps<"CREATE_PROFILE">({
      ...store,
      modalProps: {
        ...store.modalProps,
        headerComponent: (
          <LensProfileMultiSteps
            profileOption="create"
            activeStep={LensStep.CREATE}
            createOrViewRoyalties="create"
            key="CreateLensProfile"
            setStepBasedOnIndex={setStepBasedOnIndex}
          />
        )
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [fieldName] = useField<string>("name");
  const [fieldHandle, metaHandle, helpersHandle] = useField<string>("handle");
  const { data: profileData, refetch: getProfile } = useGetLensProfile(
    {
      handle: `${fieldHandle.value.trim()}${CONFIG.lens.lensHandleExtension}`
    },
    {
      enabled: false
    }
  );
  const { setStatus, status } = useFormikContext<LensProfileType>();
  useEffect(() => {
    const checkHandle = fieldHandle.value && !metaHandle.error;
    if (checkHandle) {
      getProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldHandle.value, metaHandle.error]);
  useEffect(() => {
    if (profileData) {
      setStatus({ handle: "Handle already taken" });
    } else if (status) {
      // clear handle status

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { handle, ...rest } = status;
      setStatus(rest);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);
  const onBlurName = useCallback(() => {
    // The Lens handle field should be editable but should, by default, contain the same value as the "Brand Name" field
    if (fieldName.value && !metaHandle.touched) {
      helpersHandle.setValue(fieldName.value, true);
      helpersHandle.setTouched(true, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldName.value, metaHandle.touched]);
  return (
    <div>
      {cloneElement(children, { onBlurName })}
      <Grid justifyContent="flex-start" gap="2rem">
        <BosonButton
          variant="accentInverted"
          type="button"
          onClick={onBackClick}
        >
          Back
        </BosonButton>
        <BosonButton variant="primaryFill" type="submit">
          Next
        </BosonButton>
      </Grid>
    </div>
  );
}
