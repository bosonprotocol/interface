export const socialLinkPattern =
  "^(http://|https://)?(www.)?([a-zA-Z0-9]+).[a-zA-Z0-9]*.[a-z]{1}.([-a-z-A-Z-0-9:_+.?/@#%&=]+)?$";

export const websitePattern = socialLinkPattern;
export const notUrlErrorMessage = "This is not a URL like: www.example.com";
export const preAppendHttps = (url: string) => {
  return url.startsWith("https://") || url.startsWith("http://")
    ? url
    : `https://${url}`;
};

export const checkValidUrl = (
  url: string,
  { addHttpPrefix }: { addHttpPrefix: boolean } = { addHttpPrefix: true }
) => {
  try {
    new URL(addHttpPrefix ? preAppendHttps(url) : url);
    return true;
  } catch (err) {
    return false;
  }
};
