import { CONFIG } from "../../../../lib/config";
import { CreateYourProfile as CreateYourProfileType } from "../../../product/utils";
import { ModalProps } from "../../ModalContext";
import LensProfile from "./Lens/LensProfile";
import CreateYourProfile from "./Regular/CreateYourProfile";

interface Props {
  initialRegularCreateProfile: CreateYourProfileType;
  onRegularProfileCreated: (createValues: CreateYourProfileType) => void;
  onUseLensProfile: (lensValues: any) => void;
  hideModal: NonNullable<ModalProps["hideModal"]>;
}

const showLensVersion = [80001, 137].includes(CONFIG.chainId);

export default function CreateProfileModal({
  hideModal,
  initialRegularCreateProfile,
  onRegularProfileCreated,
  onUseLensProfile
}: Props) {
  return showLensVersion ? (
    <LensProfile onSubmit={onUseLensProfile} />
  ) : (
    <CreateYourProfile
      initial={initialRegularCreateProfile}
      onSubmit={onRegularProfileCreated}
    />
  );
}
