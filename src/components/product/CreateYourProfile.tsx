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
        x
      </InputGroup>
      <InputGroup title="Your brand / name*">x</InputGroup>
      <InputGroup title="Contact E-Mail*">x</InputGroup>
      <InputGroup title="Description*">x</InputGroup>
      <InputGroup
        title="Website / Social media link"
        subTitle="Put your most frequently used online channel in here. Use the URL for Social media."
        popper="Lorem 123"
      >
        x
      </InputGroup>
      <ProductButtonGroup>
        <Button theme="secondary">Next</Button>
      </ProductButtonGroup>
    </ContainerProductPage>
  );
}
