import { AiOutlineShoppingCart } from "react-icons/ai";
import { BiDollarCircle, BiPackage } from "react-icons/bi";
import { BsArrowRightShort } from "react-icons/bs";
import styled from "styled-components";

import frameImage from "../../assets/frame.png";
import { Modal } from "../../components/modal/Modal";
import { BosonRoutes } from "../../lib/routing/routes";
import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";
import { LinkWithQuery } from "../linkStoreFields/LinkStoreFields";
import Grid from "../ui/Grid";
import { buttonText } from "../ui/styles";
import Typography from "../ui/Typography";

const CommitStepWrapper = styled.div`
  overflow: hidden;
  margin: 1rem 0;
  display: grid;
  grid-template-columns: 1fr;
  justify-content: space-between;

  grid-template-columns: repeat(1, minmax(0, 1fr));
  grid-row-gap: 1rem;
  grid-column-gap: 1rem;
  ${breakpoint.m} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  svg {
    fill: var(--secondary);
  }
`;

const CommitStep = styled.div`
  position: relative;
  padding: 1rem;
  background: ${colors.lightGrey};
  &:not(:last-child) {
    &:before {
      position: absolute;
      content: "";
      width: 0;
      height: 0;

      bottom: -1rem;
      left: 50%;
      transform: translate(-50%, 0);
      border-left: 30rem solid transparent;
      border-right: 30rem solid transparent;
      border-top: 1rem solid ${colors.lightGrey};
    }

    &:after {
      position: absolute;
      content: "";
      width: 0;
      height: 0;

      bottom: -2rem;
      left: 50%;
      transform: translate(-50%, 0);
      border-left: 30rem solid transparent;
      border-right: 30rem solid transparent;
      border-top: 1rem solid ${colors.white};
      z-index: 1;
    }
  }
  ${breakpoint.m} {
    &:not(:first-child) {
      padding-left: 2rem;
    }
    &:not(:last-child) {
      &:before {
        position: absolute;
        content: "";
        width: 0;
        height: 0;

        top: 50%;
        bottom: 0;
        right: -1rem;
        left: initial;
        transform: translate(0%, -50%);
        border-top: 10rem solid transparent;
        border-left: 1rem solid ${colors.lightGrey};
        border-bottom: 10rem solid transparent;
        border-right: none;
      }

      &:after {
        position: absolute;
        content: "";
        width: 0;
        height: 0;

        top: 50%;
        bottom: 0;
        right: -2rem;
        left: initial;
        transform: translate(0%, -50%);
        border-top: 10rem solid transparent;
        border-left: 1rem solid ${colors.white};
        border-bottom: 10rem solid transparent;
        border-right: none;
        z-index: 1;
      }
    }
  }
`;

const LearnMore = styled(LinkWithQuery)`
  all: unset;
  display: flex;
  align-items: center;
  cursor: pointer;
  ${() => buttonText};
  color: var(--secondary);

  transition: all 150ms ease-in-out;
  > svg {
    transition: all 150ms ease-in-out;
    transform: translateX(0);
  }
  &:hover {
    color: ${colors.black};
    > svg {
      transform: translateX(5px);
      fill: ${colors.black};
    }
  }
`;

const DarkBackground = styled.div`
  overflow: hidden;
  margin: 2rem -2rem -2rem -2rem;
  padding: 2rem;
  background-color: ${colors.black};
  background-image: url(${frameImage});

  background-repeat: no-repeat;
  background-position: bottom right;
  padding-right: 2rem;
  padding-bottom: 20rem;

  ${breakpoint.s} {
    padding-right: 15rem;
    padding-bottom: 12rem;
  }
  color: ${colors.white};
`;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const COMMIT_STEPS = [
  {
    icon: AiOutlineShoppingCart,
    header: "Commit",
    description:
      "Commit to an Offer to receive a Redeemable NFT (rNFT) that can be exchanged for the real-world item it represents"
  },
  {
    icon: BiDollarCircle,
    header: "Hold, Trade or Transfer ",
    description:
      "You can  hold, transfer or easily trade your rNFT on the secondary market"
  },
  {
    icon: BiPackage,
    header: "Redeem",
    description:
      "Redeem your rNFT to receive the underlying item. The rNFT will be destroyed in the process."
  }
];

export default function OfferDetailModal({ isOpen, onClose }: Props) {
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
      <DarkBackground>
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
      </DarkBackground>
    </Modal>
  );
}
