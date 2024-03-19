import { hooks } from "@bosonprotocol/react-kit";
import { asSupportedChain } from "lib/constants/chains";
import {
  useAccount,
  useChainId,
  useProvider
} from "lib/utils/hooks/connection/connection";
import useDebounce from "lib/utils/hooks/useDebounce";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "state/hooks";

import { useCloseModal } from "./hooks";
import { updateChainId } from "./reducer";

export function ApplicationUpdater(): null {
  const chainId = useChainId();
  const provider = useProvider();
  const { account } = useAccount();

  const dispatch = useAppDispatch();
  const windowVisible = hooks.useIsWindowVisible();

  const [activeChainId, setActiveChainId] = useState(chainId);

  const closeModal = useCloseModal();
  const previousAccountValue = useRef(account);
  useEffect(() => {
    if (account && account !== previousAccountValue.current) {
      previousAccountValue.current = account;
      closeModal();
    }
  }, [account, closeModal]);

  useEffect(() => {
    if (provider && chainId && windowVisible) {
      setActiveChainId(chainId);
    }
  }, [dispatch, chainId, provider, windowVisible]);

  const debouncedChainId = useDebounce(activeChainId, 100);

  useEffect(() => {
    const chainId = debouncedChainId
      ? asSupportedChain(debouncedChainId)
      : null;
    dispatch(updateChainId({ chainId }));
  }, [dispatch, debouncedChainId]);

  return null;
}
