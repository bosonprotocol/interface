import Field, { FieldType } from "../../components/form/Field";
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
        <Field fieldType={FieldType.FileUpload} />
      </InputGroup>
      <InputGroup title="Your brand / name*">
        <Field
          fieldType={FieldType.Input}
          placeholder="Name"
          fieldProps={{
            name: "creteYourProfile.name"
          }}
        />
      </InputGroup>
      <InputGroup title="Contact E-Mail*">
        <Field
          fieldType={FieldType.Input}
          placeholder="Name"
          fieldProps={{
            name: "creteYourProfile.email"
          }}
        />
      </InputGroup>
      <InputGroup title="Description*">
        <Field
          fieldType={FieldType.Textarea}
          placeholder="Describe"
          fieldProps={{
            name: "creteYourProfile.description"
          }}
        />
      </InputGroup>
      <InputGroup
        title="Website / Social media link"
        subTitle="Put your most frequently used online channel in here. Use the URL for Social media."
        popper="Need to be added"
        style={{
          marginBottom: 0
        }}
      >
        <Field
          fieldType={FieldType.Input}
          placeholder="www.example.com  OR www.instagram.com/example"
          fieldProps={{
            name: "creteYourProfile.website"
          }}
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
