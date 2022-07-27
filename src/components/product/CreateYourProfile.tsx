import { Input, Textarea, Upload } from "../form";
import Button from "../ui/Button";
import InputGroup from "../ui/InputGroup";
import Typography from "../ui/Typography";
import { ContainerProductPage, ProductButtonGroup } from "./Product.styles";

export default function CreateYourProfile() {
  return (
    <ContainerProductPage>
      <Typography tag="h2">Create your Profile</Typography>
      <InputGroup
        title="Logo / profile picture*"
        subTitle="Upload a profile image with a max. width and height of 800px and a max. size of 300kb."
      >
        <Upload name="creteYourProfile.logo" />
      </InputGroup>
      <InputGroup title="Your brand / name*">
        <Input name="creteYourProfile.name" placeholder="Name" />
      </InputGroup>
      <InputGroup title="Contact E-Mail*">
        <Input name="creteYourProfile.email" placeholder="E-Mail" />
      </InputGroup>
      <InputGroup title="Description*">
        <Textarea name="creteYourProfile.description" placeholder="Describe" />
      </InputGroup>
      <InputGroup
        title="Website / Social media link"
        subTitle="Put your most frequently used online channel in here. Use the URL for Social media."
        popper="Need to be added"
        style={{
          marginBottom: 0
        }}
      >
        <Input
          name="creteYourProfile.website"
          placeholder="www.example.com OR www.instagram.com/example"
        />
      </InputGroup>
      <ProductButtonGroup>
        <Button theme="secondary" type="submit">
          Next
        </Button>
      </ProductButtonGroup>
    </ContainerProductPage>
  );
}
