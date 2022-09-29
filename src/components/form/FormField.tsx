import isObject from "lodash/isObject";
import mapValues from "lodash/mapValues";
import { Copy } from "phosphor-react";
import toast from "react-hot-toast";

import { colors } from "../../lib/styles/colors";
import Tooltip from "../tooltip/Tooltip";
import Grid from "../ui/Grid";
import Typography from "../ui/Typography";
import { CopyButton, FormFieldWrapper } from "./Field.styles";
import type { FormFieldProps } from "./types";

export default function FormField({
  title,
  subTitle = false,
  required = false,
  tooltip,
  children,
  style = {},
  theme = "",
  valueToCopy
}: FormFieldProps) {
  return (
    <FormFieldWrapper
      justifyContent="flex-start"
      flexDirection="column"
      alignItems="flex-start"
      flexGrow="1"
      style={style}
      theme={theme}
    >
      <Grid justifyContent="flex-start" margin="0 0 0.375rem 0">
        <Typography data-header tag="p">
          {title}
          {"  "}
          {required && "*"}
          {valueToCopy && (
            <CopyButton
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
                } catch (error) {
                  console.error(error);
                  return false;
                }
                toast(() => "Text has been copied to clipboard");
              }}
            >
              <Copy size={24} color={colors.secondary} weight="light" />
            </CopyButton>
          )}
        </Typography>
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
