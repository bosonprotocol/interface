import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import CreateOffer from "./CreateOffer";

const storeMetadataErrorMsg = "storeMetadataErrorMsg";
jest.mock("@bosonprotocol/ipfs-storage", () => {
  class IpfsMetadataMock {
    storeMetadata() {
      return;
    }
  }
  IpfsMetadataMock.prototype.storeMetadata = () =>
    Promise.reject({
      message: storeMetadataErrorMsg
    });
  return {
    IpfsMetadataStorage: IpfsMetadataMock
  };
});
test("renders CreateOffer and expects an error to be displayed if IpfsMetadata.storeMetadata fails", async () => {
  render(
    <MemoryRouter>
      <CreateOffer />
    </MemoryRouter>
  );
  act(() => {
    screen.getByText("Submit").click();
  });
  const error = await screen.findByText(storeMetadataErrorMsg);
  expect(error).toBeInTheDocument();
});
