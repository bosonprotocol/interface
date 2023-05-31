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
import { useLayoutContext } from "../../../components/layout/Context";
import { ModalHeaderTitle } from "../../../components/modal/header/ModalHeaderTitle";
import useOffersBacked from "../../../components/seller/common/useOffersBacked";
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
  margin: 3.8125rem 7.875rem;
  ${breakpoint.xs} {
    margin: 4.8125rem 8.875rem;
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

type CreateProductCongratulationsProps = {
  offersIds: string[];
  reset: () => void;
  sellerId: string;
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

export const CreateProductCongratulations: React.FC<
  CreateProductCongratulationsProps
> = ({ offersIds, reset, sellerId }) => {
  const navigate = useKeepQueryParamsNavigate();
  const { setFullWidth } = useLayoutContext();
  const displayDepositWarning = useDepositWarning(sellerId);
  const navigateTo = (...args: Parameters<typeof navigate>) => {
    setFullWidth(false);
    reset();
    navigate(...args);
  };
  const goToCreateNewProduct = () => {
    navigateTo({
      pathname: SellerCenterRoutes.CreateProduct
    });
  };
  return (
    <Container>
      <ModalHeaderTitle
        handleOnClose={() => goToCreateNewProduct()}
        title="Congratulations!"
        closable
      />
      <Grid flexDirection="column" padding="2rem">
        <Grid flexDirection="column" margin="2.5rem 4.625rem">
          <CheckCircle
            size={105}
            color={colors.green}
            style={{ marginBottom: "2rem" }}
          />
          <Typography fontWeight="600" $fontSize="1.5rem" textAlign="center">
            Your product is now created and deployed in the dApp!
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
            xl: 3
          }}
        >
          <CardCTA
            icon={<Megaphone color={colors.secondary} />}
            title="Add Sales Channels"
            text="You can now add more Sales Channels to promote and sell your product at different places."
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
            title="Create new product"
            text="Save time when creating multiple products. You can add new channels and pay your deposits later."
            cta={
              <Button
                theme="secondary"
                onClick={() => {
                  goToCreateNewProduct();
                }}
              >
                Create new product <Plus color={colors.secondary} size={20} />
              </Button>
            }
          />
          {displayDepositWarning && (
            <CardCTA
              icon={<Warning color={colors.green} />}
              title="Funds needed to go live"
              text="You must provide funds to cover your seller deposit. For multiple products you can do all at once."
              cta={
                <Button
                  theme="bosonPrimary"
                  onClick={() => {
                    navigateTo({
                      pathname: generatePath(SellerCenterRoutes.SellerCenter, {
                        [UrlParameters.sellerPage]:
                          SellerCenterSubRoutes.Finances
                      })
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
