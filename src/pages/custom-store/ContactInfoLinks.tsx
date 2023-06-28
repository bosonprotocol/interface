import { arrayMoveImmutable } from "array-move";
import React from "react";
import SortableList, { SortableItem } from "react-easy-sort";
import styled, { createGlobalStyle } from "styled-components";

import { Input } from "../../components/form";
import Grid from "../../components/ui/Grid";
import Typography from "../../components/ui/Typography";
import { ContactInfoLinkIcon } from "./ContactInfoLinkIcon";
import { storeFields } from "./store-fields";
import { StoreFormFields } from "./store-fields-types";
import {
  firstSubFieldBasis,
  gap,
  logoSize,
  secondSubFieldBasis
} from "./styles";

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

type Links = StoreFormFields["contactInfoLinks"] | undefined;
interface ContactInfoLinksProps {
  links: Links;
  setLinks: (links: Links) => unknown;
}

const ContactInfoLinks: React.FC<ContactInfoLinksProps> = ({
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
            <Typography>Icon</Typography>
          </Grid>
          <Grid flexBasis={secondSubFieldBasis}>
            <Typography>Text</Typography>
          </Grid>
        </Grid>
      )}
      <Global />
      <StyledSortableList onSortEnd={onSortEnd} draggedItemClassName="dragged">
        {(links || []).map((selection, index) => {
          const { label, value } = selection || {};

          return (
            <SortableItem key={value}>
              <Grid gap={gap}>
                <Grid flexBasis={firstSubFieldBasis}>
                  <ContactInfoLinkIcon icon={value} size={logoSize} />
                </Grid>
                <Grid
                  flexBasis={secondSubFieldBasis}
                  flexDirection="column"
                  alignItems="flex-start"
                >
                  <Input
                    name={`${storeFields.contactInfoLinks}[${index}].text`}
                    placeholder={`${label}`}
                  />
                </Grid>
              </Grid>
            </SortableItem>
          );
        })}
      </StyledSortableList>
    </Grid>
  );
};

export default ContactInfoLinks;
