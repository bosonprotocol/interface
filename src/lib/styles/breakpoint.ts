export const breakpointNumbers = {
  xxs: 0,
  xs: 480,
  s: 768,
  m: 981,
  l: 1200,
  xl: 1500
};

export const breakpoint = {
  xxs: `@media (max-width: ${breakpointNumbers.xs - 1}px)`,
  xs: `@media (min-width: ${breakpointNumbers.xs}px)`,
  s: `@media (min-width: ${breakpointNumbers.s}px)`,
  m: `@media (min-width: ${breakpointNumbers.m}px)`,
  l: `@media (min-width: ${breakpointNumbers.l}px)`,
  xl: `@media (min-width: ${breakpointNumbers.xl}px)`
};
