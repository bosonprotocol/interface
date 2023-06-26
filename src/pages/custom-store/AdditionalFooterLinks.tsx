import { arrayMoveImmutable } from "array-move";
import { useFormikContext } from "formik";
import React, { useEffect } from "react";
import SortableList, { SortableItem } from "react-easy-sort";
import styled, { createGlobalStyle } from "styled-components";

import { Input } from "../../components/form";
import Button from "../../components/ui/Button";
import Grid from "../../components/ui/Grid";
import Typography from "../../components/ui/Typography";
import { AdditionalFooterLink } from "./AdditionalFooterLinksTypes";
import { storeFields } from "./store-fields";
import { StoreFormFields } from "./store-fields-types";
import { gap } from "./styles";

export const getNewAdditionalLink = (
  linksLength: number,
  label?: string
): AdditionalFooterLink => {
  return {
    label: label ?? "Custom",
    value: `custom_${linksLength}`,
    url: ""
  };
};

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

type Links = StoreFormFields["additionalFooterLinks"] | undefined;
interface AdditionalFooterLinksProps {
  links: Links;
  setLinks: (links: Links, shouldValidate?: boolean | undefined) => unknown;
}

const AdditionalFooterLinks: React.FC<AdditionalFooterLinksProps> = ({
  links,
  setLinks
}) => {
  const { setFieldValue, values, setFieldTouched, touched } =
    useFormikContext<StoreFormFields>();

  const onSortEnd = (oldIndex: number, newIndex: number) => {
    if (!links) {
      return;
    }
    setLinks(arrayMoveImmutable(links, oldIndex, newIndex));
  };
  const allFilledOut = links?.every((footerLink) => {
    const { label, value } = footerLink || {};
    return !!label && !!value;
  });
  const addFooterLink = () => {
    if (!links) {
      return;
    }
    if (allFilledOut) {
      setLinks([...links, getNewAdditionalLink(links.length)], true);
    }
  };
  const removeEmptyRowsExceptOne = () => {
    const value = values.additionalFooterLinks;
    if (!value) {
      return;
    }
    const onlyFilledValues = value.filter((v) => !!v?.label || !!v?.url);
    const someRowsAreNotFilled = onlyFilledValues?.length !== value?.length;
    const oneRowIsNotFilled = onlyFilledValues.length - 1 < value?.length;
    const valueToSet = someRowsAreNotFilled
      ? oneRowIsNotFilled
        ? [...onlyFilledValues, getNewAdditionalLink(value.length, "")]
        : onlyFilledValues
      : value;
    setFieldValue(storeFields.additionalFooterLinks, valueToSet, true);
    valueToSet.forEach((val, index) => {
      if (val?.url) {
        setFieldTouched(
          `${storeFields.additionalFooterLinks}[${index}].label`,
          true
        );
      }
      if (val?.label) {
        setFieldTouched(
          `${storeFields.additionalFooterLinks}[${index}].url`,
          true
        );
      }
    });
  };
  useEffect(() => {
    if (!values.additionalFooterLinks) {
      return;
    }
    if (
      values.additionalFooterLinks.length <
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      (touched.additionalFooterLinks?.length || 0)
    ) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      touched.additionalFooterLinks?.splice(
        -1,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        (touched.additionalFooterLinks?.length || 0) -
          values.additionalFooterLinks.length
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.additionalFooterLinks?.length]);
  return (
    <Grid flexDirection="column" alignItems="flex-start" gap={gap}>
      {!!links?.length && (
        <Grid gap={gap}>
          <Grid flexBasis="50%">
            <Typography>Label</Typography>
          </Grid>
          <Grid flexBasis="50%">
            <Typography>URL</Typography>
          </Grid>
        </Grid>
      )}
      <Global />
      <StyledSortableList onSortEnd={onSortEnd} draggedItemClassName="dragged">
        {(links || []).map((selection, index) => {
          const { value } = selection || {};

          return (
            <SortableItem key={value}>
              <Grid gap={gap} alignItems="flex-start">
                <Grid flexBasis="50%" flexDirection="column">
                  <Input
                    name={`${storeFields.additionalFooterLinks}[${index}].label`}
                    placeholder={`Label`}
                    onBlur={() => removeEmptyRowsExceptOne()}
                  />
                </Grid>
                <Grid
                  flexBasis="50%"
                  flexDirection="column"
                  alignItems="flex-start"
                >
                  <Input
                    name={`${storeFields.additionalFooterLinks}[${index}].url`}
                    placeholder={`URL`}
                    onBlur={() => removeEmptyRowsExceptOne()}
                  />
                </Grid>
              </Grid>
            </SortableItem>
          );
        })}
      </StyledSortableList>
      <Button
        disabled={!allFilledOut}
        onClick={addFooterLink}
        theme="secondary"
      >
        + Add
      </Button>
    </Grid>
  );
};

export default AdditionalFooterLinks;
