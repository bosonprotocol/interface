import { CaretRight } from "phosphor-react";

import { BosonProtocolRoutes } from "../../../lib/routing/routes";
import { useBreakpoints } from "../../../lib/utils/hooks/useBreakpoints";
import { COMMIT_STEPS } from "../../detail/const";
import {
  CommitStep,
  CommitStepWrapper,
  LearnMore,
  ModalBackground
} from "../../detail/Detail.style";
import { Grid } from "../../ui/Grid";
import { Typography } from "../../ui/Typography";

export default function WhatIsRedeem() {
  const { isLteXS } = useBreakpoints();

  return (
    <>
      <Grid flexDirection="column" alignItems="flex-start">
        <Typography tag="h4" style={{ margin: 0 }}>
          <b>How does the purchase process work?</b>
        </Typography>
        <Typography tag="p">
          When Committing, the item price will be transferred into escrow and
          you will receive a redeemable NFT (rNFT) that can be exchanged for the
          real-world item it represents.
        </Typography>
      </Grid>
      <CommitStepWrapper>
        {COMMIT_STEPS.map(({ icon: Icon, header, description }, key) => (
          <CommitStep key={`commit_step_${key}`}>
            <Icon size={24} />
            <Typography tag="h6">{header}</Typography>
            <Typography tag="p">{description}</Typography>
          </CommitStep>
        ))}
      </CommitStepWrapper>
      <ModalBackground>
        <Grid flexDirection={isLteXS ? "column" : "row"}>
          <div>
            <Typography tag="h4" style={{ margin: 0 }}>
              <b>Backed by Boson's settlement layer</b>
            </Typography>
            <Typography tag="p">
              Boson Protocol's settlement layer secures the commercial exchange
              of on-chain value for real-world assets. You can be certain that
              when redeeming you will either receive the physical good or your
              money back
            </Typography>
            <LearnMore href={BosonProtocolRoutes.LearnMore} target="_blank">
              <>
                Learn more
                <CaretRight size={32} />
              </>
            </LearnMore>
          </div>
        </Grid>
      </ModalBackground>
    </>
  );
}
