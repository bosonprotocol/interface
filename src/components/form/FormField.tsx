/* eslint @typescript-eslint/no-explicit-any: "off" */
import React from "react";

import DetailPopper from "../detail/DetailPopper";
import Grid from "../ui/Grid";
import Typography from "../ui/Typography";
import { FormFieldWrapper } from "./Field.styles";

export interface Props {
  header: string;
  subheader?: string | false;
  required?: boolean;
  tooltip?: string;
  children: React.ReactNode | string;
}
export default function FormField({
  header,
  subheader = false,
  required = false,
  tooltip,
  children
}: Props) {
  return (
    <FormFieldWrapper
      justifyContent="flex-start"
      flexDirection="column"
      alignItems="flex-start"
      flexGrow="1"
    >
      <Grid justifyContent="flex-start">
        <Typography data-header tag="p">
          {header} {required && "*"}
        </Typography>
        {tooltip && <DetailPopper>{tooltip}</DetailPopper>}
      </Grid>
      {subheader && (
        <Grid justifyContent="flex-start">
          <Typography data-subheader tag="p">
            {subheader}
          </Typography>
        </Grid>
      )}
      {children}
    </FormFieldWrapper>
  );
}
