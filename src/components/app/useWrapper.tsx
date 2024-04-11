import { Fragment, ReactNode, useMemo } from "react";

import Layout, { LayoutProps } from "../layout/Layout";

const getLayoutWrapper =
  (fullWidth: LayoutProps["fullWidth"]) =>
  ({ children }: { children: ReactNode }) => (
    <Layout
      style={{ display: "flex", flex: "1", flexDirection: "column" }}
      fullWidth={fullWidth}
    >
      {children}
    </Layout>
  );

export const useWrapper = ({
  withFullLayout,
  withLayout
}: {
  withFullLayout: boolean;
  withLayout: boolean;
}) => {
  const LayoutWrapper = useMemo(() => {
    return getLayoutWrapper(withFullLayout);
  }, [withFullLayout]);
  const Wrapper = withLayout ? LayoutWrapper : Fragment;
  return Wrapper;
};

export type Wrapper = ReturnType<typeof useWrapper>;
