import { RouteProps } from "react-router";

export type IRoutes = RouteProps & {
  component:
    | React.ComponentType<any> // eslint-disable-line
    | React.LazyExoticComponent<React.ComponentType<any>>; // eslint-disable-line
  role: Array<string | null>;
  componentProps?: {
    [key: string]: string;
  };
  app?: {
    withLayout?: boolean;
    withFullLayout?: boolean;
    withFooter?: boolean;
    fluidHeader?: boolean;
  };
};
