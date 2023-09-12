import { QueryClient } from "react-query";

export const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Unable to find the root element");
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});
