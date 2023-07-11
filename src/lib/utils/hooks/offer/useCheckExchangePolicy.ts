import { offers } from "@bosonprotocol/react-kit";
import { useEffect, useState } from "react";

import { CONFIG } from "../../../config";
import { getIpfsGatewayUrl } from "../../ipfs";
import { fetchTextFile } from "../../textFile";
import { useCoreSDK } from "../../useCoreSdk";

interface Props {
  offerId: string | undefined;
}

export default function useCheckExchangePolicy({
  offerId
}: Props): offers.CheckExchangePolicyResult | undefined {
  const [result, setResult] = useState<
    offers.CheckExchangePolicyResult | undefined
  >(undefined);
  const core = useCoreSDK();
  useEffect(() => {
    if (!core || !offerId || !CONFIG.fairExchangePolicyRules) {
      return undefined;
    }
    (async () => {
      try {
        const rulesTemplateUri = getIpfsGatewayUrl(
          CONFIG.fairExchangePolicyRules as string
        );
        const rulesTemplateText = await fetchTextFile(rulesTemplateUri);
        const rulesTemplate = JSON.parse(
          rulesTemplateText
        ) as offers.CheckExchangePolicyRules;
        // replace DEFAULT_DISPUTE_RESOLVER_ID (environment dependent)
        const disputeResolverId_matches =
          rulesTemplate?.yupSchema?.properties?.disputeResolverId?.matches?.replace(
            "<DEFAULT_DISPUTE_RESOLVER_ID>",
            CONFIG.defaultDisputeResolverId
          );
        if (disputeResolverId_matches) {
          rulesTemplate.yupSchema.properties.disputeResolverId.matches =
            disputeResolverId_matches;
        }
        // replace TOKENS_LIST (environment dependent)
        const tokensList = CONFIG.defaultTokens.map((token) => token.address);
        const tokensList_pattern =
          rulesTemplate?.yupSchema?.properties?.exchangeToken?.properties?.address?.pattern?.replace(
            "<TOKENS_LIST>",
            tokensList.join("|")
          );
        if (
          rulesTemplate.yupSchema.properties.exchangeToken.properties &&
          tokensList_pattern
        ) {
          rulesTemplate.yupSchema.properties.exchangeToken.properties.address.pattern =
            tokensList_pattern;
        }
        const _result = await core.checkExchangePolicy(offerId, rulesTemplate);
        setResult(_result);
      } catch (e) {
        console.error(e);
        setResult(undefined);
      }
    })();
  }, [core, offerId]);
  return result;
}
