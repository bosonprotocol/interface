import { FormField, Input, Textarea, Upload } from "../form";
import Button from "../ui/Button";
import {
  ContainerProductPage,
  ProductButtonGroup,
  SectionTitle
} from "./Product.styles";
import { useThisForm } from "./utils/useThisForm";

export default function CreateYourProfile() {
  const { nextIsDisabled } = useThisForm();

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
      <FormField title="Contact E-Mail" required={true}>
        <Input name="creteYourProfile.email" placeholder="E-Mail" />
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
