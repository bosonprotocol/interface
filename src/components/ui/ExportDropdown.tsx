import dayjs from "dayjs";
import { DownloadSimple } from "phosphor-react";
import { RefObject } from "react";
import { CSVLink } from "react-csv";
import { CommonPropTypes } from "react-csv/components/CommonPropTypes";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import Button, { IButton } from "../ui/Button";
import Loading from "./Loading";

const ExportButton = styled(Button)`
  color: ${colors.secondary};
  border: none;
  gap: 0.5rem;
  border: 2px solid ${colors.secondary};
  padding-right: 2.125rem;
  padding-left: 0.75rem;
  position: relative;
  transition: all 300ms ease-in-out;

  &:hover:not(:disabled) {
    background: ${colors.secondary};
    color: ${colors.white};
    div,
    button {
      color: ${colors.white};
    }
    :after {
      background: ${colors.white};
      opacity: 0.5;
    }
    :before {
      opacity: 0.75;
      border-top: 0.5rem solid ${colors.white};
    }
  }
  > div {
    gap: 0.625rem;
  }
  padding-right: 2rem;
  position: relative;
  :after,
  :before {
    position: absolute;
    content: "";
  }
  :after {
    top: 0;
    bottom: 0;
    right: 1.5rem;
    background: ${colors.secondary};
    width: 1px;
    height: 100%;
  }
  :before {
    width: 0;
    height: 0;
    border-left: 0.25rem solid transparent;
    border-right: 0.25rem solid transparent;
    border-top: 0.5rem solid ${colors.secondary};
    top: 50%;
    right: 0.5rem;
    transform: translate(0, -50%);
  }
`;

const ButtonsContainer = styled.div`
  padding: 0.3125rem;
  position: absolute;
  width: 100%;
  margin-left: -0.3125rem;
  margin-top: -0.3125rem;
  display: none;
  z-index: ${zIndex.Select};
  > * {
    width: 100%;
  }
`;

const ButtonOptions = styled.div<{ disabled: boolean }>`
  position: relative;

  display: inline-block;
  border: 0.0625rem solid ${colors.secondary};
  border-top: 0rem;
  color: ${colors.secondary};
  font-size: 0.75rem;
  max-width: 7.1875rem;
  text-align: center;
  padding: 0.3125rem;
  background-color: ${colors.white};
  z-index: ${zIndex.Select};
  transition: all 300ms ease-in-out;
  &:hover {
    background-color: ${colors.secondary};
    color: ${colors.white};
  }
  text-decoration: ${({ disabled }) => (disabled ? "line-through;" : "none")};

  > div[data-loader] {
    padding: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    > div {
      display: inline;
      width: 1rem;
      height: 1rem;
    }
    + span {
      opacity: 0;
    }
  }
`;

const Container = styled.div`
  position: relative;
  z-index: ${zIndex.Select};
  &:hover {
    [data-buttons-container] {
      display: block !important;
    }
  }
  a {
    display: inline-block;
    > span {
      font-size: 0.875rem;
    }
  }
`;

interface ChildProps {
  id: number;
  name: string;
  hidden?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  ref?: RefObject<CSVLink & HTMLAnchorElement & { link: HTMLAnchorElement }>;
  loading?: boolean;
  csvProps: CommonPropTypes;
}
interface Props {
  buttonProps?: IButton;
  children?: Array<ChildProps>;
}

function ExportDropdown({ buttonProps = {}, children }: Props) {
  return (
    <Container>
      {children && (
        <CSVLink
          {...children[0]?.csvProps}
          filename={
            children[0].csvProps.filename
              ? `${children[0].csvProps.filename}-${dayjs().format("YYYYMMDD")}`
              : "filename"
          }
          key={children[0].id}
        >
          <ExportButton theme="outline" size="small" {...buttonProps}>
            Export <DownloadSimple size={16} />
          </ExportButton>
        </CSVLink>
      )}
      <ButtonsContainer data-buttons-container>
        {children
          ?.filter((child) => child.hidden !== true)
          ?.map((child, index) => {
            if (child.disabled) {
              return (
                <ButtonOptions
                  key={`CSVLink_${child.id}_${index}`}
                  disabled={true}
                >
                  {child.name}
                </ButtonOptions>
              );
            }
            return (
              <div
                key={`CSVLink_${child.id}_${index}`}
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  e.preventDefault();
                  if (child?.onClick) {
                    child?.onClick?.(e);
                  }
                }}
              >
                <CSVLink
                  key={`CSVLink_${child.id}_${index}`}
                  ref={child?.ref || null}
                  {...child.csvProps}
                  filename={child.csvProps.filename ?? "filename"}
                >
                  <ButtonOptions disabled={false}>
                    {child?.loading ? (
                      <div data-loader>
                        <Loading size={1} />
                      </div>
                    ) : (
                      ""
                    )}
                    <span>{child.name}</span>
                  </ButtonOptions>
                </CSVLink>
              </div>
            );
          })}
      </ButtonsContainer>
    </Container>
  );
}

export default ExportDropdown;
