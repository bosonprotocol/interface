import { useModal } from "../modal/useModal";
import Button from "../ui/Button";
import { ContainerProductPage, ProductButtonGroup } from "./Product.styles";
import { useCreateForm } from "./utils/useCreateForm";

export default function CreateYourProfile() {
  const { showModal } = useModal();
  const { nextIsDisabled } = useCreateForm();

  return (
    <ContainerProductPage>
      <Button
        onClick={() =>
          showModal(
            "CREATE_PROFILE",
            {
              title: "Create your Profile",
              initialRegularCreateProfile: {} as any,
              onRegularProfileCreated: (regularProfile) => {
                console.log("regularProfile", regularProfile);
              },
              onUseLensProfile: (lensProfile) => {
                console.log("lensProfile", lensProfile);
              }
            },
            "auto",
            undefined,
            {
              s: "683px"
            }
          )
        }
      >
        Profile
      </Button>
      <ProductButtonGroup>
        <Button theme="primary" type="submit" disabled={nextIsDisabled}>
          Next
        </Button>
      </ProductButtonGroup>
    </ContainerProductPage>
  );
}
