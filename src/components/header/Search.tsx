import { useCallback, useState } from "react";
import { BsSearch } from "react-icons/bs";
import styled from "styled-components";

import { ExploreQueryParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import Button from "../ui/Button";
import Grid from "../ui/Grid";

const InputWrapper = styled(Grid)`
  flex: 1;
  gap: 1rem;
  max-width: 100%;
  padding: 1.5rem 1.75rem;
  border-bottom: 2px solid ${colors.border};
  background: ${colors.white};

  margin: 0rem;
  ${breakpoint.s} {
    border-bottom: none;
    margin: 1.25rem;
    padding: 0.25rem 1rem;
    min-width: 20vw;
    background: ${colors.lightGrey};
  }
  ${breakpoint.l} {
    min-width: 35vw;
  }
  ${breakpoint.xl} {
    min-width: 45vw;
  }
`;

const Input = styled.input`
  width: 100%;
  font-size: 16px;
  background: transparent;
  border: 0px solid ${colors.border};

  font-family: "Plus Jakarta Sans";
  font-style: normal;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;

  &:focus {
    outline: none;
  }
`;

export default function Search() {
  const { isLteXS } = useBreakpoints();
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
    <InputWrapper>
      <BsSearch size={24} />
      <Input
        data-testid="search-by-name-input"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        value={name}
        placeholder="Search"
      />
      {isLteXS && (
        <Button onClick={navigateToExplore} theme="secondary">
          <BsSearch size={16} />
        </Button>
      )}
    </InputWrapper>
  );
}
