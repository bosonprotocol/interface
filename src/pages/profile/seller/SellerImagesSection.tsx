import Avatar from "@davatar/react";
import React, { useRef } from "react";
import Moveable from "react-moveable";
// import Draggable from "react-draggable";
import styled from "styled-components";

import whiteImg from "../../../assets/white.jpeg";
import Image from "../../../components/ui/Image";
import { breakpoint } from "../../../lib/styles/breakpoint";
import { colors } from "../../../lib/styles/colors";
import { useBreakpoints } from "../../../lib/utils/hooks/useBreakpoints";
import {
  AvatarContainer,
  BannerImageLayer,
  ProfileSectionWrapper
} from "../ProfilePage.styles";

// const StyledBannerImage = styled(BannerImage)`
//   max-width: 100%;
// `;

const StyledBannerImage = styled.img`
  pointer-events: initial;
  /* height: 9rem;
  ${breakpoint.s} {
    height: 11.875rem;
  } */
  width: 100vw;
  object-fit: contain;
  /*z-index: -1;
   position: absolute;
  left: 0;
  right: 0; */
  max-width: 100%;
`;

const StyledImage = styled(Image)`
  img {
    object-fit: contain;
    width: auto;
    max-width: 100%;
    height: auto;
    max-height: 100%;
  }
`;

interface SellerImagesSectionProps {
  coverImage?: string;
  profileImage?: string;
  address: string;
}

const SellerImagesSection: React.FC<SellerImagesSectionProps> = ({
  coverImage,
  profileImage,
  address: currentSellerAddress
}) => {
  const { isLteXS } = useBreakpoints();
  const parent = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLImageElement>(null);
  console.log("parent", parent);
  return (
    <ProfileSectionWrapper>
      <div
        id="parent"
        style={{ border: "1px solid red", height: "500px" }}
        ref={parent}
      >
        {/* <Draggable offsetParent={ref.current ?? undefined}> */}
        <StyledBannerImage
          ref={ref}
          src={coverImage || whiteImg}
          data-cover-img
          style={{ border: `1px solid ${colors.lightGrey}` }}
        />
        <Moveable
          draggable={true}
          target={ref.current}
          // dragContainer={parent.current}
          // container={parent.current}
          // rootContainer={parent.current}
          origin={true}
          onDrag={({
            target,
            beforeDelta,
            beforeDist,
            left,
            top,
            right,
            bottom,
            delta,
            dist,
            transform,
            clientX,
            clientY
          }) => {
            // console.log("onDrag left, top", left, top);
            // target!.style.left = `${left}px`;
            // target!.style.top = `${top}px`;
            // console.log("onDrag translate", dist, "transform", transform);
            // target!.style.transform = transform;
            // const translateX =
            console.log("onDrag", {
              beforeDelta,
              beforeDist,
              left,
              top,
              right,
              bottom,
              delta,
              dist,
              transform,
              clientX,
              clientY
            });
            target!.style.transform = transform;
          }}
          onDragEnd={({ target, isDrag, clientX, clientY }) => {
            console.log("onDragEnd", target, isDrag);
          }}
        ></Moveable>
        {/* </Draggable> */}
      </div>
      <BannerImageLayer>
        <AvatarContainer>
          {profileImage ? (
            <StyledImage
              src={profileImage}
              style={{
                width: "160px !important",
                height: "160px !important",
                paddingTop: "0",
                borderRadius: "50%",
                backgroundColor: "var(--primaryBgColor)"
              }}
            />
          ) : (
            <Avatar address={currentSellerAddress} size={!isLteXS ? 160 : 80} />
          )}
        </AvatarContainer>
      </BannerImageLayer>
    </ProfileSectionWrapper>
  );
};

export default SellerImagesSection;
