const appEnv = process.env.REACT_APP_ENV as string;

export const REACT_APP_WIDGETS_URL =
  appEnv === "staging"
    ? "https://boson-widgets-staging.surge.sh/"
    : "https://boson-widgets-test.surge.sh/";
