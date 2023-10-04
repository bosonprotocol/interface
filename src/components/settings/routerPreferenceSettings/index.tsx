import { Divider } from "components/icons";
import UniswapXBrandMark from "components/logo/UniswapXBrandMark";
import Toggle from "components/toggle";
import Column from "components/ui/column";
import Grid from "components/ui/Grid";
import Typography from "components/ui/Typography";
import { isUniswapXSupportedChain } from "lib/constants/chains";
import { colors } from "lib/styles/colors";
import { useChainId } from "lib/utils/hooks/connection/connection";
import { useAppDispatch } from "state/hooks";
import { RouterPreference } from "state/routing/types";
import { useRouterPreference } from "state/user/hooks";
import { updateDisabledUniswapX } from "state/user/reducer";
import styled from "styled-components";

const InlineLink = styled(Typography)`
  color: ${colors.secondary};
  display: inline;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

export default function RouterPreferenceSettings() {
  const chainId = useChainId();
  const [routerPreference, setRouterPreference] = useRouterPreference();
  const uniswapXEnabled = chainId && isUniswapXSupportedChain(chainId);
  const dispatch = useAppDispatch();

  return (
    <>
      {uniswapXEnabled && (
        <>
          <Grid gap="8px">
            <Grid>
              <Column gap="sm">
                <Typography>
                  <UniswapXBrandMark />
                </Typography>
                <Typography color="textSecondary">
                  <>
                    When available, aggregates liquidity sources for better
                    prices and gas free swaps.
                  </>{" "}
                  <a href="https://support.uniswap.org/hc/en-us/articles/17515415311501">
                    <InlineLink>Learn more</InlineLink>
                  </a>
                </Typography>
              </Column>
            </Grid>
            <Toggle
              id="toggle-uniswap-x-button"
              isActive={routerPreference === RouterPreference.X}
              toggle={() => {
                if (routerPreference === RouterPreference.X) {
                  // We need to remember if a user disables Uniswap X, so we don't show the opt-in flow again.
                  dispatch(updateDisabledUniswapX({ disabledUniswapX: true }));
                }
                setRouterPreference(
                  routerPreference === RouterPreference.X
                    ? RouterPreference.API
                    : RouterPreference.X
                );
              }}
            />
          </Grid>
          <Divider />
        </>
      )}
      <Grid gap="sm">
        <Grid>
          <Column gap="xs">
            <Typography color={colors.darkGrey}>
              <>Local routing</>
            </Typography>
          </Column>
        </Grid>
        <Toggle
          id="toggle-local-routing-button"
          isActive={routerPreference === RouterPreference.CLIENT}
          toggle={() =>
            setRouterPreference(
              routerPreference === RouterPreference.CLIENT
                ? RouterPreference.API
                : RouterPreference.CLIENT
            )
          }
        />
      </Grid>
    </>
  );
}
