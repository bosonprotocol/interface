import { useField, useFormikContext } from "formik";
import { cloneElement, ReactElement, useCallback, useEffect } from "react";

import useGetLensProfile from "../../../../../lib/utils/hooks/lens/profile/useGetLensProfile";
import Button from "../../../../ui/Button";
import Grid from "../../../../ui/Grid";
import { useModal } from "../../../useModal";
import ProfileMultiSteps from "./ProfileMultiSteps";
import { LensProfileType } from "./validationSchema";

interface Props {
  children: ReactElement;
  onBackClick: () => void;
}

export default function CreateLensProfile({ children, onBackClick }: Props) {
  const { updateProps, store } = useModal();

  // TODO: get seller royalties to know what value to set to 'createOrViewRoyalties'
  useEffect(() => {
    updateProps<"CREATE_PROFILE">({
      ...store,
      modalProps: {
        ...store.modalProps,
        headerComponent: (
          <ProfileMultiSteps
            createOrSelect="create"
            activeStep={1}
            createOrViewRoyalties="create"
          />
        )
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [fieldName] = useField("name");
  const [fieldHandle, metaHandle, helpersHandle] = useField("handle");
  const { data: profileData, refetch: getProfile } = useGetLensProfile(
    {
      handle: `${fieldHandle.value}.test`
    },
    {
      enabled: false
    }
  );

  const { setStatus, status, ...rest } = useFormikContext<LensProfileType>();
  console.log({ rest });
  useEffect(() => {
    const checkHandle = fieldHandle.value && !metaHandle.error;
    if (checkHandle) {
      getProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldHandle.value]);
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
      helpersHandle.setTouched(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldName.value, metaHandle.touched]);
  return (
    <div>
      {cloneElement(children, { onBlurName })}
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
