import { useFormikContext } from "formik";

import logoPicturePlaceholder from "../../assets/placeholder/image-thumbnail.png";
import Field, { FieldType } from "../../components/form/Field";
import Button from "../ui/Button";
import Image from "../ui/Image";
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
        {/* NOTE: TEMP ONLY FOR UI PURPOSE */}
        <Image
          alt="placeholder"
          src={logoPicturePlaceholder}
          style={{
            width: "88px",
            height: "88px",
            paddingTop: "0px"
          }}
        />
      </InputGroup>
      <InputGroup title="Your brand / name*">
        <Field
          fieldType={FieldType.Input}
          placeholder="Name"
          name="name"
          value={values.name}
          onChange={handleChange}
          error={errors.name}
        />
      </InputGroup>
      <InputGroup title="Contact E-Mail*">
        <Field
          fieldType={FieldType.Input}
          placeholder="Name"
          name="email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
        />
      </InputGroup>
      <InputGroup title="Description*">
        <Field
          fieldType={FieldType.Textarea}
          placeholder="Describe"
          name="description"
          value={values.description}
          onChange={handleChange}
          error={errors.description}
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
          name="website"
          value={values.website}
          onChange={handleChange}
          error={errors.website}
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
