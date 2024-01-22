import { arrayMoveImmutable } from "array-move";
import React from "react";
import SortableList, { SortableItem } from "react-easy-sort";
import styled, { createGlobalStyle } from "styled-components";

import { Input } from "../../components/form";
import { Grid } from "../../components/ui/Grid";
import { Typography } from "../../components/ui/Typography";
import SocialLogo from "./SocialLogo";
import { storeFields } from "./store-fields";
import { StoreFormFields } from "./store-fields-types";
import { firstSubFieldBasis, gap, logoSize } from "./styles";

const Global = createGlobalStyle`
  .dragged {
    cursor: grabbing;
    background: rgba(0, 0, 0, 0.4);
  }
`;

const StyledSortableList = styled(SortableList)`
  cursor: grab;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${gap};
`;

type Links = StoreFormFields["socialMediaLinks"] | undefined;
interface SocialMediaLinksProps {
  links: Links;
  setLinks: (links: Links) => unknown;
}

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({
  links,
  setLinks
}) => {
  const onSortEnd = (oldIndex: number, newIndex: number) => {
    if (!links) {
      return;
    }
    setLinks(arrayMoveImmutable(links, oldIndex, newIndex));
  };
  return (
    <Grid flexDirection="column" alignItems="flex-start" gap={gap}>
      {!!links?.length && (
        <Grid gap={gap}>
          <Grid flexBasis={firstSubFieldBasis}>
            <Typography>Logo</Typography>
          </Grid>
          <Grid justifyContent="flex-end">
            <Typography>URL</Typography>
          </Grid>
        </Grid>
      )}
      <Global />
      <StyledSortableList onSortEnd={onSortEnd} draggedItemClassName="dragged">
        {(links || []).map((selection, index) => {
          const { label, value, prefix } = selection || {};
          return (
            <SortableItem key={label}>
              <Grid gap={gap} alignItems="baseline">
                <Grid flexBasis={firstSubFieldBasis}>
                  <SocialLogo logo={value} size={logoSize} />
                </Grid>
                <Grid
                  alignItems="baseline"
                  gap={"0.25rem"}
                  justifyContent="flex-end"
                >
                  <span style={{ fontSize: "0.7rem" }}>{prefix}</span>
                  <Grid
                    flexDirection="column"
                    alignItems="flex-start"
                    flexBasis="50%"
                  >
                    <Input
                      name={`${storeFields.socialMediaLinks}[${index}].url`}
                      placeholder={`${label} handle`}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </SortableItem>
          );
        })}
      </StyledSortableList>
    </Grid>
  );
};

export default SocialMediaLinks;
