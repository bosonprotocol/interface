import * as Sentry from "@sentry/browser";
import { Form, Formik } from "formik";
import { BosonRoutes } from "lib/routing/routes";
import { useAccount } from "lib/utils/hooks/ethers/connection";
import { getViewModeUrl, ViewMode } from "lib/viewMode";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import * as Yup from "yup";

import ConnectButton from "../../components/header/ConnectButton";
import Layout from "../../components/layout/Layout";
import { useRemoveLandingQueryParams } from "../../components/modal/components/createProduct/const";
import { useModal } from "../../components/modal/useModal";
import { getSellerCenterPath } from "../../components/seller/paths";
import Grid from "../../components/ui/Grid";
import Loading from "../../components/ui/Loading";
import Typography from "../../components/ui/Typography";
import {
  SellerLandingPageParameters,
  UrlParameters
} from "../../lib/routing/parameters";
import { useCSSVariable } from "../../lib/utils/hooks/useCSSVariable";
import { useCurrentSellers } from "../../lib/utils/hooks/useCurrentSellers";
import { useIpfsStorage } from "../../lib/utils/hooks/useIpfsStorage";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { useSellerCurationListFn } from "../../lib/utils/hooks/useSellers";
import { getIpfsGatewayUrl } from "../../lib/utils/ipfs";
import { CongratulationsType } from "../create-product/congratulations/Congratulations";
import { CongratulationsPage } from "../create-product/congratulations/CongratulationsPage";
import NotFound from "../not-found/NotFound";
import CustomStoreFormContent, {
  formValuesWithOneLogoUrl
} from "./CustomStoreFormContent";
import { initialValues, validationSchema } from "./store-fields";
import { StoreFormFields } from "./store-fields-types";

const Root = styled(Layout)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto 64px auto;
`;

export default function CustomStore() {
  const { showModal, modalTypes } = useModal();
  const { account: address } = useAccount();
  const [searchParams] = useSearchParams();
  const navigate = useKeepQueryParamsNavigate();
  const removeLandingQueryParams = useRemoveLandingQueryParams();
  const [showCongratulationsPage, setShowCongratulationsPage] =
    useState<boolean>(false);
  const [hasSubmitError, setHasSubmitError] = useState<boolean>(false);
  const primaryColor = useCSSVariable("--primary");
  const storage = useIpfsStorage();
  const { sellers, isLoading } = useCurrentSellers();
  const seller = sellers?.[0];
  const sellerId = seller?.id;
  const checkIfSellerIsInCurationList = useSellerCurationListFn();
  const isSellerCurated = !!seller && checkIfSellerIsInCurationList(seller.id);

  if (!address) {
    return (
      <Grid justifyContent="flex-start" alignItems="center" gap="1rem">
        <ConnectButton /> Please connect your wallet
      </Grid>
    );
  }
  if (isLoading) {
    return <Loading />;
  }

  if (!seller) {
    return (
      <div data-testid="notFound">
        No seller account found for the current wallet.
      </div>
    );
  }

  if (!isSellerCurated) {
    return <NotFound />;
  }

  if (showCongratulationsPage) {
    return (
      <CongratulationsPage
        sellerId={sellerId}
        type={CongratulationsType.CustomStore}
        onClose={() => {
          removeLandingQueryParams();
          navigate({
            pathname: getSellerCenterPath("Sales Channels")
          });
        }}
      />
    );
  }
  const customStoreUrl = searchParams.get(UrlParameters.customStoreUrl) ?? "";
  return (
    <Root>
      <Typography
        tag="h2"
        fontWeight="600"
        $fontSize="2rem"
        lineHeight="2.4rem"
      >
        Create Custom Store
      </Typography>
      <Formik<Yup.InferType<typeof validationSchema>>
        initialValues={{ ...initialValues, customStoreUrl }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          setHasSubmitError(false);
          try {
            const dappOrigin = getViewModeUrl(ViewMode.DAPP, BosonRoutes.Root);
            const queryParams = new URLSearchParams(
              formValuesWithOneLogoUrl(values as unknown as StoreFormFields)
            ).toString();
            const html = `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${values.storeName || ""}</title>
          ${values.logoUrl ? `<link rel="icon" href="${values.logoUrl}">` : ""}
      </head>
      <body>
            <style>
              html, body {
                margin: 0;
                padding: 0;
                height: 100vh;
                background-color:${values.primaryBgColor || primaryColor};
              }
              iframe {
                border: none;
              }
            </style>
            <iframe
              src="${dappOrigin}?${queryParams}"
              width="100%"
              height="100%"/>
      </body>
      </html>`;

            const cid = await storage.add(html);
            const hasSteps = searchParams.has(
              SellerLandingPageParameters.slsteps
            );
            const ipfsUrl = getIpfsGatewayUrl(cid);
            showModal(modalTypes.CUSTOM_STORE, {
              title: hasSteps ? "Next Steps" : "Congratulations!",
              text: hasSteps
                ? "Your storefront URL and further options are below:"
                : "Your storefront has been successfully created. The URL along with further options are included below:",
              buttonText: hasSteps ? "Next" : "Done",
              ipfsUrl,
              htmlString: html,
              sellerId,
              onClose: (show: boolean) => {
                setShowCongratulationsPage(!!show);
              },
              withOwnProducts: values.withOwnProducts?.value
            });
          } catch (error) {
            console.error(error);
            Sentry.captureException(error);
            setHasSubmitError(true);
          }
        }}
      >
        {() => {
          return (
            <Form>
              <CustomStoreFormContent hasSubmitError={hasSubmitError} />
            </Form>
          );
        }}
      </Formik>
    </Root>
  );
}
