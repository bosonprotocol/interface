import Navigate from "../components/customNavigation/Navigate";
import { BosonRoutes } from "../lib/routing/routes";

interface Props {
  children: JSX.Element;
  isAuth: boolean;
}
export default function GuardedRoute({ isAuth, children }: Props) {
  return isAuth ? children : <Navigate to={{ pathname: BosonRoutes.Root }} />;
}
