import styled from "styled-components";
import { useAccount } from "wagmi";

import AdminAside from "../../components/admin/AdminAside";
import AdminInside from "../../components/admin/AdminInside";
import Grid from "../../components/ui/Grid";
import Typography from "../../components/ui/Typography";
import { useIsAdmin } from "../../lib/utils/hooks/useIsAdmin";

const AdminCenterWrapper = styled.div`
  display: grid;
  grid-template-columns: 14.3em 1fr;
  gap: 0;
  min-height: calc(100vh - 30.25rem);
  margin: 0 -1rem;
`;

function AdminCenter() {
  const { address } = useAccount();
  const isAdmin = useIsAdmin(address);

  if (!isAdmin) {
    return (
      <Grid justifyContent="center" padding="5rem" gap="5rem">
        <Typography tag="h2">You have to be admin to see that</Typography>
      </Grid>
    );
  }

  return (
    <AdminCenterWrapper>
      <AdminAside />
      <AdminInside />
    </AdminCenterWrapper>
  );
}

export default AdminCenter;
