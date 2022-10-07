import React, { useMemo } from "react";

import {
  GetItemFromStorageKey,
  useLocalStorage
} from "../../../lib/utils/hooks/useLocalStorage";

export interface WithUploadPreviewProps {
  previewImage?: string | null;
  previewCallback?: (v: string | null) => void;
  fileValue?: File[] | null;
}
export function WithUploadPreview<P extends WithUploadPreviewProps>(
  WrappedComponent: React.ComponentType<P>
) {
  const ComponentWithUploadPreview = (
    props: Omit<P, keyof WithUploadPreviewProps>
  ) => {
    // eslint-disable-next-line
    // @ts-ignore
    const { withPreview, name } = props;

    const fileName = useMemo(
      () => `${withPreview || "create-product-image"}_${name}`,
      [name, withPreview]
    );
    const [preview, setPreview] = useLocalStorage<GetItemFromStorageKey | null>(
      fileName as GetItemFromStorageKey,
      null
    );
    const newProps = useMemo(
      () => ({
        previewImage: preview,
        previewCallback: setPreview
      }),
      [preview, setPreview]
    );

    if (withPreview) {
      return <WrappedComponent {...newProps} {...(props as P)} />;
    }
    return <WrappedComponent {...(props as P)} />;
  };

  return ComponentWithUploadPreview;
}
