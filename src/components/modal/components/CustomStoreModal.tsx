import * as Tooltip from "@radix-ui/react-tooltip";
import * as Sentry from "@sentry/browser";
import { Form, Formik } from "formik";
import { Copy, CopySimple, Info } from "phosphor-react";
import * as pretty from "pretty";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import * as Yup from "yup";

import { SellerLandingPageParameters } from "../../../lib/routing/parameters";
import { colors } from "../../../lib/styles/colors";
import copyToClipboard from "../../../lib/utils/copyToClipboard";
import useUpdateSellerMetadata from "../../../lib/utils/hooks/seller/useUpdateSellerMetadata";
import { useSellers } from "../../../lib/utils/hooks/useSellers";
import { StoreFields } from "../../../pages/custom-store/store-fields-types";
import Collapse from "../../collapse/Collapse";
import { Notify } from "../../detail/Detail.style";
import SimpleError from "../../error/SimpleError";
import { Input } from "../../form";
import { CopyButton } from "../../form/Field.styles";
import { Spinner } from "../../loading/Spinner";
import SuccessToast from "../../toasts/common/SuccessToast";
import BosonButton from "../../ui/BosonButton";
import Button from "../../ui/Button";
import Grid from "../../ui/Grid";
import Typography from "../../ui/Typography";
import { useModal } from "../useModal";
import {
  getNextButtonText,
  getNextStepFromQueryParams,
  getNextTo,
  getSlTitle,
  getVariableStepsFromQueryParams,
  QueryParamStep,
  useRemoveLandingQueryParams,
  VariableStep
} from "./createProduct/const";
import { Channels } from "./SalesChannelsModal/form";

const CopyIcon = styled(CopySimple)`
  cursor: pointer;
  color: ${colors.secondary};
`;

const Heading = styled(Typography).attrs({
  tag: "p",
  $fontSize: "1rem",
  fontWeight: "600",
  lineHeight: "1.5rem"
})``;

const marginBetweenContainers = `1.875rem`;
const CollapsibleContainer = styled.div`
  margin-top: ${marginBetweenContainers};
  background-color: ${colors.lightGrey};
  padding: 1.5rem;
`;

const StyledTooltip = styled.div`
  background: ${colors.white};
  padding: 1rem;
  border: 1px solid ${colors.darkGrey};
  max-width: 20rem;
`;

const StyledPre = styled.pre`
  word-break: break-word;
  white-space: pre-wrap;
  background-color: #454545;
  color: whitesmoke;
  padding: 0.5rem;
  position: relative;
`;

const StyledCopyButton = styled(CopyButton)`
  position: absolute;
  bottom: 0;
  right: 0.4375rem;
`;

interface Props {
  text: string;
  ipfsUrl: string;
  htmlString: string;
  buttonText: string;
  sellerId: string;
  withOwnProducts:
    | NonNullable<StoreFields["withOwnProducts"]>["value"]
    | undefined;
}
export function CustomStoreModal({
  ipfsUrl = "",
  htmlString = "",
  text,
  buttonText,
  sellerId,
  withOwnProducts
}: Props) {
  const [hasError, setError] = useState<boolean>(false);
  const { showModal, hideModal } = useModal();
  const removeLandingQueryParams = useRemoveLandingQueryParams();
  const [searchParams] = useSearchParams();
  const [show, setShow] = useState<boolean>(false);
  const { mutateAsync: updateSellerMetadata } = useUpdateSellerMetadata();
  const { refetch: refetchSeller } = useSellers(
    { id: sellerId },
    { enabled: false }
  );
  const iframeString = htmlString.substring(
    htmlString.indexOf("<iframe"),
    htmlString.indexOf("</body")
  );
  return (
    <>
      <Typography
        color={colors.darkGrey}
        fontWeight="600"
        $fontSize="1.25rem"
        lineHeight="1.875rem"
      >
        {text}
      </Typography>
      <CollapsibleContainer>
        <Grid justifyContent="flex-start" gap="0.5rem">
          <Heading>Custom Store URL </Heading>
          <Tooltip.Provider delayDuration={0}>
            <Tooltip.Root>
              <Tooltip.TooltipTrigger asChild>
                <Info size="20" />
              </Tooltip.TooltipTrigger>
              <Tooltip.Content>
                <StyledTooltip>
                  This shows the IPFS CID for your custom storefront website
                  file. The store can be directly accessed using the URL.
                </StyledTooltip>
              </Tooltip.Content>
            </Tooltip.Root>
          </Tooltip.Provider>
        </Grid>

        <Grid alignItems="center" justifyContent="flex-start" gap="0.5rem">
          <a href={ipfsUrl} target="_blank">
            {ipfsUrl}
          </a>
          <CopyIcon
            size={20}
            onClick={async () => {
              try {
                await copyToClipboard(ipfsUrl);
                setShow(true);
                setTimeout(() => {
                  setShow(false);
                }, 3000);
              } catch (error) {
                console.error(error);
                Sentry.captureException(error);
              }
            }}
          />
          <Notify $show={show}>
            <Typography tag="p">URL has been copied to clipboard</Typography>
          </Notify>
        </Grid>
      </CollapsibleContainer>
      {withOwnProducts === "mine" && (
        <CollapsibleContainer>
          <Grid justifyContent="flex-start" gap="0.5rem">
            <Heading>Save Custom Store URL</Heading>
          </Grid>

          <Formik
            initialValues={{
              name: ""
            }}
            onSubmit={async ({ name }) => {
              try {
                setError(false);
                const { data: sellers } = await refetchSeller();
                const seller = sellers?.[0];
                if (!seller) {
                  throw new Error("Seller could not be fetched");
                }
                if (!seller.metadata) {
                  throw new Error("Seller.metadata was not fetched");
                }

                // each storefront is a sales channel
                const storeFrontSalesChannel = {
                  tag: Channels["Custom storefront"],
                  name,
                  deployments: [
                    {
                      link: ipfsUrl,
                      lastUpdated: Math.floor(Date.now() / 1000).toString()
                    }
                  ]
                };
                if (seller.metadata?.salesChannels?.length) {
                  await updateSellerMetadata({
                    values: {
                      salesChannels: [
                        ...(seller.metadata?.salesChannels ?? []).map((sl) => {
                          return {
                            ...sl,
                            tag: sl?.tag || "",
                            name: sl?.name || "",
                            link: sl?.link || undefined,
                            settingsEditor: sl?.settingsEditor || undefined,
                            settingsUri: sl?.settingsUri || undefined,
                            deployments: [
                              ...(sl?.deployments?.map((d) => ({
                                ...d,
                                status: d.status || undefined,
                                link: d.link || undefined,
                                lastUpdated: d.lastUpdated || undefined,
                                product: d.product || undefined
                              })) ?? [])
                            ]
                          };
                        }),
                        storeFrontSalesChannel
                      ]
                    }
                  });
                } else {
                  await updateSellerMetadata({
                    values: {
                      salesChannels: [storeFrontSalesChannel]
                    }
                  });
                }

                toast((t) => (
                  <SuccessToast t={t}>Custom store has been saved</SuccessToast>
                ));
              } catch (error) {
                console.error(error);
                setError(true);
                Sentry.captureException(error);
              }
            }}
            validationSchema={Yup.object({
              name: Yup.string().required("Name is a required field")
            })}
          >
            {({ isSubmitting }) => {
              return (
                <Form>
                  <p>
                    Provide a name below to identify the storefront and to save
                    the link to your Seller Hub.
                  </p>
                  <Grid
                    alignItems="flex-start"
                    justifyContent="flex-start"
                    gap="0.5rem"
                  >
                    <Grid
                      flexDirection="column"
                      justifyContent="flex-start"
                      alignItems="flex-start"
                    >
                      <Input
                        name="name"
                        style={{ border: "1px solid grey" }}
                        placeholder="Name to identify store"
                      />
                    </Grid>
                    <Button
                      theme="secondary"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Save"}
                      {isSubmitting && <Spinner />}
                    </Button>
                  </Grid>
                  {hasError && <SimpleError />}
                </Form>
              );
            }}
          </Formik>
        </CollapsibleContainer>
      )}
      <CollapsibleContainer>
        <Collapse title={<Heading>Link to ENS</Heading>}>
          <p>
            To improve your users' experience, you can provide them with a
            branded link by hooking up the above redirect link to your ENS
            (sub)domain.
          </p>
          <div>
            <ol style={{ padding: "0 1rem" }}>
              <li>
                Navigate to{" "}
                <a href="https://app.ens.domains/" target="_blank">
                  https://app.ens.domains/
                </a>{" "}
                -{">"} My Account{" "}
              </li>
              <li>Select your ENS domain & click "Add/Edit Record" </li>
              <li>
                Set the "Content" value to "ipfs://
                {`CID`}"
                <ol type="a">
                  <li>
                    Where CID is the last part of the above Custom Store URL
                    (i.e.
                    {ipfsUrl
                      .toString()
                      .substring(
                        ipfsUrl.toString().indexOf("ipfs/") + 5,
                        ipfsUrl.toString().indexOf("ipfs/") + 9
                      )
                      .concat("...)")}
                  </li>
                </ol>
              </li>
              <li>
                Click "Confirm" and send the transaction using your wallet.
              </li>
              <li>
                You can then share this ENS domain with your users. (Add a
                ".link" suffix to the ENS domain. i.e.g. https://ens
                Domain.eth.link)
              </li>
            </ol>
          </div>
        </Collapse>
      </CollapsibleContainer>
      <CollapsibleContainer>
        <Collapse title={<Heading>Integrate iFrame into your website</Heading>}>
          <p>
            To improve your users' experience, your custom storefront can be
            integrated directly into your website using an iframe. The steps to
            do this are described below:
          </p>
          <div>
            <ol style={{ padding: "0 1rem" }}>
              <li>Go to your website code or to your web builder interface</li>
              <li>
                Create a new page (e.g. your-website.com/store) and add the
                following HTML code within the page body (i.e. in the HTML body
                tag)
                <ol type="a" style={{ padding: 0 }}>
                  <StyledPre>
                    <code>{pretty(iframeString)}</code>
                    <StyledCopyButton
                      onClick={() => {
                        try {
                          navigator.clipboard.writeText(iframeString);
                          toast(() => "Text has been copied to clipboard");
                        } catch (error) {
                          console.error(error);
                          Sentry.captureException(error);
                          return false;
                        }
                      }}
                    >
                      <Copy size={24} color={colors.orange} weight="light" />
                    </StyledCopyButton>
                  </StyledPre>
                </ol>
              </li>
              <li>
                For example, this is what a simple HTML page would look like:
                <ol type="a" style={{ padding: 0 }}>
                  <StyledPre>
                    <code>{pretty(htmlString)}</code>
                  </StyledPre>
                </ol>
              </li>
            </ol>
          </div>
        </Collapse>
      </CollapsibleContainer>
      <Grid margin={`${marginBetweenContainers} 0 0 0`}>
        <BosonButton
          variant="primaryFill"
          type="button"
          onClick={() => {
            if (searchParams.has(SellerLandingPageParameters.slsteps)) {
              const nextStepResult = getNextStepFromQueryParams(
                searchParams,
                QueryParamStep.store
              );
              hideModal(!nextStepResult);
              if (nextStepResult) {
                const title = getSlTitle(searchParams);
                showModal("VARIABLE_STEPS_EXPLAINER", {
                  title,
                  doSetQueryParams: false,
                  order: getVariableStepsFromQueryParams(searchParams) as [
                    VariableStep,
                    VariableStep,
                    VariableStep
                  ],
                  text: "Your storefront is now successfully created!",
                  buttonText: getNextButtonText(nextStepResult.nextStep),
                  to: getNextTo(nextStepResult.nextStep),
                  firstActiveStep: nextStepResult.nextStepInNumber
                });
              } else {
                removeLandingQueryParams();
              }
            } else {
              hideModal(true);
            }
          }}
        >
          {buttonText || "Done"}
        </BosonButton>
      </Grid>
    </>
  );
}
