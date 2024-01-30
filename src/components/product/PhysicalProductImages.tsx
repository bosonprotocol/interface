import { ElementRef, HTMLAttributes } from "react";
import styled from "styled-components";

import { breakpoint } from "../../lib/styles/breakpoint";
import { Upload } from "../form";

const SpaceContainer = styled.div`
  display: grid;
  grid-column-gap: 2rem;
  grid-row-gap: 2rem;
  justify-content: space-between;

  grid-template-columns: repeat(1, max-content);
  ${breakpoint.xs} {
    grid-template-columns: repeat(2, max-content);
  }
  ${breakpoint.m} {
    grid-template-columns: repeat(4, max-content);
  }
`;

export function PhysicalUploadImages({
  prefix,
  ...rest
}: { prefix: string } & HTMLAttributes<ElementRef<"div">>) {
  return (
    <SpaceContainer {...rest}>
      <div>
        <Upload
          name={`${prefix}.thumbnail`}
          placeholder="Thumbnail"
          withUpload
        />
      </div>
      <div>
        <Upload
          name={`${prefix}.secondary`}
          placeholder="Secondary"
          withUpload
        />
      </div>
      <div>
        <Upload
          name={`${prefix}.everyAngle`}
          placeholder="Every angle"
          withUpload
        />
      </div>
      <div>
        <Upload name={`${prefix}.details`} placeholder="Details" withUpload />
      </div>
      <div>
        <Upload name={`${prefix}.inUse`} placeholder="In Use" withUpload />
      </div>
      <div>
        <Upload
          name={`${prefix}.styledScene`}
          placeholder="Styled Scene"
          withUpload
        />
      </div>
      <div>
        <Upload
          name={`${prefix}.sizeAndScale`}
          placeholder="Size and scale"
          withUpload
        />
      </div>
      <div>
        <Upload name={`${prefix}.more`} placeholder="More" withUpload />
      </div>
    </SpaceContainer>
  );
}
