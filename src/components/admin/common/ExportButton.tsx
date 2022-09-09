import { DownloadSimple } from "phosphor-react";
import { CSVLink } from "react-csv";
import { CommonPropTypes } from "react-csv/components/CommonPropTypes";
import styled from "styled-components";

import { colors } from "../../../lib/styles/colors";
import Button, { IButton } from "../../ui/Button";

const StyledButton = styled(Button)`
  color: ${colors.secondary};
  border: none;
  gap: 0.3125rem;
  > div {
    gap: 0.625rem;
  }
`;

interface Props {
  csvProps: CommonPropTypes;
  buttonProps?: IButton;
}

function ExportButton({ csvProps, buttonProps = {} }: Props) {
  return (
    <CSVLink {...csvProps} filename={csvProps.filename ?? "filename"}>
      <StyledButton theme="outline" size="small" {...buttonProps}>
        Export <DownloadSimple size={16} />
      </StyledButton>
    </CSVLink>
  );
}

export default ExportButton;
