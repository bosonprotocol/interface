import { useFormikContext } from "formik";

import type { CreateProductForm } from "./types";

export function useThisForm() {
  const context = useFormikContext<CreateProductForm>();
  return context;
}
