import { offers } from "@bosonprotocol/react-kit";
import { useConfigContext } from "components/config/ConfigContext";
import { Token } from "components/convertion-rate/ConvertionRateContext";
import { useEffect, useState } from "react";

import { CONFIG } from "../../../config";
import { getIpfsGatewayUrl } from "../../ipfs";
import { fetchTextFile } from "../../textFile";
import { useCoreSDK } from "../../useCoreSdk";

interface Props {
  offerId: string | undefined;
}

const getRulesTemplate = async (
  fairExchangePolicyRules: string | undefined,
  defaultDisputeResolverId: string,
  defaultTokens: Token[]
) => {
  if (!fairExchangePolicyRules) {
    return undefined;
  }
  const rulesTemplateUri = getIpfsGatewayUrl(fairExchangePolicyRules as string);
  const rulesTemplateText = await fetchTextFile(rulesTemplateUri);
  const rulesTemplate = JSON.parse(
    rulesTemplateText
  ) as offers.CheckExchangePolicyRules;
  // replace DEFAULT_DISPUTE_RESOLVER_ID (environment dependent)
  const disputeResolverId_matches =
    rulesTemplate?.yupSchema?.properties?.disputeResolverId?.matches?.replace(
      "<DEFAULT_DISPUTE_RESOLVER_ID>",
      defaultDisputeResolverId
    );
  if (disputeResolverId_matches) {
    rulesTemplate.yupSchema.properties.disputeResolverId.matches =
      disputeResolverId_matches;
  }
  // replace TOKENS_LIST (environment dependent)
  const tokensList = defaultTokens.map((token) => token.address);
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
  return rulesTemplate;
};

export default function useCheckExchangePolicy({ offerId }: Props) {
  const { config } = useConfigContext();
  const [result, setResult] = useState<
    offers.CheckExchangePolicyResult | undefined
  >(undefined);
  const [rulesTemplate, setRulesTemplate] = useState<
    offers.CheckExchangePolicyRules | undefined
  >(undefined);
  const core = useCoreSDK();
  useEffect(() => {
    (async () =>
      setRulesTemplate(
        await getRulesTemplate(
          CONFIG.fairExchangePolicyRules,
          config.envConfig.defaultDisputeResolverId,
          config.envConfig.defaultTokens || []
        )
      ))();
  }, [
    config.envConfig.defaultDisputeResolverId,
    config.envConfig.defaultTokens
  ]);
  useEffect(() => {
    if (
      !core ||
      !offerId ||
      !CONFIG.fairExchangePolicyRules ||
      !rulesTemplate
    ) {
      return undefined;
    }
    (async () => {
      try {
        const _result = await core.checkExchangePolicy(offerId, rulesTemplate);
        setResult(_result);
      } catch (e) {
        console.error(e);
        setResult(undefined);
      }
    })();
  }, [core, offerId, rulesTemplate]);
  return result;
}
