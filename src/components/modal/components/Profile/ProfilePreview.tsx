import { Gear } from "phosphor-react";
import React, { useState } from "react";
import styled from "styled-components";

import { colors } from "../../../../lib/styles/colors";
import SellerImagesSection from "../../../../pages/profile/seller/SellerImagesSection";
import { FormField } from "../../../form";
import { FileProps } from "../../../form/Upload/types";
import { LayoutRoot } from "../../../layout/Layout";
import Modal from "../../Modal";
import { useModal } from "../../useModal";
const SellerImagesSectionContainer = styled.div`
  width: 100%;
  margin-bottom: 4.5rem;
  display: flex;
`;

type ProfilePreviewProps = {
  metadataCoverImage?:
    | (FileProps & {
        fit?: string | undefined;
        position?: string | undefined;
      })
    | undefined;
  profileImage?: string;
  address: string;
  draggable?: boolean;
  defaultPosition?: { x: number; y: number };
  defaultIsObjectFitContain?: boolean;
};

export const ProfilePreview: React.FC<ProfilePreviewProps> = ({
  address,
  profileImage,
  metadataCoverImage,
  defaultIsObjectFitContain,
  defaultPosition,
  draggable
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const { updateProps, store } = useModal();
  const hideModal = () => {
    updateProps({
      ...store,
      modalType: store.modalType,
      modalProps: {
        ...store.modalProps,
        hidden: false
      }
    });
    setShowModal(false);
  };
  return (
    <>
      <Gear
        size={24}
        color={colors.secondary}
        weight="light"
        style={{ cursor: "pointer" }}
        onClick={() => {
          updateProps({
            ...store,
            modalType: store.modalType,
            modalProps: {
              ...store.modalProps,
              hidden: true
            }
          });
          setShowModal(true);
        }}
      />
      {showModal && (
        <Modal
          modalType="PROFILE_PREVIEW"
          hideModal={() => hideModal()}
          size="fullscreen"
          maxWidths={undefined}
          theme="light"
        >
          <LayoutRoot style={{ padding: 0 }}>
            <FormField
              title="Preview"
              subTitle="Here you can reposition the banner image within the rectangle"
            >
              <SellerImagesSectionContainer>
                <SellerImagesSection
                  address={address}
                  profileImage={profileImage}
                  metadataCoverImage={metadataCoverImage}
                  defaultIsObjectFitContain={defaultIsObjectFitContain}
                  defaultPosition={defaultPosition}
                  draggable={draggable}
                />
              </SellerImagesSectionContainer>
            </FormField>
          </LayoutRoot>
        </Modal>
      )}
    </>
  );
};
