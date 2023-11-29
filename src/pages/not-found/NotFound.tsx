import { ErrorMessage } from "components/error/ErrorMessage";

import frame404 from "../../assets/frame404.png";
import BosonButton from "../../components/ui/BosonButton";
import { BosonRoutes } from "../../lib/routing/routes";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";

function NotFound() {
  const navigate = useKeepQueryParamsNavigate();
  return (
    <ErrorMessage
      title={`404
      Page doesn't exist`}
      message={`Sorry, the page you are looking for doesn't exist or has been moved.
      Let's head back home and try again.`}
      img={<img src={frame404} alt="404 - Page doesn't exist" />}
      cta={
        <BosonButton
          variant="primaryFill"
          onClick={() => navigate({ pathname: BosonRoutes.Root })}
        >
          Go to Homepage
        </BosonButton>
      }
    />
  );
}

export default NotFound;
