import { useFormikContext } from "formik";
import { ReactNode, useEffect } from "react";

import { Profile } from "../../../../../lib/utils/hooks/lens/profile/useGetLensProfiles";
import { ProductButtonGroup } from "../../../../product/Product.styles";
import Button from "../../../../ui/Button";
import { useModal } from "../../../useModal";
import { LensProfile } from "./validationSchema";

interface Props {
  profile: Profile;
  children: ReactNode;
}

export default function ViewLensProfile({ profile, children }: Props) {
  const { setValues } = useFormikContext<LensProfile>();
  const { updateProps, store } = useModal();
  useEffect(() => {
    updateProps<"CREATE_PROFILE">({
      ...store,
      modalProps: {
        ...store.modalProps,
        title: "Use existing profile"
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    setValues({
      logo: [],
      coverPicture: [],
      name: profile.name || "",
      handle: profile.handle || "",
      email: "",
      description: profile.bio || "",
      website: "",
      legalTradingName: ""
    });
  }, [setValues, profile]);
  return (
    <div>
      {children}
      <ProductButtonGroup>
        <Button theme="primary" type="submit">
          Next
        </Button>
      </ProductButtonGroup>
    </div>
  );
}
