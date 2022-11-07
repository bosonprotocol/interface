/* eslint @typescript-eslint/no-var-requires: off */
import RenderPdf from "./RenderPdf";

const importedPDF = require("../../assets/privacy.pdf");
export default function PrivacyPolicy() {
  return <RenderPdf title={"Privacy Policy"} filePath={importedPDF} />;
}
