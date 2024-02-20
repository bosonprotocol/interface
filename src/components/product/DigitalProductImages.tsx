import SimpleError from "components/error/SimpleError";
import bytesToSize from "lib/utils/bytesToSize";
import { ElementRef, HTMLAttributes } from "react";
import styled from "styled-components";

import { FormField, Upload } from "../form";
import { MAX_VIDEO_FILE_SIZE } from "./utils";

const SpaceContainer = styled.div`
  display: grid;
  grid-column-gap: 2rem;
  grid-row-gap: 2rem;

  grid-template-columns: repeat(1, max-content);
`;

export function DigitalUploadImages({
  prefix,
  error,
  ...rest
}: { prefix: string; error?: string | null } & HTMLAttributes<
  ElementRef<"div">
>) {
  return (
    <SpaceContainer {...rest}>
      <div>
        <Upload name={`${prefix}.image`} placeholder="Image" withUpload />
      </div>
      <FormField
        title="Upload your animation video for your digital"
        subTitle={`Only MP4 is supported. Use a max. size of ${bytesToSize(
          MAX_VIDEO_FILE_SIZE
        )} for the video`}
      >
        <Upload
          name={`${prefix}.video`}
          placeholder="Video"
          // accept="video/webm, video/mp4, video/m4v, video/ogv, video/ogg"
          accept="video/mp4"
          maxSize={MAX_VIDEO_FILE_SIZE}
          withUpload
          //   onLoading={(loading) => setVideoLoading(loading)}
        />
      </FormField>
      {error && <SimpleError>{error}</SimpleError>}
    </SpaceContainer>
  );
}
