export const websitePattern =
  "^(http://|https://)?(www.)?([a-zA-Z0-9]+).[a-zA-Z0-9]*.[‌​a-z]{1}.([a-z]+)?$";

export const preAppendHttps = (url: string) => {
  return url.startsWith("https://") || url.startsWith("http://")
    ? url
    : `https://${url}`;
};
