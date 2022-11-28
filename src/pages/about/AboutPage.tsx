import { CheckCircle, XCircle } from "phosphor-react";
import styled from "styled-components";

import Grid from "../../components/ui/Grid";
import Typography from "../../components/ui/Typography";
import { CONFIG } from "../../lib/config";
import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";

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

    :first-child {
      ${breakpoint.s} {
        min-width: 15rem;
        max-width: 15rem;
      }
      margin-right: 1rem;
    }
    :last-child {
      font-weight: bold;
    }
  }
`;

function AboutPage() {
  console.log({ CONFIG, env: process.env });

  return (
    <Wrapper
      flexDirection="column"
      alignItems="flex-start"
      justifyContent="flex-start"
      gap="0.5rem"
    >
      <Text margin="0 0 0.5rem 0">
        <span>Environment name:</span>
        <span>{CONFIG.envName || "-"}</span>
      </Text>
      <Text margin="0 0 0.5rem 0">
        <span>Release version:</span>
        <span>{CONFIG.releaseTag || "-"}</span>
      </Text>
      <Text margin="0 0 0.5rem 0">
        <span>Curation Lists Enabled:</span>
        {CONFIG.enableCurationLists ? (
          <CheckCircle size={20} color={colors.green} />
        ) : (
          <XCircle size={20} color={colors.red} />
        )}
      </Text>
      {CONFIG.enableCurationLists && (
        <>
          <Text margin="0 0 0.5rem 0">
            <span>Seller Curation List:</span>
            <span>{CONFIG.sellerCurationList || "-"}</span>
          </Text>
          <Text margin="0 0 0.5rem 0">
            <span>Offer Curation List:</span>
            <span>{CONFIG.offerCurationList || "-"}</span>
          </Text>
          <Text margin="0 0 0.5rem 0">
            <span>Eligible Wallets List:</span>
            <span>{CONFIG.eligibleSellerWalletAddresses || "-"}</span>
          </Text>
        </>
      )}
      <Text margin="0 0 0.5rem 0">
        <span>Create Profile Configuration:</span>
        <span>{CONFIG.createProfileConfiguration || "-"}</span>
      </Text>
      <Text margin="0 0 0.5rem 0">
        <span>Link to Buyer/Seller Agreement Template:</span>
        <span>{CONFIG.buyerSellerAgreementTemplate || "-"}</span>
      </Text>
      <Text margin="0 0 0.5rem 0">
        <span>Link to rNFT License Template:</span>
        <span>{CONFIG.rNFTLicenseTemplate || "-"}</span>
      </Text>
      <Grid margin="0 0 0.5rem 0">
        <>
          <Text>
            <span>Default token list:</span>
            <span>
              {CONFIG.defaultTokens.map((token, index) => {
                return (
                  <span key={`token_${token.symbol}_${index}`}>
                    {JSON.stringify(token)}
                  </span>
                );
              })}
            </span>
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
        <span>{CONFIG.defaultDisputeResolverId || "-"}</span>
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
    </Wrapper>
  );
}

export default AboutPage;
