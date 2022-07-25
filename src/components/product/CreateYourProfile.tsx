import { useFormikContext } from "formik";

import Field, { FieldType } from "../../components/form/Field";
import Button from "../ui/Button";
import InputGroup from "../ui/InputGroup";
import Typography from "../ui/Typography";
import { ContainerProductPage, ProductButtonGroup } from "./Product.styles";
import type { CreateProductForm } from "./validation/createProductValidationSchema";

export default function CreateYourProfile() {
  const { handleChange, values, errors } =
    useFormikContext<CreateProductForm>();

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
          name="creteYourProfile.name"
          value={values.creteYourProfile.name}
          onChange={handleChange}
          error={errors.creteYourProfile?.name}
        />
      </InputGroup>
      <InputGroup title="Contact E-Mail*">
        <Field
          fieldType={FieldType.Input}
          placeholder="Name"
          name="creteYourProfile.email"
          value={values.creteYourProfile.email}
          onChange={handleChange}
          error={errors.creteYourProfile?.email}
        />
      </InputGroup>
      <InputGroup title="Description*">
        <Field
          fieldType={FieldType.Textarea}
          placeholder="Describe"
          name="creteYourProfile.description"
          value={values.creteYourProfile.description}
          onChange={handleChange}
          error={errors.creteYourProfile?.description}
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
          name="creteYourProfile.website"
          value={values.creteYourProfile.website}
          onChange={handleChange}
          error={errors.creteYourProfile?.website}
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
