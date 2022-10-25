import frame404 from "../../assets/frame404.png";
import BosonButton from "../../components/ui/BosonButton";
import Grid from "../../components/ui/Grid";
import GridContainer from "../../components/ui/GridContainer";
import Typography from "../../components/ui/Typography";
import { BosonRoutes } from "../../lib/routing/routes";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";

function NotFound() {
  const navigate = useKeepQueryParamsNavigate();
  return (
    <GridContainer
      itemsPerRow={{
        xs: 1,
        s: 1,
        m: 2,
        l: 2,
        xl: 2
      }}
    >
      <Grid
        flexDirection="column"
        gap="1rem"
        justifyContent="center"
        alignItems="flex-start"
      >
        <Typography tag="h1">
          404
          <br />
          Page doesn’t exist
        </Typography>
        <Typography tag="p">
          Sorry, the page you are looking for doesn’t exist or has been moved.
          <br />
          Let’s head back home and try again.
        </Typography>
        <BosonButton
          variant="primaryFill"
          onClick={() => navigate({ pathname: BosonRoutes.Root })}
        >
          Go to Homepage
        </BosonButton>
      </Grid>
      <img src={frame404} alt="404 - Page doesn’t exist" />
    </GridContainer>
  );
}

export default NotFound;
