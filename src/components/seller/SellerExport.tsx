import { DownloadSimple } from "phosphor-react";
import { CSVLink } from "react-csv";
import { CommonPropTypes } from "react-csv/components/CommonPropTypes";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import Button from "../ui/Button";

const ExportButton = styled(Button)`
  color: ${colors.secondary};
  border: none;
  gap: 0.3125rem;
  > div {
    gap: 0.625rem;
  }
`;

interface Props {
  csvProps: CommonPropTypes;
}

function SellerExport({ csvProps }: Props) {
  return (
    <CSVLink {...csvProps} filename={csvProps.filename ?? "filename"}>
      <ExportButton themeVal="outline" size="small">
        Export <DownloadSimple size={16} />
      </ExportButton>
    </CSVLink>
  );
}

export default SellerExport;
