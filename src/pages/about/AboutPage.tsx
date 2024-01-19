import { useConfigContext } from "components/config/ConfigContext";
import { onlyFairExchangePolicyLabel } from "lib/constants/policies";
import { CheckCircle, XCircle } from "phosphor-react";
import styled from "styled-components";

import Grid from "../../components/ui/Grid";
import Typography from "../../components/ui/Typography";
import { CONFIG } from "../../lib/config";
import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { useCurationLists } from "../../lib/utils/hooks/useCurationLists";

const Wrapper = styled(Grid)`
  padding: 4rem 0;
`;
const Text = styled(Typography)`
  flex-direction: column;
  ${breakpoint.s} {
    flex-direction: row;
  }

  > span {
    word-break: break-word;
    max-width: 100%;

    &:first-child {
      ${breakpoint.s} {
        min-width: 15rem;
        max-width: 15rem;
      }
      margin-right: 1rem;
    }
    &:last-child {
      font-weight: bold;
    }
  }
  ul {
    word-break: break-word;
  }
`;

function AboutPage() {
  const { config } = useConfigContext();
  const curationLists = useCurationLists();
  return (
    <Wrapper
      flexDirection="column"
      alignItems="flex-start"
      justifyContent="flex-start"
      gap="0.5rem"
    >
      <Text margin="0 0 0.5rem 0">
        <span>Environment name:</span>
        <span>{config.envName || "-"}</span>
      </Text>
      <Text margin="0 0 0.5rem 0">
        <span>Release version:</span>
        <span>{CONFIG.releaseTag || "-"}</span>
      </Text>
      <Text margin="0 0 0.5rem 0">
        <span>Release name:</span>
        <span>{CONFIG.releaseName || "-"}</span>
      </Text>
      <Text margin="0 0 0.5rem 0">
        <span>Curation Lists Enabled:</span>
        {CONFIG.enableCurationLists ? (
          <CheckCircle size={20} color={colors.green} />
        ) : (
          <XCircle size={20} color={colors.red} />
        )}
      </Text>
      <Text margin="0 0 0.5rem 0">
        <span>Seller Curation List:</span>
        <span>
          {curationLists.isError
            ? "- ERROR -"
            : curationLists.sellerCurationList
            ? (curationLists.sellerCurationList || []).map((s, i) => {
                const lastElem =
                  i === (curationLists.sellerCurationList || []).length - 1;
                return (
                  <span key={`sellerCurationList_${s}_${i}`}>
                    {s}
                    {!lastElem ? "," : ""}
                  </span>
                );
              })
            : "undefined"}
        </span>
      </Text>
      <Text margin="0 0 0.5rem 0">
        <span>Offer Curation List:</span>
        <span>
          {CONFIG.offerCurationList && CONFIG.offerCurationList.length
            ? (CONFIG.offerCurationList || []).map((s, i) => {
                const lastElem =
                  i === (CONFIG.offerCurationList || []).length - 1;
                return (
                  <span key={`offerCurationList_${s}_${i}`}>
                    {s}
                    {!lastElem ? "," : ""}
                  </span>
                );
              })
            : "-"}
        </span>
      </Text>
      <Text margin="0 0 0.5rem 0">
        <span>Link to Buyer/Seller Agreement Template:</span>
        <span>{CONFIG.buyerSellerAgreementTemplate || "-"}</span>
      </Text>
      <Text margin="0 0 0.5rem 0">
        <span>Link to rNFT License Template:</span>
        <span>{CONFIG.rNFTLicenseTemplate || "-"}</span>
      </Text>
      <Text margin="0 0 0.5rem 0">
        <span>Link to {onlyFairExchangePolicyLabel} Rules:</span>
        <span>{CONFIG.fairExchangePolicyRules || "-"}</span>
      </Text>
      <Grid margin="0 0 0.5rem 0">
        <>
          <Text>
            <span>Default token list:</span>
            <ul>
              {config.envConfig.defaultTokens?.map((token, index) => {
                return (
                  <li key={`token_${token.symbol}_${index}`}>
                    <b>{JSON.stringify(token)}</b>
                  </li>
                );
              })}
            </ul>
          </Text>
        </>
      </Grid>
      <Text margin="0 0 0.5rem 0">
        <span>Default resolution period:</span>
        <span>{`${
          CONFIG.defaultDisputeResolutionPeriodDays || "0"
        } days`}</span>
      </Text>
      <Text margin="0 0 0.5rem 0">
        <span>Default Dispute Resolver ID:</span>
        <span>{config.envConfig.defaultDisputeResolverId || "-"}</span>
      </Text>
      <Text margin="0 0 0.5rem 0">
        <span>IPFS GATEWAY:</span>
        <a href={CONFIG.ipfsGateway} target="_blank" rel="noopener noreferrer">
          {CONFIG.ipfsGateway}
        </a>
      </Text>
      <Text margin="0 0 0.5rem 0">
        <span>IPFS IMAGE GATEWAY:</span>
        <a
          href={CONFIG.ipfsImageGateway}
          target="_blank"
          rel="noopener noreferrer"
        >
          {CONFIG.ipfsImageGateway}
        </a>
      </Text>
      <Text margin="0 0 0.5rem 0">
        <span>Carousel Promoted SellerId:</span>
        <span>{config.carouselPromotedSellerId || "-"}</span>
      </Text>
      <Text margin="0 0 0.5rem 0">
        <span>dApp View Mode Url:</span>
        <span>{CONFIG.envViewMode?.dappViewModeUrl || "-"}</span>
      </Text>
      <Text margin="0 0 0.5rem 0">
        <span>DR Center View Mode Url:</span>
        <span>{CONFIG.envViewMode?.drCenterViewModeUrl || "-"}</span>
      </Text>
      <Text margin="0 0 0.5rem 0">
        <span>Widgets Url:</span>
        <span>{CONFIG.widgetsUrl || "-"}</span>
      </Text>
    </Wrapper>
  );
}

export default AboutPage;
