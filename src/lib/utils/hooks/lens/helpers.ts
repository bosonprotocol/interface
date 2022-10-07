// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import omitDeep from "omit-deep";

export const omit = (object: Record<string, unknown>, name: string) => {
  return omitDeep(object, name);
};
