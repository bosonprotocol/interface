import { MagnifyingGlass } from "phosphor-react";
import { useState } from "react";
import styled from "styled-components";

import { BosonRoutes } from "../../../lib/routing/routes";
import { colors } from "../../../lib/styles/colors";
import { useKeepQueryParamsNavigate } from "../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import Button from "../../ui/Button";
import Grid from "../../ui/Grid";

const InputWrapper = styled(Grid)`
  flex: 1;
  gap: 1rem;

  padding: 0.75rem 1.5rem;
  background: ${colors.border};
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

export default function SellerFilters() {
  const [search, setSearch] = useState<string>("");
  const navigate = useKeepQueryParamsNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearch(newValue);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter") {
      console.log(search);
    }
  };

  return (
    <Grid gap="1rem" padding="2rem 0">
      <div>
        <InputWrapper>
          <MagnifyingGlass size={24} />
          <Input
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            value={search}
            placeholder="Search"
          />
        </InputWrapper>
      </div>
      <Button
        theme="secondary"
        size="small"
        onClick={() => {
          navigate({ pathname: BosonRoutes.CreateProduct });
        }}
      >
        Add new product
      </Button>
    </Grid>
  );
}
