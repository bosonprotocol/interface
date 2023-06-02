import React, { useCallback, useEffect, useState } from "react";

import { breakpointNumbers } from "../../../lib/styles/breakpoint";
import { useKeepQueryParamsNavigate } from "../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { useModal } from "../../modal/useModal";
import { WithSellerDataProps } from "../common/WithSellerData";
import { getSellerCenterPath } from "../paths";
import { SellerInsideProps } from "../SellerInside";

export const ProfileDetails: React.FC<
  SellerInsideProps & WithSellerDataProps
> = ({ sellerId }) => {
  const navigate = useKeepQueryParamsNavigate();
  const redirect = useCallback(() => {
    navigate({
      pathname: getSellerCenterPath("Dashboard")
    });
  }, [navigate]);
  const { showModal, store } = useModal();
  const [wasModalOpen, setWasModalOpen] = useState(false);
  useEffect(() => {
    setWasModalOpen(true);
    showModal(
      "PROFILE_DETAILS",
      {
        sellerId,
        title: "Profile Details",
        onClose: () => {
          redirect();
        }
      },
      "auto",
      undefined,
      {
        xs: `${breakpointNumbers.m + 1}px`
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redirect]);
  useEffect(() => {
    if (!store.modalType && wasModalOpen) {
      redirect();
    }
  }, [store.modalType, redirect, wasModalOpen]);
  return <></>;
};
