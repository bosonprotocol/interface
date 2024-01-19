import searchIcon from "assets/svg/search.svg";
import { LoadingRows as BaseLoadingRows } from "components/loader/styled";
import { AutoColumn } from "components/ui/column";
import Grid from "components/ui/Grid";
import { colors } from "lib/styles/colors";
import styled from "styled-components";

export const PaddedColumn = styled(AutoColumn)`
  padding: 20px;
`;

export const MenuItem = styled(Grid)<{
  dim?: boolean;
  disabled?: boolean;
  selected?: boolean;
}>`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) auto minmax(0, 72px);
  grid-gap: 16px;
  cursor: ${({ disabled }) => !disabled && "pointer"};
  pointer-events: ${({ disabled }) => disabled && "none"};
  &:hover {
    background-color: ${({ theme }) => theme.hoverDefault};
  }
  opacity: ${({ disabled, selected, dim }) =>
    dim || disabled || selected ? 0.4 : 1};
`;

export const SearchInput = styled.input`
  background: no-repeat scroll 7px 7px;
  background-image: url(${searchIcon});
  background-size: 20px 20px;
  background-position: 12px center;
  position: relative;
  display: flex;
  padding: 16px;
  padding-left: 40px;
  height: 40px;
  align-items: center;
  width: 100%;
  white-space: nowrap;
  background-color: ${({ theme }) => theme.backgroundModule};
  border: none;
  outline: none;
  border-radius: 12px;
  color: ${({ theme }) => theme.textPrimary};
  border-style: solid;
  border: 1px solid ${colors.lightGrey};
  -webkit-appearance: none;

  font-size: 1rem;

  &::placeholder {
    color: ${({ theme }) => theme.textTertiary};
    font-size: 1rem;
  }
  transition: border 100ms;
  &:focus {
    border: 1px solid ${({ theme }) => theme.accentActiveSoft};
    background-color: ${colors.lightGrey};
    outline: none;
  }
`;
export const Separator = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${colors.lightGrey};
`;

export const LoadingRows = styled(BaseLoadingRows)`
  grid-column-gap: 0.5em;
  grid-template-columns: repeat(12, 1fr);
  max-width: 960px;
  padding: 12px 20px;

  & > div:nth-child(4n + 1) {
    grid-column: 1 / 8;
    height: 1em;
    margin-bottom: 0.25em;
  }
  & > div:nth-child(4n + 2) {
    grid-column: 12;
    height: 1em;
    margin-top: 0.25em;
  }
  & > div:nth-child(4n + 3) {
    grid-column: 1 / 4;
    height: 0.75em;
  }
`;
