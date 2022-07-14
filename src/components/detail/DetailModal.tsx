import { BsArrowRightShort } from "react-icons/bs";

import { Modal } from "../../components/modal/Modal";
import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";
import Grid from "../ui/Grid";
import Typography from "../ui/Typography";
import { COMMIT_STEPS } from "./const";
import {
  CommitStep,
  CommitStepWrapper,
  LearnMore,
  ModalBackground
} from "./Detail.style";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function DetailModal({ isOpen, onClose }: Props) {
  const { isLteXS } = useBreakpoints();
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      style={{
        padding: "0",
        borderRadius: 0,
        borderWidth: 0,
        background: colors.white,
        color: colors.black,
        fill: colors.black
      }}
      title={
        <Typography tag="h3">
          <b>Commit and redeem</b>
        </Typography>
      }
    >
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
            <LearnMore to={BosonRoutes.LearnMore}>
              <>
                Learn more
                <BsArrowRightShort size={32} />
              </>
            </LearnMore>
          </div>
        </Grid>
      </ModalBackground>
    </Modal>
  );
}
