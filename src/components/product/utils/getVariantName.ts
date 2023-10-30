export const getVariantName = ({
  color,
  size
}: {
  color: string | undefined;
  size: string | undefined;
}): string => {
  if (!color && !size) {
    return "Unknown name";
  }
  if (!color && size) {
    return size;
  }
  if (!size && color) {
    return color;
  }
  return `${color} / ${size}`;
};
