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
  border: 0.0625rem solid ${colors.secondary};
  padding-right: 2.125rem;
  padding-left: 0.75rem;
  position: relative;
  > div {
    gap: 0.625rem;
  }
`;
const ArrowContainer = styled.div`
  border-left: 0.0625rem solid ${colors.secondary};
  height: 128%;
  width: 1.25rem;
  position: absolute;
  right: -1.875rem;
`;
const ArrowDown = styled.div`
  clip-path: polygon(50% 100%, 0 0, 100% 0);
  width: 0.6875rem;
  height: 0.5625rem;
  background: ${colors.secondary};
  position: absolute;
  left: 60%;
  top: 55%;
  transform: translate(-50%, -50%);
`;

const ButtonsContainer = styled.div`
  padding: 0.3125rem;
  position: absolute;
  width: 7.8125rem;
  margin-left: -0.3125rem;
  margin-top: -0.3125rem;
  display: none;
`;

const ButtonOptions = styled.div<{ disabled: boolean }>`
  border: 0.0625rem solid ${colors.secondary};
  border-top: 0rem;
  color: ${colors.black};
  font-size: 0.75rem;
  max-width: 7.1875rem;
  text-align: center;
  padding: 0.3125rem;
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
