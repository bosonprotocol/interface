import dayjs from "dayjs";
import { DownloadSimple } from "phosphor-react";
import { CSVLink } from "react-csv";
import { CommonPropTypes } from "react-csv/components/CommonPropTypes";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import Button, { IButton } from "../ui/Button";

const ArrowContainer = styled.div`
  border-left: 0.0625rem solid ${colors.secondary};
  height: 128%;
  width: 1.25rem;
  position: absolute;
  right: -1.875rem;
`;
const ExportButton = styled(Button)`
  color: ${colors.secondary};
  border: none;
  gap: 0.3125rem;
  border: 0.0625rem solid ${colors.secondary};
  padding-right: 2.125rem;
  padding-left: 0.75rem;
  position: relative;
  transition: 700ms;
  &:hover:not(:disabled) {
    background: ${colors.secondary};
    color: ${colors.white};
    div,
    button {
      color: ${colors.white};
    }
    ${ArrowContainer} {
      border-color: ${colors.white};
    }
    ${ArrowContainer} div {
      background: ${colors.white};
    }
  }
  > div {
    gap: 0.625rem;
  }
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
  z-index: ${zIndex.Notification};
`;

const ButtonOptions = styled.div<{ disabled: boolean }>`
  border: 0.0625rem solid ${colors.secondary};
  border-top: 0rem;
  color: ${colors.secondary};
  font-size: 0.75rem;
  max-width: 7.1875rem;
  text-align: center;
  padding: 0.3125rem;
  background-color: ${colors.white};
  text-decoration: ${({ disabled }) => (disabled ? "line-through;" : "none")};
  z-index: ${zIndex.Notification};
  transition: 700ms;
  &:hover {
    background-color: ${colors.secondary};
    color: ${colors.white};
  }
`;

const Container = styled.div`
  position: relative;
  z-index: ${zIndex.Notification};
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
  const dateString = dayjs().format("YYYYMMDD");
  return (
    <Container>
      {children && (
        <CSVLink
          {...children[0]?.csvProps}
          filename={
            children[0].csvProps.filename
              ? `${children[0].csvProps.filename}-${dateString}`
              : "filename"
          }
          key={children[0].id}
        >
          <ExportButton theme="outline" size="small" {...buttonProps}>
            Export <DownloadSimple size={16} />
            <ArrowContainer>
              <ArrowDown>&nbsp;</ArrowDown>
            </ArrowContainer>
          </ExportButton>
        </CSVLink>
      )}
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
