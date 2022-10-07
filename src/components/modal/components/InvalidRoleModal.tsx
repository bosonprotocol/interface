import { BosonRoutes } from "../../../lib/routing/routes";
import { useKeepQueryParamsNavigate } from "../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import Button from "../../ui/Button";
import Grid from "../../ui/Grid";
import Typography from "../../ui/Typography";

interface Props {
  requiredRole: "admin" | "operator" | "clerk" | "treasury";
  action: string;
}

export default function InvalidRoleModal({ requiredRole, action }: Props) {
  const navigate = useKeepQueryParamsNavigate();
  return (
    <>
      <Grid flexDirection="column" alignItems="flex-start">
        <Typography>
          To {action} you need to be connected as the {requiredRole}. Please,
          connect a wallet with that role or go back to the home page
        </Typography>
      </Grid>
      <Grid flexDirection="row" justifyContent="space-between">
        <Button
          theme="bosonSecondary"
          onClick={() => {
            navigate({ pathname: BosonRoutes.Root });
          }}
        >
          Go back to the home page
        </Button>
      </Grid>
    </>
  );
}
