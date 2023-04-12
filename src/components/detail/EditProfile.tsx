import React from "react";

import { breakpointNumbers } from "../../lib/styles/breakpoint";
import { useModal } from "../modal/useModal";
import Button from "../ui/Button";

export const EditProfile: React.FC = () => {
  const { showModal } = useModal();

  const openEditModal = () => {
    showModal(
      "EDIT_PROFILE",
      {
        headerComponent: null,
        title: "Edit Profile",
        closable: true
      },
      "auto",
      undefined,
      {
        xs: `${breakpointNumbers.m + 1}px`
      }
    );
  };
  return (
    <Button onClick={() => openEditModal()} theme="secondary">
      Edit profile
    </Button>
  );
};
