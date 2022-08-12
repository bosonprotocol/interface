import { FormField, Input, Textarea, Upload } from "../form";
import Button from "../ui/Button";
import {
  ContainerProductPage,
  ProductButtonGroup,
  SectionTitle
} from "./Product.styles";
import { useCreateForm } from "./utils/useCreateForm";

export default function CreateYourProfile() {
  const { nextIsDisabled } = useCreateForm();

  return (
    <ContainerProductPage>
      <SectionTitle tag="h2">Create your Profile</SectionTitle>
      <FormField
        title="Logo / profile picture"
        subTitle="Upload a profile image with a max. width and height of 800px and a max. size of 300kb."
        required={true}
      >
        <Upload name="creteYourProfile.logo" />
      </FormField>
      <FormField title="Your brand / name" required={true}>
        <Input name="creteYourProfile.name" placeholder="Name" />
      </FormField>
      <FormField title="Contact e-Mail" required={true}>
        <Input
          name="creteYourProfile.email"
          placeholder="e-Mail"
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          defaultValue={"roberto@mail.com"}
        />
      </FormField>
      <FormField title="Description" required={true}>
        <Textarea name="creteYourProfile.description" placeholder="Describe" />
      </FormField>
      <FormField
        title="Website / Social media link"
        subTitle="Put your most frequently used online channel in here. Use the URL for Social media."
        tooltip="TODO:"
        style={{
          marginBottom: 0
        }}
      >
        <Input
          name="creteYourProfile.website"
          placeholder="www.example.com OR www.instagram.com/example"
          pattern="^(http:\/\/|https:\/\/)?(www.)?([a-zA-Z0-9]+).[a-zA-Z0-9]*.[‌​a-z]{3}\.([a-z]+)?$"
          defaultValue={"www.roberto.com"}
        />
      </FormField>
      <ProductButtonGroup>
        <Button theme="secondary" type="submit" disabled={nextIsDisabled}>
          Next
        </Button>
      </ProductButtonGroup>
    </ContainerProductPage>
  );
}
