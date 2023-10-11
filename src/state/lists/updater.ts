import { getVersionUpgrade, VersionUpgrade } from "@uniswap/token-lists";
import {
  DEFAULT_LIST_OF_LISTS,
  UNSUPPORTED_LIST_URLS
} from "lib/constants/lists";
import { useProvider } from "lib/utils/hooks/connection/connection";
import { useFetchListCallback } from "lib/utils/hooks/useFetchListCallback";
import useInterval from "lib/utils/hooks/useInterval";
import useIsWindowVisible from "lib/utils/hooks/useIsWindowVisible";
import ms from "ms";
import { useCallback, useEffect } from "react";
import { useAppDispatch } from "state/hooks";
import { useAllLists } from "state/lists/hooks";

import { acceptListUpdate } from "./actions";
import { shouldAcceptVersionUpdate } from "./utils";

export function ListsUpdater(): null {
  const provider = useProvider();
  const dispatch = useAppDispatch();
  const isWindowVisible = useIsWindowVisible();

  // get all loaded lists, and the active urls
  const lists = useAllLists();

  const fetchList = useFetchListCallback();
  const fetchAllListsCallback = useCallback(() => {
    if (!isWindowVisible) return;
    DEFAULT_LIST_OF_LISTS.forEach((url) => {
      // Skip validation on unsupported lists
      const isUnsupportedList = UNSUPPORTED_LIST_URLS.includes(url);
      fetchList(url, isUnsupportedList).catch((error) =>
        console.debug("interval list fetching error", error)
      );
    });
  }, [fetchList, isWindowVisible]);

  // fetch all lists every 10 minutes, but only after we initialize provider
  useInterval(fetchAllListsCallback, provider ? ms(`10m`) : null);

  // whenever a list is not loaded and not loading, try again to load it
  useEffect(() => {
    Object.keys(lists).forEach((listUrl) => {
      const list = lists[listUrl];
      if (!list.current && !list.loadingRequestId && !list.error) {
        fetchList(listUrl).catch((error) =>
          console.debug("list added fetching error", error)
        );
      }
    });
  }, [dispatch, fetchList, lists]);

  // if any lists from unsupported lists are loaded, check them too (in case new updates since last visit)
  useEffect(() => {
    UNSUPPORTED_LIST_URLS.forEach((listUrl) => {
      const list = lists[listUrl];
      if (!list || (!list.current && !list.loadingRequestId && !list.error)) {
        fetchList(listUrl, /* isUnsupportedList= */ true).catch((error) =>
          console.debug("list added fetching error", error)
        );
      }
    });
  }, [dispatch, fetchList, lists]);

  // automatically update lists if versions are minor/patch
  useEffect(() => {
    Object.keys(lists).forEach((listUrl) => {
      const list = lists[listUrl];
      if (list.current && list.pendingUpdate) {
        const bump = getVersionUpgrade(
          list.current.version,
          list.pendingUpdate.version
        );
        switch (bump) {
          case VersionUpgrade.NONE:
            throw new Error("unexpected no version bump");
          case VersionUpgrade.PATCH:
          case VersionUpgrade.MINOR: {
            if (
              shouldAcceptVersionUpdate(
                listUrl,
                list.current,
                list.pendingUpdate,
                bump
              )
            ) {
              dispatch(acceptListUpdate(listUrl));
            }
            break;
          }
          // update any active or inactive lists
          case VersionUpgrade.MAJOR:
            dispatch(acceptListUpdate(listUrl));
        }
      }
    });
  }, [dispatch, lists]);

  return null;
}
