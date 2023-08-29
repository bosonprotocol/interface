import * as Sentry from "@sentry/browser";
import { useWeb3React } from "@web3-react/core";
import { utils } from "ethers";
import { useEffect, useState } from "react";

import { BosonSnapshotGate__factory } from "../../../../components/detail/DetailWidget/BosonSnapshotGate/typechain";
import { Offer } from "../../../types/offer";
import { useCoreSDK } from "../../useCoreSdk";
import { useEthersSigner } from "../ethers/useEthersSigner";

interface Props {
  commitProxyAddress?: string | undefined;
  condition?: Offer["condition"] | undefined;
}

export default function useCheckTokenGatedOffer({
  commitProxyAddress,
  condition
}: Props) {
  const signer = useEthersSigner();
  const { account: address } = useWeb3React();

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
          const [owned, used] = await proxyContract.checkSnapshot(
            condition.tokenId,
            utils.getAddress(address)
          );
          setConditionMet(owned.sub(used).gt("0"));
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
        return;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [condition, address, commitProxyAddress]);
  return {
    isConditionMet
  };
}
