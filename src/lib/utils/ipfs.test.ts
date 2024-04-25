import { CONFIG } from "lib/config";

import { getIpfsGatewayUrl } from "./ipfs";
import { sanitizeUrl } from "./url";

const validIpfsHash = "QmfWPwbPZYFHamPH7oxWo97c5rfHFFYViXJ1tRBowxAFzr";
jest.mock("lib/config", () => ({
  CONFIG: {
    ipfsGateway: "https://ipfs.io/ipfs"
  }
}));
describe("getIpfsGatewayUrl", () => {
  it('should return the same URI when it starts with "https://lens.infura-ipfs.io/ipfs/"', () => {
    const uri = `https://lens.infura-ipfs.io/ipfs/${validIpfsHash}`;
    const result = getIpfsGatewayUrl(uri);
    expect(result).toBe(uri);
  });

  it("should return a valid IPFS gateway URL when the input is a valid CID with additional path segments", () => {
    const uri = `ipfs://${validIpfsHash}/path/to/file.png`;
    const expected = `https://ipfs.io/ipfs/${validIpfsHash}/path/to/file.png`;
    const result = getIpfsGatewayUrl(uri);
    expect(result).toBe(expected);
  });

  it("should return the same URI when it is falsy", () => {
    const uri = "";
    const result = getIpfsGatewayUrl(uri);
    expect(result).toBe(uri);
  });

  it("should return a valid IPFS gateway URL when the input is a valid IPFS URL", () => {
    const uri = `ipfs://${validIpfsHash}`;
    const expected = `${CONFIG.ipfsGateway}/${validIpfsHash}`;
    const result = getIpfsGatewayUrl(uri);
    expect(result).toBe(expected);
  });

  it("should return a valid IPFS gateway URL when the input is a valid IPFS URL with query parameters", () => {
    const uri = `ipfs://${validIpfsHash}?param1=value1&param2=value2`;
    const expected = `https://ipfs.io/ipfs/${validIpfsHash}?param1=value1&param2=value2`;
    const result = getIpfsGatewayUrl(uri);
    expect(result).toBe(expected);
  });

  it("should return a sanitized URL when the input is not a valid CID or IPFS URL", () => {
    const uri = "https://example.com/image.png";
    const result = getIpfsGatewayUrl(uri);
    expect(result).toBe(sanitizeUrl(uri));
  });

  it("should return a valid IPFS gateway URL when the input is a valid IPFS URL with additional path segments", () => {
    const uri = `ipfs://${validIpfsHash}/asdf.png?asd=1`;
    const expected = `${CONFIG.ipfsGateway}/${validIpfsHash}/asdf.png?asd=1`;
    const result = getIpfsGatewayUrl(uri);
    expect(result).toBe(expected);
  });

  it("should return a sanitized URL when the input is not a valid CID or IPFS URL with additional path segments", () => {
    const uri = "https://example.com/image.jpg?size=large";
    const result = getIpfsGatewayUrl(uri);
    expect(result).toBe(sanitizeUrl(uri));
  });

  it("should return a valid IPFS gateway URL when the input is a valid IPFS URL with additional path segments and query parameters", () => {
    const uri = `ipfs://${validIpfsHash}/asdf.png?param=1`;
    const expected = `https://ipfs.io/ipfs/${validIpfsHash}/asdf.png?param=1`;
    const result = getIpfsGatewayUrl(uri);
    expect(result).toBe(expected);
  });

  it("should return a sanitized URL when given an invalid CID input", () => {
    const uri = "invalidCID";
    const result = getIpfsGatewayUrl(uri);
    expect(result).toBe(sanitizeUrl(uri));
  });

  it("should return the same URI if it's a valid ipfs.io url with path segments and query parameters", () => {
    const uri = `https://ipfs.io/ipfs/${validIpfsHash}/nft.png?img-format=auto`;
    const result = getIpfsGatewayUrl(uri);
    expect(result).toBe(uri);
  });

  it("should return a sanitized URL when the input URI contains query parameters", () => {
    const uri = `ipfs://${validIpfsHash}/asdf.png?param1=value1&param2=value2`;
    const expected = `https://ipfs.io/ipfs/${validIpfsHash}/asdf.png?param1=value1&param2=value2`;
    const result = getIpfsGatewayUrl(uri);
    expect(result).toBe(expected);
  });
});
