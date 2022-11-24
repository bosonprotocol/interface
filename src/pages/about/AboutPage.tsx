import React from "react";

import Grid from "../../components/ui/Grid";
import Typography from "../../components/ui/Typography";
import { CONFIG } from "../../lib/config";

function AboutPage() {
  console.log(CONFIG.metaTx.apiIds);
  return (
    <>
      <Typography margin="0 0 0.5rem 0">
        Environment name: {CONFIG.envName}
      </Typography>
      <Typography margin="0 0 0.5rem 0">
        Release version: {CONFIG.releaseName}
      </Typography>
      <Typography margin="0 0 0.5rem 0">
        Curation Lists Enabled: {CONFIG.enableCurationLists}
      </Typography>
      {CONFIG.enableCurationLists && (
        <>
          <Typography margin="0 0 0.5rem 0">
            Seller Curation List: {CONFIG.sellerCurationList}
          </Typography>
          <Typography margin="0 0 0.5rem 0">
            Offer Curation List: {CONFIG.offerCurationList}
          </Typography>
          <Typography margin="0 0 0.5rem 0">
            Eligible Wallets List: {CONFIG.eligibleSellerWalletAddresses}
          </Typography>
        </>
      )}
      <Typography margin="0 0 0.5rem 0">
        Create Profile Configuration: {CONFIG.createProfileConfiguration}
      </Typography>
      <Typography margin="0 0 0.5rem 0">
        Link to Buyer/Seller Agreement Template:{" "}
        {CONFIG.buyerSellerAgreementTemplate}
      </Typography>
      <Typography margin="0 0 0.5rem 0">
        Link to rNFT License Template: {CONFIG.rNFTLicenseTemplate}
      </Typography>
      <Grid margin="0 0 0.5rem 0">
        <>
          <Typography>Default token list:</Typography>
          {CONFIG.defaultTokens.map((token, index) => {
            return (
              <Typography margin="0 0 0 1rem" key={index}>
                {token.toString()}
              </Typography>
            );
          })}
          {Object.keys(CONFIG.metaTx.apiIds).forEach(function (key, index) {
            return (
              <Typography key={index}>
                {CONFIG.metaTx.apiIds[key].toString()}
              </Typography>
            );
          })}
        </>
      </Grid>
      <Typography margin="0 0 0.5rem 0">
        Default resolution period: {CONFIG.defaultDisputeResolutionPeriodDays}{" "}
        days
      </Typography>
      <Typography margin="0 0 0.5rem 0">
        Default Dispute Resolver ID: {CONFIG.defaultDisputeResolverId}
      </Typography>
      <Typography margin="0 0 0.5rem 0">
        IPFS GATEWAY:{" "}
        <a href={CONFIG.ipfsGateway} target="_blank" rel="noopener noreferrer">
          {CONFIG.ipfsGateway}
        </a>
      </Typography>
      <Typography margin="0 0 0.5rem 0">
        IPFS IMAGE GATEWAY:{" "}
        <a
          href={CONFIG.ipfsImageGateway}
          target="_blank"
          rel="noopener noreferrer"
        >
          {CONFIG.ipfsImageGateway}
        </a>
      </Typography>
    </>
  );
}

export default AboutPage;
