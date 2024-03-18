import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import store from "./index";

export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;

// import {
//   createDispatchHook,
//   createSelectorHook,
//   TypedUseSelectorHook
// } from "react-redux";
// import { ReduxDappDummyContext } from "reduxContext";

// import store from "./index";

// const useDappDispatch = createDispatchHook(ReduxDappDummyContext as any);
// export const useAppDispatch = () => useDappDispatch<typeof store.dispatch>();
// const useDappSelector = createSelectorHook(ReduxDappDummyContext as any);
// export const useAppSelector: TypedUseSelectorHook<
//   ReturnType<typeof store.getState>
// > = useDappSelector;
