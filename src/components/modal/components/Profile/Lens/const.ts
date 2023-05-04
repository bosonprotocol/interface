import { AuthTokenType } from "@bosonprotocol/react-kit";

export const authTokenTypes = AuthTokenType;

export enum LensStep {
  CREATE_OR_CHOOSE = "CREATE_OR_CHOOSE",
  CREATE = "CREATE",
  USE = "USE",
  BOSON_ACCOUNT = "BOSON_ACCOUNT",
  SUMMARY = "SUMMARY"
}
