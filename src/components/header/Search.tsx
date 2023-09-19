import { MagnifyingGlass } from "phosphor-react";
import { useCallback, useState } from "react";
import styled, { css } from "styled-components";

import { ExploreQueryParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import BosonButton from "../ui/BosonButton";
import Grid from "../ui/Grid";

const InputWrapper = styled(Grid)<{
  isMobile: boolean;
  $navigationBarPosition?: string;
}>`
  flex: 1;
  gap: 1rem;

  padding: 1.5rem 1.75rem;
  border-bottom: 2px solid ${colors.border};
  background: color-mix(in srgb, var(--headerBgColor) 90%, black);

  margin: 0rem;

  ${({ isMobile, $navigationBarPosition }) =>
    isMobile
      ? ""
      : ["left", "right"].includes($navigationBarPosition ?? "")
      ? css`
          border-bottom: none;
          padding: 0.25rem 1rem;
        `
      : css`
          max-width: 487px;
          border-bottom: none;
          margin: 1.25rem 0.5rem 1.25rem 0;
          padding: 0.25rem 1rem 0.25rem 1rem;
        `}
`;

const Input = styled.input`
  max-width: 100%;
  width: 21.25rem;
  font-size: 16px;
  background: transparent;
  border-width: 0;
  font-style: normal;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  ::placeholder {
    color: var(--headerTextColor);
  }
  &:focus {
    outline: none;
  }
`;

interface Props {
  isMobile: boolean;
  navigationBarPosition?: string;
}

export default function Search({ isMobile, navigationBarPosition }: Props) {
  const navigate = useKeepQueryParamsNavigate();
  const [name, setName] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setName(newValue);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter") {
      navigateToExplore();
    }
  };
  const navigateToExplore = useCallback(() => {
    navigate({
      pathname: BosonRoutes.Explore,
      search: name ? `${ExploreQueryParameters.name}=${name}` : ""
    });
    setName("");
  }, [navigate, name]);

  return (
    <InputWrapper
      isMobile={isMobile}
      $navigationBarPosition={navigationBarPosition}
    >
      {!isMobile && <MagnifyingGlass size={24} />}
      <Input
        data-testid="search-by-name-input"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        value={name}
        placeholder="Search"
        style={{ flex: "1" }}
      />
      {isMobile && (
        <BosonButton onClick={navigateToExplore} variant="primaryFill">
          <MagnifyingGlass size={16} />
        </BosonButton>
      )}
    </InputWrapper>
  );
}
