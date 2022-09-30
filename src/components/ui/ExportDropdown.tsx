import { DownloadSimple } from "phosphor-react";
import { CSVLink } from "react-csv";
import { CommonPropTypes } from "react-csv/components/CommonPropTypes";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import Button, { IButton } from "../ui/Button";

const ExportButton = styled(Button)`
  color: ${colors.secondary};
  border: none;
  gap: 0.3125rem;
  border: 1px solid ${colors.secondary};
  padding-right: 34px;
  padding-left: 12px;
  position: relative;
  > div {
    gap: 0.625rem;
  }
`;
const ArrowContainer = styled.div`
  border-left: 1px solid ${colors.secondary};
  height: 128%;
  width: 20px;
  position: absolute;
  right: -30px;
`;
const ArrowDown = styled.div`
  clip-path: polygon(50% 100%, 0 0, 100% 0);
  width: 11px;
  height: 9px;
  background: ${colors.secondary};
  position: absolute;
  left: 60%;
  top: 55%;
  transform: translate(-50%, -50%);
`;

const ButtonsContainer = styled.div`
  padding: 5px;
  position: absolute;
  width: 125px;
  margin-left: -5px;
  margin-top: -5px;
  display: none;
`;

const ButtonOptions = styled.div<{ disabled: boolean }>`
  border: 1px solid ${colors.secondary};
  border-top: 0px;
  color: ${colors.black};
  font-size: 12px;
  max-width: 115px;
  text-align: center;
  padding: 5px;
  background-color: ${colors.white};
  text-decoration: ${({ disabled }) => (disabled ? "line-through;" : "none")};
`;

const Container = styled.div`
  &:hover {
    [data-buttons-container] {
      display: block !important;
    }
  }
`;

interface Props {
  buttonProps?: IButton;
  children?: Array<{
    id: number;
    name: string;
    disabled?: boolean;
    csvProps: CommonPropTypes;
  }>;
}

function ExportDropdown({ buttonProps = {}, children }: Props) {
  return (
    <Container>
      <ExportButton theme="outline" size="small" {...buttonProps}>
        Export <DownloadSimple size={16} />
        <ArrowContainer>
          <ArrowDown>&nbsp;</ArrowDown>
        </ArrowContainer>
      </ExportButton>
      <ButtonsContainer data-buttons-container>
        {children?.map((child) => {
          if (child.disabled) {
            return <ButtonOptions disabled={true}>{child.name}</ButtonOptions>;
          }
          return (
            <CSVLink
              {...child.csvProps}
              filename={child.csvProps.filename ?? "filename"}
              key={child.id}
            >
              <ButtonOptions disabled={false}>{child.name}</ButtonOptions>
            </CSVLink>
          );
        })}
      </ButtonsContainer>
    </Container>
  );
}

export default ExportDropdown;
