/* eslint @typescript-eslint/no-var-requires: off */
import RenderPdf from "./RenderPdf";

const importedPDF = require("../../assets/terms.pdf");
export default function TermsAndConditions() {
  return <RenderPdf title={"Terms and Conditions"} filePath={importedPDF} />;
}
