import { checkValidUrl, preAppendHttps } from "./url";

const validUrls = [
  "https://www.example.com/search?q=a",
  "https://example.com/path/123/path-1-a",
  "https://example.com",
  "http://example.com",
  "example.com",
  "https://example.com",
  "https://www.example",
  "www.example",
  "www.example.com",
  "www.example.com:80",
  "www.example.com:80/",
  "https://example.com/path",
  "https://example.com:8080/path",
  "http://example.com.local/path",
  "https://example.com/index.html",
  "https://example.com/index.html#my-section",
  "https://example.com/search?q=hello+world",
  "http://example.com/?q=hello%20world",
  "http://example.com/index.html?q=hello%20world#my-section",
  "http://example.com:8080/path?q=hello%20world#my-section",
  "http://example.com/foo%20bar",
  "https://example.com/#bar%20foo",
  "http://example.com/path?q=hello%20world&another_param=value",
  "https://example.com/#my-section%20with%20spaces",
  "https://example.com/%E2%98%85%E2%98%85%E2%98%85",
  "http://example.com/%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C"
];
describe("url", () => {
  describe("test valid urls", () => {
    test.each(validUrls)("%s is a valid url", (...urls) => {
      urls.forEach((url) => {
        expect(checkValidUrl(url, { addHttpPrefix: true })).toBe(true);
      });
    });
  });

  describe("preAppendHttps", () => {
    test("url starts with https:// if it did not", () => {
      const url = "example.com";
      expect(preAppendHttps(url)).toBe(`https://${url}`);
    });
    test("url is not modified if it already starts with https://", () => {
      const url = "https://example.com";
      expect(preAppendHttps(url)).toBe(url);
    });
    test("url is not modified if it already starts with http://", () => {
      const url = "http://example.com";
      expect(preAppendHttps(url)).toBe(url);
    });
  });
});
