import type { SelectDataProps } from "../../components/form/types";

export type SelectType<Value extends string = string> =
  SelectDataProps<Value> | null;
