import { exchanges as ExchangesKit, subgraph } from "@bosonprotocol/react-kit";
import { Chat } from "phosphor-react";
import { generatePath } from "react-router-dom";
import { NavigateOptions, Path } from "react-router-dom";

import { UrlParameters } from "../../../lib/routing/parameters";
import { BosonRoutes } from "../../../lib/routing/routes";
import { useDisputeSubStatusInfo } from "../../../lib/utils/hooks/useDisputeSubStatusInfo";
import { Exchange } from "../../../lib/utils/hooks/useExchanges";
import { useModal } from "../../modal/useModal";
import Button from "../../ui/Button";
import Grid from "../../ui/Grid";
import { isCompletable } from "./SellerExchangeTable";

export const SellerResolveDisputeButton = ({
  exchange,
  navigate
}: {
  exchange: Exchange | null;
  navigate: (to: Partial<Path>, options?: NavigateOptions | undefined) => void;
}) => {
  const { status } = exchange
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useDisputeSubStatusInfo(exchange)
    : { status: "" };
  if (!exchange || status !== "Resolving") {
    return (
      <Button
        theme="ghostSecondary"
        size="small"
        onClick={() => {
          if (exchange?.id) {
            const pathname = generatePath(BosonRoutes.ChatMessage, {
              [UrlParameters.exchangeId]: exchange?.id ?? 0
            });
            navigate({ pathname });
          }
        }}
      >
        Chat <Chat size={14} />
      </Button>
    );
  }

  return (
    <Button
      theme="primary"
      size="small"
      onClick={() => {
        if (exchange?.id) {
          const pathname = generatePath(BosonRoutes.ChatMessage, {
            [UrlParameters.exchangeId]: exchange?.id ?? 0
          });
          navigate({ pathname });
        }
      }}
    >
      Resolve dispute
    </Button>
  );
};

export const SellerActionButton = ({
  exchange,
  refetch,
  navigate,
  status
}: {
  exchange: Exchange | null;
  refetch: () => void;
  navigate: (to: Partial<Path>, options?: NavigateOptions | undefined) => void;
  status: ExchangesKit.AllExchangeStates | string;
}) => {
  const { showModal, modalTypes } = useModal();
  if (!exchange) {
    return null;
  }
  return (
    <Grid justifyContent="flex-end" gap="1rem">
      {exchange && isCompletable(exchange) && (
        <Button
          theme="bosonPrimary"
          size="small"
          onClick={() => {
            showModal(
              modalTypes.COMPLETE_EXCHANGE,
              {
                title: "Complete Confirmation",
                exchange: exchange,
                refetch
              },
              "xs"
            );
          }}
        >
          Complete exchange
        </Button>
      )}
      <Button
        theme="ghostSecondary"
        size="small"
        onClick={() => {
          if (exchange?.id) {
            const pathname = generatePath(BosonRoutes.ChatMessage, {
              [UrlParameters.exchangeId]: exchange?.id ?? 0
            });
            navigate({ pathname });
          }
        }}
      >
        Chat <Chat size={14} />
      </Button>
      {status === subgraph.ExchangeState.Committed && (
        <Button
          theme="orangeInverse"
          size="small"
          onClick={() => {
            if (exchange) {
              showModal(
                modalTypes.REVOKE_PRODUCT,
                {
                  title: "Revoke rNFT",
                  exchangeId: exchange?.id,
                  exchange: exchange,
                  refetch
                },
                "xs"
              );
            }
          }}
        >
          Revoke
        </Button>
      )}
    </Grid>
  );
};
