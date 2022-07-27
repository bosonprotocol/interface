import { FormField, Input, Textarea, Upload } from "../form";
import Button from "../ui/Button";
import Typography from "../ui/Typography";
import { ContainerProductPage, ProductButtonGroup } from "./Product.styles";

const FILE_MAX_SIZE = 0.6 * 1024;
export default function CreateYourProfile() {
  return (
    <ContainerProductPage>
      <Typography tag="h2">Create your Profile</Typography>
      <FormField
        title="Logo / profile picture*"
        subTitle="Upload a profile image with a max. width and height of 800px and a max. size of 300kb."
      >
        <Upload name="creteYourProfile.logo" maxSize={FILE_MAX_SIZE} />
      </FormField>
      <FormField title="Your brand / name*">
        <Input name="creteYourProfile.name" placeholder="Name" />
      </FormField>
      <FormField title="Contact E-Mail*">
        <Input name="creteYourProfile.email" placeholder="E-Mail" />
      </FormField>
      <FormField title="Description*">
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
        <Button theme="secondary" type="submit">
          Next
        </Button>
      </ProductButtonGroup>
    </ContainerProductPage>
  );
}
