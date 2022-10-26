import {
  ButtonSize,
  exchanges as ExchangesKit,
  subgraph
} from "@bosonprotocol/react-kit";
import { Chat } from "phosphor-react";
import { generatePath, NavigateOptions, Path } from "react-router-dom";
import styled from "styled-components";

import { UrlParameters } from "../../../lib/routing/parameters";
import { BosonRoutes } from "../../../lib/routing/routes";
import { colors } from "../../../lib/styles/colors";
import { isExchangeCompletableBySeller } from "../../../lib/utils/exchange";
import { useDisputeSubStatusInfo } from "../../../lib/utils/hooks/useDisputeSubStatusInfo";
import { Exchange } from "../../../lib/utils/hooks/useExchanges";
import { SellerRolesProps } from "../../../lib/utils/hooks/useSellerRoles";
import { useModal } from "../../modal/useModal";
import BosonButton from "../../ui/BosonButton";
import Grid from "../../ui/Grid";

const generatePathAndNavigate = ({
  exchangeId,
  navigate
}: {
  exchangeId: string;
  navigate: (to: Partial<Path>, options?: NavigateOptions | undefined) => void;
}) => {
  const pathname = generatePath(BosonRoutes.ChatMessage, {
    [UrlParameters.exchangeId]: exchangeId ?? 0
  });
  navigate({ pathname });
};

const StyledBosonButton = styled(BosonButton)`
  background: transparent;
  border-color: ${colors.orange};
  color: ${colors.orange};
  border: 2px solid ${colors.orange};
  &:hover {
    background: ${colors.orange};
    border-color: ${colors.orange};
    color: ${colors.white};
    border: 2px solid ${colors.orange};
  }
`;

export const SellerResolveDisputeButton = ({
  exchange,
  navigate,
  sellerRoles
}: {
  exchange: Exchange | null;
  navigate: (to: Partial<Path>, options?: NavigateOptions | undefined) => void;
  sellerRoles: SellerRolesProps;
}) => {
  const { status } = useDisputeSubStatusInfo(exchange);
  if (!exchange || status !== "Resolving") {
    return (
      <BosonButton
        variant="accentInverted"
        showBorder={false}
        size={ButtonSize.Small}
        onClick={() => {
          if (exchange?.id) {
            generatePathAndNavigate({ exchangeId: exchange?.id, navigate });
          }
        }}
      >
        Chat <Chat size={14} />
      </BosonButton>
    );
  }

  return (
    <BosonButton
      variant="primaryFill"
      size={ButtonSize.Small}
      disabled={!sellerRoles?.isOperator}
      tooltip="This action is restricted to only the operator wallet"
      onClick={() => {
        if (exchange?.id) {
          generatePathAndNavigate({ exchangeId: exchange?.id, navigate });
        }
      }}
    >
      Resolve dispute
    </BosonButton>
  );
};

export const SellerActionButton = ({
  exchange,
  refetch,
  navigate,
  status,
  sellerRoles
}: {
  exchange: Exchange | null;
  refetch: () => void;
  navigate: (to: Partial<Path>, options?: NavigateOptions | undefined) => void;
  status: ExchangesKit.AllExchangeStates | string;
  sellerRoles: SellerRolesProps;
}) => {
  const { showModal, modalTypes } = useModal();
  if (!exchange) {
    return null;
  }
  return (
    <Grid justifyContent="flex-end" gap="1rem">
      {exchange && isExchangeCompletableBySeller(exchange) && (
        <BosonButton
          variant="primaryFill"
          size={ButtonSize.Small}
          disabled={!sellerRoles?.isOperator}
          tooltip="This action is restricted to only the operator wallet"
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
        </BosonButton>
      )}
      <BosonButton
        variant="accentInverted"
        showBorder={false}
        size={ButtonSize.Small}
        onClick={() => {
          if (exchange?.id) {
            generatePathAndNavigate({ exchangeId: exchange?.id, navigate });
          }
        }}
      >
        Chat <Chat size={14} />
      </BosonButton>
      {status === subgraph.ExchangeState.Committed && (
        <StyledBosonButton
          variant="accentInverted"
          showBorder={false}
          size={ButtonSize.Small}
          disabled={!sellerRoles?.isOperator}
          tooltip="This action is restricted to only the operator wallet"
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
        </StyledBosonButton>
      )}
    </Grid>
  );
};
