import Tooltip from "../tooltip/Tooltip";
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
  style = {},
  theme = ""
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
