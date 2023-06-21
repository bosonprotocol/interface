import {
  CheckCircle,
  DownloadSimple,
  Megaphone,
  Plus,
  Storefront,
  Warning
} from "phosphor-react";
import React, { useMemo } from "react";
import { generatePath } from "react-router-dom";
import styled from "styled-components";

import { useConvertionRate } from "../../../components/convertion-rate/useConvertionRate";
import { ModalHeaderTitle } from "../../../components/modal/header/ModalHeaderTitle";
import useOffersBacked from "../../../components/seller/common/useOffersBacked";
import { getSellerCenterPath } from "../../../components/seller/paths";
import Button from "../../../components/ui/Button";
import Grid from "../../../components/ui/Grid";
import GridContainer from "../../../components/ui/GridContainer";
import Typography from "../../../components/ui/Typography";
import { UrlParameters } from "../../../lib/routing/parameters";
import {
  SellerCenterRoutes,
  SellerCenterSubRoutes
} from "../../../lib/routing/routes";
import { breakpoint } from "../../../lib/styles/breakpoint";
import { colors } from "../../../lib/styles/colors";
import { useOffers } from "../../../lib/utils/hooks/offers";
import useProducts from "../../../lib/utils/hooks/product/useProducts";
import { useExchanges } from "../../../lib/utils/hooks/useExchanges";
import { useExchangeTokens } from "../../../lib/utils/hooks/useExchangeTokens";
import { useKeepQueryParamsNavigate } from "../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { useSellerDeposit } from "../../../lib/utils/hooks/useSellerDeposit";
import { useSellerRoles } from "../../../lib/utils/hooks/useSellerRoles";
import { useSellerCurationListFn } from "../../../lib/utils/hooks/useSellers";
import useFunds from "../../account/funds/useFunds";
import { CardCTA } from "./CardCTA";

const Container = styled.div`
  background: ${colors.white};
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  ${breakpoint.xs} {
    margin: 4.8125rem 4.875rem;
  }
  ${breakpoint.s} {
    margin: 5.8125rem 9.875rem;
  }
  ${breakpoint.m} {
    margin: 6.8125rem 10.875rem;
  }
  ${breakpoint.l} {
    margin: 7.8125rem 11.875rem;
  }
  ${breakpoint.xl} {
    margin: 8.8125rem 12.875rem;
  }
`;

export type CongratulationsProps = {
  reset?: () => void;
  sellerId: string;
  type: CongratulationsType;
  onClose?: () => void;
  closable?: boolean;
};

const useDepositWarning = (sellerId: string) => {
  const {
    store: { tokens }
  } = useConvertionRate();

  const products = useProducts(
    {
      productsFilter: {
        sellerId
      }
    },
    {
      enabled: !!sellerId,
      enableCurationList: false,
      refetchOnMount: true
    }
  );

  const offers = useOffers({
    sellerId,
    first: 1000,
    orderBy: "createdAt",
    orderDirection: "desc"
  });
  const exchanges = useExchanges({
    sellerId,
    disputed: null
  });
  const exchangesTokens = useExchangeTokens(
    {
      sellerId
    },
    {
      enabled: !!sellerId
    }
  );
  const sellerDeposit = useSellerDeposit(
    {
      sellerId
    },
    { enabled: !!sellerId }
  );
  const funds = useFunds(sellerId, tokens);
  const sellerRoles = useSellerRoles(sellerId);
  const checkIfSellerIsInCurationList = useSellerCurationListFn();
  const isSellerCurated = checkIfSellerIsInCurationList(sellerId);
  const newProps = useMemo(
    () => ({
      sellerId,
      offers,
      products,
      exchanges,
      exchangesTokens,
      sellerDeposit,
      funds,
      sellerRoles,
      isSellerCurated
    }),
    [
      sellerId,
      offers,
      products,
      exchanges,
      exchangesTokens,
      sellerDeposit,
      funds,
      sellerRoles,
      isSellerCurated
    ]
  );
  const offersBacked = useOffersBacked({
    ...newProps
  });
  return offersBacked.displayWarning;
};

export enum CongratulationsType {
  Boulevard = "Boulevard",
  OwnLand = "OwnLand",
  CustomStore = "CustomStore",
  NewProduct = "NewProduct"
}

const messageMap = {
  [CongratulationsType.Boulevard]:
    "Your request to sell on Boson Boulevard has been sent!",
  [CongratulationsType.OwnLand]:
    "You have reviewed the DCL Metaverse Commerce toolkit!",
  [CongratulationsType.CustomStore]:
    "Your storefront is now successfully created!",
  [CongratulationsType.NewProduct]: "Your product is now successfully created!"
} as const;

export const Congratulations: React.FC<CongratulationsProps> = ({
  sellerId,
  type,
  onClose,
  reset,
  closable = true
}) => {
  const navigate = useKeepQueryParamsNavigate();
  // const { setFullWidth } = useLayoutContext();
  const displayDepositWarning = useDepositWarning(sellerId);
  const beforeNavigateTo = () => {
    // setFullWidth(false);
    reset?.();
  };
  const navigateTo = (to: Parameters<typeof navigate>[0]) => {
    beforeNavigateTo();
    navigate(to, {
      removeSellerLandingQueryParams: true
    });
  };
  const handleOnClose = () => {
    if (onClose) {
      beforeNavigateTo();
      onClose();
    } else {
      navigateTo({
        pathname: getSellerCenterPath("Dashboard")
      });
    }
  };
  const goToCreateNewProduct = () => {
    navigateTo({
      pathname: SellerCenterRoutes.CreateProduct
    });
  };
  const message = messageMap[type];
  return (
    <Container>
      <ModalHeaderTitle
        handleOnClose={() => handleOnClose()}
        title="Congratulations!"
        closable={closable}
      />
      <Grid flexDirection="column" padding="2rem">
        <Grid flexDirection="column" margin="2.5rem 4.625rem">
          <CheckCircle
            size={105}
            color={colors.green}
            style={{ marginBottom: "2rem" }}
          />
          <Typography fontWeight="600" $fontSize="1.5rem" textAlign="center">
            {message}
          </Typography>
        </Grid>
        <GridContainer
          columnGap="2rem"
          rowGap="2rem"
          itemsPerRow={{
            xs: 1,
            s: 1,
            m: 2,
            l: 2,
            xl: displayDepositWarning ? 3 : 2
          }}
        >
          <CardCTA
            icon={<Megaphone color={colors.secondary} />}
            title="Add a sales channel"
            text="Adding more sales channels expands the reach of your products by selling them  across different destinations."
            cta={
              <Button
                theme="secondary"
                onClick={() => {
                  navigateTo({
                    pathname: generatePath(SellerCenterRoutes.SellerCenter, {
                      [UrlParameters.sellerPage]:
                        SellerCenterSubRoutes["Sales Channels"]
                    })
                  });
                }}
              >
                Add a Sales Channel <Plus color={colors.secondary} size={20} />
              </Button>
            }
          />
          <CardCTA
            icon={<Storefront color={colors.secondary} />}
            title="Create new products"
            text="Create new products and benefits to grow revenues and engage new audiences."
            cta={
              <Button
                theme="secondary"
                onClick={() => {
                  goToCreateNewProduct();
                }}
              >
                Create new products <Plus color={colors.secondary} size={20} />
              </Button>
            }
          />
          {displayDepositWarning && (
            <CardCTA
              icon={<Warning color={colors.green} />}
              title="Funds needed to go live"
              text="Provide funds  in the seller pool for your offer to go live. Funds in the pool will apply to all your products."
              cta={
                <Button
                  theme="bosonPrimary"
                  onClick={() => {
                    navigateTo({
                      pathname: getSellerCenterPath("Finances")
                    });
                  }}
                >
                  Deposit funds{" "}
                  <DownloadSimple color={colors.black} size={20} />
                </Button>
              }
              theme="dark"
            />
          )}
        </GridContainer>
      </Grid>
    </Container>
  );
};
