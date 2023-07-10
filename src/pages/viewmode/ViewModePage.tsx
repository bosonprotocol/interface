import { Link } from "react-router-dom";

import Button from "../../components/ui/Button";
import Grid from "../../components/ui/Grid";
import Typography from "../../components/ui/Typography";
import { DrCenterRoutes } from "../../lib/routing/drCenterRoutes";
import { BosonRoutes } from "../../lib/routing/routes";

export const ViewModePage = () => {
  return (
    <Grid
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      margin="5rem 0"
    >
      <Typography>
        This is the home page of the preview, you can see how both DAPP and DR
        Center look by clicking on the buttons below
      </Typography>
      <Grid
        justifyContent="center"
        alignItems="center"
        gap="1rem"
        margin="1rem"
      >
        <Button theme="secondary">
          <Link to={BosonRoutes.Root}>Go to the DAPP</Link>
        </Button>
        <Button theme="secondary">
          <Link to={DrCenterRoutes.Root}>Go to the DR Center</Link>
        </Button>
      </Grid>
    </Grid>
  );
};

export default ViewModePage;
