import { render, screen } from "@testing-library/react";

import App from "./index";

test("renders App and expects Boson dApp to be displayed", () => {
  render(<App />);
  const linkElement = screen.getByText(/Boson dApp/i);
  expect(linkElement).toBeInTheDocument();
});
