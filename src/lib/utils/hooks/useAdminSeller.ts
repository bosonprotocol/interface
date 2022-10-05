import { useAccount } from "wagmi";

import { CONFIG } from "../../config";
import useGetLensProfiles from "./lens/profile/useGetLensProfiles";
import { useSellers } from "./useSellers";

interface Props {
  showErrors: boolean;
}

export function useAdminSeller({ showErrors }: Props) {
  const { address } = useAccount();

  const { data: sellers } = useSellers(
    {
      admin: address,
      includeFunds: true
    },
    {
      enabled: !CONFIG.lens.enabled
    }
  );
  const { data: lensProfiles } = useGetLensProfiles(
    {
      ownedBy: [address],
      limit: 50 // max
    },
    {
      enabled: !!address && CONFIG.lens.enabled
    }
  );
  const handles = lensProfiles?.items.map((lensProfile) =>
    ((lensProfile.handle as string) || "").substring(
      0,
      ((lensProfile.handle as string) || "").lastIndexOf(".")
    )
  );
  const { data: lensAdminSellers } = useSellers(
    {
      admin_in: [address || ""], // TODO: change: handles,
      includeFunds: true
    },
    {
      enabled: lensProfiles && CONFIG.lens.enabled
    }
  );
  const lensAdminSeller = lensAdminSellers?.[0];
  if (CONFIG.lens.enabled && (lensAdminSellers?.length ?? 0) > 1) {
    showErrors &&
      console.error(
        `There is more than one seller with my handles (${handles?.join(",")})`
      );
  }
  const lensProfile = lensProfiles?.items.find(
    (lensProfile) => lensProfile.handle === lensAdminSeller?.admin
  );
  const adminSeller = CONFIG.lens.enabled ? lensAdminSeller : sellers?.[0];

  return {
    adminSeller: adminSeller,
    lensProfile
  };
}
