import Button from "../../components/ui/Button";
import Grid from "../../components/ui/Grid";
import Typography from "../../components/ui/Typography";
import { DrCenterRoutes } from "../../lib/routing/drCenterRoutes";
import { BosonRoutes } from "../../lib/routing/routes";
import { goToViewMode, ViewMode } from "../../lib/viewMode";

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
        <Button
          theme="secondary"
          onClick={() => {
            goToViewMode(ViewMode.DAPP, BosonRoutes.Root);
          }}
        >
          Go to the DAPP
        </Button>
        <Button
          theme="secondary"
          onClick={() => {
            goToViewMode(ViewMode.DR_CENTER, DrCenterRoutes.Root);
          }}
        >
          Go to the DR Center
        </Button>
      </Grid>
    </Grid>
  );
};

export default ViewModePage;
