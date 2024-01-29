import styled from "styled-components";

import { breakpoint } from "../../lib/styles/breakpoint";
import { Upload } from "../form";
import { MAX_VIDEO_FILE_SIZE } from "./utils";

const SpaceContainer = styled.div`
  display: grid;
  grid-column-gap: 2rem;
  grid-row-gap: 2rem;
  justify-content: space-between;

  grid-template-columns: repeat(1, max-content);
  ${breakpoint.xs} {
    grid-template-columns: repeat(2, max-content);
  }
`;

export function DigitalUploadImages({ prefix }: { prefix: string }) {
  return (
    <SpaceContainer>
      <div>
        <Upload name={`${prefix}.image`} placeholder="Image" withUpload />
      </div>
      <div>
        <Upload
          name={`${prefix}.video`}
          placeholder="Video"
          // accept="video/webm, video/mp4, video/m4v, video/ogv, video/ogg"
          accept="video/mp4"
          maxSize={MAX_VIDEO_FILE_SIZE}
          withUpload
          //   onLoading={(loading) => setVideoLoading(loading)}
        />
      </div>
    </SpaceContainer>
  );
}
