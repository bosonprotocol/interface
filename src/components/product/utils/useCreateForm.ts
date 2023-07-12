import { useFormikContext } from "formik";

import type { CreateProductForm } from "./types";

export function useCreateForm<T = CreateProductForm>() {
  const context = useFormikContext<T>();

  const nextIsDisabled = !context.isValid && context.submitCount > 0;

  return {
    ...context,
    nextIsDisabled
  };
}
