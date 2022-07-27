import React from "react";

import DetailTooltip from "../detail/DetailTooltip";
import Grid from "../ui/Grid";
import Typography from "../ui/Typography";
import { FormFieldWrapper } from "./Field.styles";
import type { FormFieldProps } from "./types";

export default function FormField({
  title,
  subTitle = false,
  required = false,
  tooltip,
  children,
  style = {}
}: FormFieldProps) {
  return (
    <FormFieldWrapper
      justifyContent="flex-start"
      flexDirection="column"
      alignItems="flex-start"
      flexGrow="1"
      style={style}
    >
      <Grid justifyContent="flex-start" style={{ marginBottom: "0.375rem" }}>
        <Typography data-header tag="p">
          {title}
          {"  "}
          {required && "*"}
        </Typography>
        {tooltip && <DetailTooltip>{tooltip}</DetailTooltip>}
      </Grid>
      {subTitle && (
        <Grid justifyContent="flex-start" style={{ marginBottom: "0.875rem" }}>
          <Typography data-subheader tag="p">
            {subTitle}
          </Typography>
        </Grid>
      )}
      {children}
    </FormFieldWrapper>
  );
}
