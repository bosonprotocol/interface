export const socialLinkPattern =
  "^(http://|https://)?(www.)?([a-zA-Z0-9]+).[a-zA-Z0-9]*.[a-z]{1}.([-a-z-0-9:_+.?/@]+)?$";

export const websitePattern = socialLinkPattern;

export const preAppendHttps = (url: string) => {
  return url.startsWith("https://") || url.startsWith("http://")
    ? url
    : `https://${url}`;
};
