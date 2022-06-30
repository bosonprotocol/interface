import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { WagmiConfig } from "wagmi";

import { wagmiClient } from "../../lib/wallet-connection";
import App from "./index";

test("renders App and expects logo to be displayed", () => {
  const queryClient = new QueryClient();

  render(
    <MemoryRouter>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider appInfo={{ appName: "Boson dApp" }} chains={[]}>
          <QueryClientProvider client={queryClient} contextSharing>
            <App />
          </QueryClientProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </MemoryRouter>
  );
  const logo = screen.getAllByTestId("logo");
  expect(logo.length).toBe(2);
});
