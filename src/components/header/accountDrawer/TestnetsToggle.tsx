import { atomWithStorage } from "jotai/utils";

export const showTestnetsAtom = atomWithStorage<boolean>("showTestnets", true);
