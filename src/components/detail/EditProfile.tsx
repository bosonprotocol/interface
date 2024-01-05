import React, { ReactNode } from "react";

import { breakpointNumbers } from "../../lib/styles/breakpoint";
import { useModal } from "../modal/useModal";
import Button from "../ui/Button";

export const EditProfile: React.FC<{
  onClose?: () => void | Promise<void>;
  children?: ReactNode;
}> = ({ onClose, children }) => {
  const { showModal } = useModal();

  const openEditModal = () => {
    showModal(
      "EDIT_PROFILE",
      {
        closable: true,
        onClose: async () => {
          await onClose?.();
        }
      },
      "auto",
      undefined,
      {
        xs: `${breakpointNumbers.m + 1}px`
      }
    );
  };
  if (children) {
    return <div onClick={() => openEditModal()}>{children}</div>;
  }
  return (
    <Button onClick={() => openEditModal()} themeVal="secondary">
      Edit profile
    </Button>
  );
};
