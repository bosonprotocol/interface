/* eslint @typescript-eslint/no-explicit-any: "off" */
import { Form, Formik } from "formik";
import styled from "styled-components";
import * as Yup from "yup";

import {
  Checkbox,
  Datepicker,
  Input,
  Select,
  Textarea,
  Upload
} from "../../components/form";
import FormField from "../../components/form/FormField";
import Button from "../../components/ui/Button";

const PreWrapper = styled.pre`
  max-width: 100%;
  display: block;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 20rem;
  overflow: auto;
  padding: 1rem;
  background: lightgray;
  color: black;
`;

function objToString(obj: any) {
  let str = "";
  for (const p in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, p)) {
      const value = obj[p];
      str += `${p}: ${value}\n`;
    }
  }
  return str;
}
export default function TestForm() {
  const initialValues = {
    checkbox: false,
    input: "",
    textarea: "",
    select: "",
    upload: [],
    datepicker: ""
  };
  const reqMessage = "Required!";
  const validationSchema = Yup.object({
    checkbox: Yup.boolean().oneOf([true], "Should be checked!"),
    input: Yup.string().trim().required(reqMessage),
    textarea: Yup.string().trim().required(reqMessage),
    upload: Yup.array().min(1, "File should be attached!"),
    select: Yup.string().trim().required(reqMessage),
    datepicker: Yup.string().trim().required(reqMessage)
  });

  const handleSubmit = (values: any, formik: any) => {
    console.log(values, formik);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(v, b) => handleSubmit(v, b)}
      validationSchema={validationSchema}
    >
      {({ values, errors }) => {
        return (
          <Form>
            <FormField title="Input">
              <Input placeholder="input" name="input" />
            </FormField>
            <FormField title="Datepicker">
              <Datepicker placeholder="datepicker" name="datepicker" />
            </FormField>
            <FormField title="Checkbox">
              <Checkbox placeholder="checkbox" name="checkbox" />
            </FormField>
            <FormField title="Textarea">
              <Textarea placeholder="textarea" name="textarea" />
            </FormField>
            <FormField title="Select">
              <Select
                placeholder="select"
                name="select"
                data={[{ name: "test", value: "test" }]}
              />
            </FormField>
            <FormField title="Upload">
              <Upload placeholder="upload" name="upload" />
            </FormField>
            <Button theme="primary" type="submit">
              Submit
            </Button>
            <PreWrapper>{objToString(values)}</PreWrapper>
          </Form>
        );
      }}
    </Formik>
  );
}
