import { Button } from "@bosonprotocol/react-kit";
import { LoadingMessage } from "components/loading/LoadingMessage";
import { Spinner } from "components/loading/Spinner";
import { useModal } from "components/modal/useModal";
import { defaultFontFamily } from "lib/styles/fonts";
import { useAccount } from "lib/utils/hooks/connection/connection";
import { refetchSellerPolling } from "lib/utils/seller";
import { House, WarningCircle } from "phosphor-react";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import {
  WithSellerData,
  WithSellerDataProps
} from "../../components/seller/common/WithSellerData";
import SellerAside from "../../components/seller/SellerAside";
import SellerInside, {
  SellerInsideProps
} from "../../components/seller/SellerInside";
import { Grid } from "../../components/ui/Grid";
import { Typography } from "../../components/ui/Typography";
import { CONFIG } from "../../lib/config";
import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { useCurrentSellers } from "../../lib/utils/hooks/useCurrentSellers";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import NotFound from "../not-found/NotFound";

const Wrapper = styled.div`
  text-align: center;
`;
const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: min-content 1fr;
  gap: 0;
  min-height: calc(100vh - 30.25rem);
  font-family: ${defaultFontFamily};
  color: ${colors.black};
`;

function SellerCenter(props: SellerInsideProps & WithSellerDataProps) {
  if (!props.isSellerCurated) {
    return <NotFound />;
  }
  return (
    <GridWrapper>
      <SellerAside {...props} />
      <SellerInside {...props} />
    </GridWrapper>
  );
}
const SellerCenterWithData = WithSellerData(SellerCenter);

function SellerCenterWrapper() {
  const { showModal, store, hideModal } = useModal();
  const navigate = useKeepQueryParamsNavigate();
  const {
    isLoading,
    sellerIds: currentSellerIds,
    isSuccess,
    refetch
  } = useCurrentSellers();
  const sellerIds = useMemo(
    () =>
      CONFIG.mockSellerId
        ? [CONFIG.mockSellerId, ...currentSellerIds]
        : currentSellerIds,
    [currentSellerIds]
  );
  const [selectedSellerId, setSelectedSellerId] = useState<string>(
    sellerIds?.length === 1 ? sellerIds[0] : ""
  );
  const [isSellerLoading, setIsSellerLoading] = useState<boolean>(false);

  const { account: address } = useAccount();

  useEffect(() => {
    if (isSuccess) {
      setSelectedSellerId(sellerIds.length === 1 ? sellerIds[0] : "");
    }
  }, [isSuccess, sellerIds]);
  useEffect(() => {
    const hasSeller = address && !!sellerIds.length;
    const didDisconnect = !address;
    if (
      (hasSeller || didDisconnect) &&
      store.modalType === "ACCOUNT_CREATION"
    ) {
      hideModal();
      setIsSellerLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, sellerIds.length, store.modalType]);
  if (isLoading) {
    return <LoadingMessage />;
  }
  if (!sellerIds.length || !address) {
    return (
      <Wrapper>
        <Grid
          justifyContent="center"
          padding="5rem"
          gap="2rem"
          flexDirection="column"
        >
          <WarningCircle size={112} color={colors.red} weight="thin" />
          <Typography tag="h5">
            {address
              ? isSellerLoading
                ? "You successfully created a seller account but it has not been indexed yet, please wait a moment or refresh this page"
                : "Please create a seller account first"
              : "Please connect your wallet"}
          </Typography>
          {address && isSellerLoading && <Spinner />}
          <Grid justifyContent="center" gap="1rem">
            {address && !isSellerLoading && (
              <Button
                variant="primaryFill"
                onClick={() => {
                  showModal("ACCOUNT_CREATION", {
                    onCloseCreateProfile: async () => {
                      setIsSellerLoading(true);
                      try {
                        await refetchSellerPolling({
                          refetch,
                          attempts: 150,
                          msBetweenAttemps: 1000
                        });
                      } finally {
                        setIsSellerLoading(false);
                      }
                    }
                  });
                }}
              >
                Create seller account
              </Button>
            )}
            <Button
              variant="accentInverted"
              onClick={() => {
                navigate({
                  pathname: BosonRoutes.Root
                });
              }}
            >
              Back home
              <House size={16} />
            </Button>
          </Grid>
        </Grid>
      </Wrapper>
    );
  }

  if (sellerIds.length > 1 && !selectedSellerId) {
    <select
      onChange={(e) => {
        setSelectedSellerId(e.target.value);
      }}
    >
      {sellerIds.map((id: string) => (
        <option value={id} key="id">
          {id}
        </option>
      ))}
    </select>;
  }

  if (!selectedSellerId) {
    return <NotFound />;
  }

  return <SellerCenterWithData sellerId={selectedSellerId} />;
}

export default SellerCenterWrapper;
