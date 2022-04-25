import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import App from "./index";

test("renders App and expects logo to be displayed", () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  const logo = screen.getByTestId("logo");
  expect(logo).toBeInTheDocument();
});
