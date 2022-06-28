import { useCallback, useState } from "react";
import { BsSearch } from "react-icons/bs";
import styled from "styled-components";

import { ExploreQueryParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import Grid from "../ui/Grid";

const InputWrapper = styled(Grid)`
  flex: 1;
  background: ${colors.lightGrey};
  margin: 0.75rem;
  padding: 0.25rem 0.75rem;
  gap: 1rem;
  min-width: 20rem;
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
    </InputWrapper>
  );
}
