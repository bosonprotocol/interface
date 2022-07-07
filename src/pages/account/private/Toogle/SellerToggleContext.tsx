import React, { useContext } from "react";

export const SellerToggleContext = React.createContext({
  isTabSellerSelected: false
});

export const useSellerToggle = () => useContext(SellerToggleContext);
