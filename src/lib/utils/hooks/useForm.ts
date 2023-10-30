import { useFormikContext } from "formik";

import type { CreateProductForm } from "../../../components/product/utils/types";

export function useForm<T = CreateProductForm>() {
  const context = useFormikContext<T>();

  const nextIsDisabled = !context.isValid && context.submitCount > 0;

  return {
    ...context,
    nextIsDisabled
  };
}
