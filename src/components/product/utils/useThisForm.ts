import { useFormikContext } from "formik";

import type { CreateProductForm } from "./types";

export function useThisForm() {
  const context = useFormikContext<CreateProductForm>();

  const nextIsDisabled = !context.isValid && context.submitCount > 0;

  return {
    ...context,
    nextIsDisabled
  };
}
