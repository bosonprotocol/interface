import { DownloadSimple } from "phosphor-react";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import Button from "../ui/Button";

const ExportButton = styled(Button)`
  color: ${colors.secondary};
  border: none;
  gap: 0.5rem;
`;

function SellerExport() {
  return (
    <ExportButton
      theme="outline"
      size="small"
      onClick={() => console.log("IN_PROGRESS")}
    >
      Export
      <DownloadSimple size={13} />
    </ExportButton>
  );
}

export default SellerExport;
