import { ChangeEvent, forwardRef, useState } from "react";
import AvatarEditor, { AvatarEditorProps } from "react-avatar-editor";
import Dropzone from "react-dropzone";
import styled from "styled-components";

import { useIpfsImage } from "../../../lib/utils/hooks/images/useIpfsImage";
import Grid from "../../ui/Grid";

const StyledCanvasWrapper = styled.div`
  > :first-child {
    max-width: 100%;
    object-fit: contain;
    width: auto !important;
    height: auto !important;
  }
`;

export type ImageEditorProps = Pick<
  AvatarEditorProps,
  "borderRadius" | "width" | "height"
> & {
  url?: string;
};

export const ImageEditor = forwardRef<AvatarEditor, ImageEditorProps>(
  ({ url, borderRadius, width, height }, editorRef) => {
    const [scale, setScale] = useState<number>();
    const handleScale = (e: ChangeEvent<HTMLInputElement>) => {
      const scale = parseFloat(e.target.value);
      setScale(scale);
    };
    const { data } = useIpfsImage({ url: url ?? "" }, { enabled: !!url });
    const image = data?.base64;
    const { width: imageWidth, height: imageHeight } = data || {};
    const w = borderRadius ? width : width || imageWidth;
    const h = borderRadius ? height : height || imageHeight;
    return (
      <>
        {image && (
          <div style={{ margin: "2rem 0", maxWidth: "100%" }}>
            <Dropzone noClick noKeyboard>
              {({ getRootProps, getInputProps }) => (
                <StyledCanvasWrapper {...getRootProps()}>
                  <AvatarEditor
                    image={image}
                    ref={editorRef}
                    width={w}
                    height={h}
                    scale={scale}
                    borderRadius={borderRadius}
                  />
                  <input {...getInputProps()} />
                </StyledCanvasWrapper>
              )}
            </Dropzone>
            <Grid alignItems="center" justifyContent="center">
              Zoom:
              <input
                name="scale"
                type="range"
                onChange={handleScale}
                min={"0.1"}
                max="2"
                step="0.01"
                defaultValue="1"
              />
            </Grid>
          </div>
        )}
      </>
    );
  }
);
