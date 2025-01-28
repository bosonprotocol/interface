import * as Sentry from "@sentry/browser";
import isObject from "lodash/isObject";
import mapValues from "lodash/mapValues";
import { Copy } from "phosphor-react";
import toast from "react-hot-toast";

import { colors } from "../../lib/styles/colors";
import Tooltip from "../tooltip/Tooltip";
import { Grid } from "../ui/Grid";
import { Typography } from "../ui/Typography";
import { FormFieldWrapper } from "./Field.styles";
import type { FormFieldProps } from "./types";

export default function FormField({
  title,
  titleIcon,
  subTitle = false,
  required = false,
  tooltip,
  children,
  style = {},
  valueToCopy,
  ...rest
}: FormFieldProps) {
  return (
    <FormFieldWrapper
      justifyContent="flex-start"
      flexDirection="column"
      alignItems="flex-start"
      flexGrow="1"
      style={style}
      {...rest}
    >
      <Grid justifyContent="space-between" margin="0 0 0.375rem 0" gap="0.5rem">
        <Grid justifyContent="flex-start">
          <Typography data-header tag="p" style={{ whiteSpace: "pre" }}>
            {title}
            {"  "}
            {required && "*"}
          </Typography>
          {valueToCopy && (
            <Copy
              size={24}
              color={colors.violet}
              style={{ cursor: "pointer" }}
              weight="light"
              onClick={() => {
                try {
                  const isItObject = isObject(valueToCopy);
                  let copyThat = "";
                  if (isItObject) {
                    mapValues(valueToCopy, (value) => {
                      copyThat += `${value}\n`;
                    });
                  } else {
                    copyThat = valueToCopy;
                  }

                  navigator.clipboard.writeText(copyThat);
                  toast(() => "Text has been copied to clipboard");
                } catch (error) {
                  console.error(error);
                  Sentry.captureException(error);
                  return false;
                }
              }}
            />
          )}
        </Grid>

        {titleIcon}

        {tooltip && <Tooltip content={tooltip} size={16} />}
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
