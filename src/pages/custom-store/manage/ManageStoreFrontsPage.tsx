import { subgraph } from "@bosonprotocol/react-kit";
import * as Sentry from "@sentry/browser";
import dayjs from "dayjs";
import { Copy, Gear, Trash } from "phosphor-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useAccount } from "wagmi";

import { CopyButton } from "../../../components/form/Field.styles";
import ConnectButton from "../../../components/header/ConnectButton";
import { Spinner } from "../../../components/loading/Spinner";
import { Channels } from "../../../components/modal/components/SalesChannelsModal/form";
import { useModal } from "../../../components/modal/useModal";
import SuccessToast from "../../../components/toasts/common/SuccessToast";
import Button from "../../../components/ui/Button";
import Grid from "../../../components/ui/Grid";
import Typography from "../../../components/ui/Typography";
import { UpdateIcon } from "../../../components/ui/UpdateIcon";
import { UrlParameters } from "../../../lib/routing/parameters";
import { BosonRoutes } from "../../../lib/routing/routes";
import { colors } from "../../../lib/styles/colors";
import useUpdateSellerMetadata from "../../../lib/utils/hooks/seller/useUpdateSellerMetadata";
import { useCurrentSellers } from "../../../lib/utils/hooks/useCurrentSellers";
import { wait } from "../../create-product/utils";

type DeleteButtonProps = {
  salesChannels: NonNullable<
    subgraph.SellerFieldsFragment["metadata"]
  >["salesChannels"];
  storefrontId: string;
  refetch: () => void;
  name: string;
  setError?: React.Dispatch<React.SetStateAction<boolean>>;
};
const DeleteButton = ({
  salesChannels,
  refetch,
  storefrontId,
  name,
  setError
}: DeleteButtonProps) => {
  const { hideModal } = useModal();
  const { mutateAsync: updateSellerMetadata } = useUpdateSellerMetadata();
  const [deleting, setDeleting] = useState<boolean>(false);
  return (
    <Button
      disabled={deleting}
      onClick={async () => {
        try {
          setError?.(false);
          setDeleting(true);
          const allSalesChannels = salesChannels || [];
          await updateSellerMetadata({
            values: {
              salesChannels: allSalesChannels
                .filter((sc) => sc.id !== storefrontId)
                .map((sl) => {
                  return {
                    ...sl,
                    tag: sl?.tag || "",
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
                })
            }
          });
          hideModal();
          toast((t) => (
            <SuccessToast t={t}>
              <div>
                Storefront <strong>{name}</strong> has been removed
              </div>
            </SuccessToast>
          ));
          await wait(3000);
          refetch();
        } catch (error) {
          setError?.(true);
          console.error(error);
          Sentry.captureException(error);
        } finally {
          setDeleting(false);
        }
      }}
    >
      {deleting ? "Deleting" : "Delete"}
      {deleting && <Spinner size={15} />}
    </Button>
  );
};

const StoreFrontItem = styled.li`
  list-style-type: none;
  background: ${colors.lightGrey};
  padding: 2rem;
  width: 100%;
`;

export const ManageStoreFrontsPage = () => {
  const { isConnected } = useAccount();
  const { showModal } = useModal();
  const { sellers, refetch } = useCurrentSellers();

  const salesChannels = sellers?.[0]?.metadata?.salesChannels;
  const storeFronts = salesChannels
    ?.filter((sl) => sl.tag === Channels["Custom storefront"])
    .sort((st1, st2) => {
      return (
        Number(st2.deployments?.[0]?.lastUpdated) -
        Number(st1.deployments?.[0]?.lastUpdated)
      );
    });
  if (!isConnected) {
    return (
      <Grid justifyContent="flex-start" alignItems="center" gap="1rem">
        <ConnectButton /> Please connect your wallet
      </Grid>
    );
  }
  return (
    <Grid flexDirection="column" alignItems="flex-start" gap="2rem">
      <Grid flexDirection="column" alignItems="flex-start" flex="0">
        <Typography fontWeight="600" $fontSize="2rem" marginTop="2rem">
          Create a new custom storefront
        </Typography>
        <p>
          You can create as many storefronts as you want and decide to save them
          or not to see them here later;
        </p>
        <Link to={{ pathname: BosonRoutes.CreateStorefront }}>
          <Button theme="secondary">Create one now</Button>
        </Link>
      </Grid>
      {storeFronts?.length ? (
        <Grid flexDirection="column" alignItems="flex-start">
          <Grid justifyContent="flex-start" gap="1rem">
            <Typography fontWeight="600" $fontSize="2rem">
              My storefronts
            </Typography>
            <UpdateIcon
              size={25}
              onClick={async () => {
                await refetch();
              }}
            />
          </Grid>
          <Grid tag="ul" gap="1rem" flexDirection="column" padding="1rem 0">
            {storeFronts?.map((sf) => {
              const name = sf.name || "Unnamed storefront";
              const preview: string = sf.deployments?.[0]?.link || "";
              const lastUpdated: number | undefined = sf.deployments?.[0]
                ?.lastUpdated
                ? Number(sf.deployments?.[0]?.lastUpdated) * 1000
                : undefined;
              return (
                <StoreFrontItem key={`${sf.id}-${sf.name}-${preview}`}>
                  <Grid
                    gap="1rem"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <Grid flexDirection="column" alignItems="flex-start">
                      <Typography $fontSize="1.5rem">{name}</Typography>

                      <Typography $fontSize="1rem" padding="0 0 1rem 0">
                        Creation date:{" "}
                        {lastUpdated ? dayjs(lastUpdated).format("LLL") : "-"}
                      </Typography>
                    </Grid>
                    {preview && (
                      <CopyButton
                        onClick={() => {
                          try {
                            navigator.clipboard.writeText(preview);
                            toast((t) => (
                              <SuccessToast t={t}>
                                Storefront URL has been copied
                              </SuccessToast>
                            ));
                          } catch (error) {
                            console.error(error);
                            Sentry.captureException(error);
                            return false;
                          }
                        }}
                      >
                        <Copy weight="regular" />
                      </CopyButton>
                    )}
                    <Link
                      to={{
                        pathname: BosonRoutes.CreateStorefront,
                        search: `?${UrlParameters.customStoreUrl}=${
                          preview || ""
                        }`
                      }}
                    >
                      <Gear style={{ color: "initial" }} weight="regular" />
                    </Link>
                    <Trash
                      style={{ cursor: "pointer" }}
                      weight="regular"
                      onClick={() => {
                        showModal(
                          "CONFIRMATION",
                          {
                            // children: hasError ? <SimpleError /> : null,
                            text: (
                              <p>
                                Are you sure you want to delete{" "}
                                <strong> {name} </strong> storefront?
                              </p>
                            ),
                            cta: (
                              <DeleteButton
                                storefrontId={sf.id}
                                name={name}
                                refetch={refetch}
                                salesChannels={salesChannels}
                                key="delete-button"
                              />
                            ),
                            title: "Delete storefront"
                          },
                          "auto",
                          undefined,
                          {
                            s: "500px"
                          }
                        );
                      }}
                    />
                  </Grid>
                  <iframe src={preview} width="100%" height="500px" />
                </StoreFrontItem>
              );
            })}
          </Grid>
        </Grid>
      ) : (
        <p>You don't have any saved storefront</p>
      )}
    </Grid>
  );
};

export default ManageStoreFrontsPage;
