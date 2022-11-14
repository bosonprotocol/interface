import * as Sentry from "@sentry/browser";
import { utils } from "ethers";
import { useEffect, useState } from "react";
import { useAccount, useSigner } from "wagmi";

import { BosonSnapshotGate__factory } from "../../../../components/detail/DetailWidget/BosonSnapshotGate/typechain";
import { Offer } from "../../../types/offer";
import { useCoreSDK } from "../../useCoreSdk";

interface Props {
  commitProxyAddress?: string | undefined;
  condition?: Offer["condition"] | undefined;
}

export default function useCheckTokenGatedOffer({
  commitProxyAddress,
  condition
}: Props) {
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const core = useCoreSDK();
  const [isConditionMet, setConditionMet] = useState<boolean>(false);

  useEffect(() => {
    if (!address || !condition) {
      return;
    }
    (async () => {
      if (commitProxyAddress) {
        if (!signer) {
          return;
        }

        try {
          const proxyContract = BosonSnapshotGate__factory.connect(
            commitProxyAddress,
            signer
          );
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const [owned, used] = await proxyContract.checkSnapshot(
            condition.tokenId,
            utils.getAddress(address)
          );
          setConditionMet(owned.eq("1"));
        } catch (error) {
          console.error(error);
          setConditionMet(false);
          Sentry.captureException(error, {
            extra: {
              ...condition,
              commitProxyAddress,
              action: "checkSnapshot",
              location: "TokenGated"
            }
          });
        }
      }

      try {
        const met = await core.checkTokenGatedCondition(condition, address);
        setConditionMet(met);
      } catch (error) {
        console.error(error);
        setConditionMet(false);
        Sentry.captureException(error, {
          extra: {
            ...condition,
            action: "checkTokenGatedCondition",
            location: "TokenGated"
          }
        });
      }
    })();
  }, [condition, address, core, commitProxyAddress, signer]);
  return {
    isConditionMet
  };
}
