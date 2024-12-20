/* eslint-disable @typescript-eslint/no-explicit-any */
import { useConfigContext } from "components/config/ConfigContext";
import { useField } from "formik";
import { Key, useCallback, useEffect } from "react";
import styled from "styled-components";

import { isTruthy } from "../../lib/types/helpers";
import { useForm } from "../../lib/utils/hooks/useForm";
import { Error, FormField, Input, Select } from "../form";
import TagsInput from "../form/TagsInput";
import BosonButton from "../ui/BosonButton";
import Button from "../ui/Button";
import { Grid } from "../ui/Grid";
import {
  ContainerProductPage,
  ProductButtonGroup,
  SectionTitle
} from "./Product.styles";
import {
  getOptionsCurrencies,
  ProductVariants as ProductVariantsType
} from "./utils";
import { getVariantName } from "./utils/getVariantName";

const variantsColorsKey = "productVariants.colors";
const variantsSizesKey = "productVariants.sizes";
const variantsKey = `productVariants.variants`;
const variantFontSize = "0.8125rem";
const TdFlex = styled("td")`
  display: flex;
  flex-direction: column;
`;

const ProductInformationButtonGroup = styled(ProductButtonGroup)`
  margin-top: 1.563rem;
`;

const Table = styled.table`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1 1;
`;
const THead = styled.thead`
  display: flex;
  tr {
    width: 100%;
    display: flex;
    th {
      flex: 1 1;
    }
  }
`;
const TBody = styled.tbody`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
  tr {
    width: 100%;
    display: flex;
    td {
      display: flex;
      flex-direction: column;
      flex: 1 1;
      &[data-name] {
        font-size: ${variantFontSize};
        height: 50px;
        display: flex;
        justify-content: center;
      }
      .react-select__control,
      > input {
        height: 50px;
      }
    }
  }
`;

const StyledFormField = styled(FormField)`
  [data-label] {
    min-width: 40px;
  }
  .tag {
    font-size: ${variantFontSize};
  }
`;

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
const getColorSizeKey = (color: string, size?: string) =>
  size ? `${color}_${size}` : color;

type ListType = (string | undefined)[] | undefined;
const deleteTagsIfNoVariants = (
  variantToDelete: ProductVariantsType["productVariants"]["variants"][number],
  variants: ProductVariantsType["productVariants"]["variants"],
  colors: ProductVariantsType["productVariants"]["colors"],
  setColors: (colors: ListType) => void,
  sizes: ProductVariantsType["productVariants"]["sizes"],
  setSizes: (sizes: ListType) => void
): void => {
  const { color, size } = variantToDelete;
  if (colors?.length) {
    const variantsWithSameColor = variants.filter(
      (variant: { color: string }) => variant.color === color
    );
    if (variantsWithSameColor.length <= 1) {
      // 1 because the variantToDelete is still there
      const filtered = colors.filter((item: string) => item !== color);
      setColors(filtered);
    }
  }
  if (sizes?.length) {
    const variantsWithSameSize = variants.filter(
      (variant: { size: string }) => variant.size === size
    );
    if (variantsWithSameSize.length <= 1) {
      // 1 because the variantToDelete is still there
      const filtered = sizes.filter((item: string) => item !== size);
      setSizes(filtered);
    }
  }
};

export default function ProductVariants() {
  const { config } = useConfigContext();
  const OPTIONS_CURRENCIES = getOptionsCurrencies(config.envConfig);

  const { nextIsDisabled } = useForm();
  const [fieldColors, , helpersColors] =
    useField<ProductVariantsType["productVariants"]["colors"]>(
      variantsColorsKey
    );
  const [fieldSizes, , helpersSizes] =
    useField<ProductVariantsType["productVariants"]["sizes"]>(variantsSizesKey);
  const [fieldVariants, metaVariants, helpersVariants] =
    useField<ProductVariantsType["productVariants"]["variants"]>(variantsKey);
  const variants = fieldVariants.value;
  const onAddTagType = useCallback(
    (type: "color" | "size", tags: string[]) => {
      if (tags.length === 0) {
        return;
      }
      const variants = fieldVariants?.value || [];
      if (tags.length > 1 && variants.length) {
        return;
      }
      const existingVariants = new Set<string>();
      const colors = (fieldColors?.value || []).filter(
        (value: any) => !!value
      ) as string[];
      const sizes = (fieldSizes?.value || []).filter(
        (value: any) => !!value
      ) as string[];
      for (const variant of variants) {
        variant.color && existingVariants.add(getColorSizeKey(variant.color));
        variant.size && existingVariants.add(getColorSizeKey(variant.size));
        if (variant.color && variant.size) {
          existingVariants.add(getColorSizeKey(variant.color, variant.size));
        }
      }
      const variantsToAdd: ProductVariantsType["productVariants"]["variants"] =
        [];
      const otherTags = type === "color" ? sizes : colors;

      tags.forEach((tag) => {
        if (!otherTags.length && !existingVariants.has(getColorSizeKey(tag))) {
          // add variant with single tag
          const color = type === "color" ? tag : "";
          const size = type === "color" ? "" : tag;
          variantsToAdd.push({
            color,
            size,
            name: tag,
            // TODO: yup does not infer currency, price and quantity as nullable, even though they are are defined as such
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            currency:
              OPTIONS_CURRENCIES.length === 1 ? OPTIONS_CURRENCIES[0] : null,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            price: undefined,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            quantity: undefined
          });
        }
      });

      // remove variants with single tags of the other type
      const variantsToKeep = variants.filter(
        (variant: { color: string; size: string }) => {
          const { color, size } = variant;
          const hasOnlyTheOtherTag =
            type === "color" ? !!size && !color : !!color && !size;
          return !hasOnlyTheOtherTag;
        }
      );

      // add variants with pair Color / Size
      for (const otherTag of otherTags) {
        const color = type === "color" ? tags[0] : otherTag;
        const size = type !== "color" ? tags[0] : otherTag;
        if (!existingVariants.has(getColorSizeKey(color, size))) {
          variantsToAdd.push({
            color,
            size,
            name: getVariantName({ color, size }),
            // TODO: yup does not infer currency, price and quantity as nullable, even though they are are defined as such
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            currency:
              OPTIONS_CURRENCIES.length === 1 ? OPTIONS_CURRENCIES[0] : null,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            price: undefined,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            quantity: undefined
          });
        }
      }
      if (!!variantsToAdd.length || !!variantsToKeep.length) {
        helpersVariants.setTouched(false);
        helpersVariants.setValue([...variantsToKeep, ...variantsToAdd], true);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      fieldColors?.value,
      fieldSizes?.value,
      fieldVariants?.value,
      helpersVariants
    ]
  );
  const onRemoveTagType = useCallback(
    (type: "color" | "size", tag: string) => {
      const variants = fieldVariants?.value || [];

      const variantsToKeep = variants.filter(
        (variant: { [x: string]: string }) => {
          return variant[type] !== tag;
        }
      );
      helpersVariants.setValue([...variantsToKeep]);
    },
    [fieldVariants?.value, helpersVariants]
  );
  useEffect(() => {
    const sizes = fieldSizes.value?.filter(isTruthy) || [];
    const colors = fieldColors.value?.filter(isTruthy) || [];
    const hasSizes = !!sizes.length;
    const hasColors = !!colors.length;
    if (!fieldVariants.value.length) {
      if (!hasColors && hasSizes) {
        onAddTagType("size", sizes);
      } else if (!hasSizes && hasColors) {
        onAddTagType("color", colors);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldVariants.value]);
  return (
    <ContainerProductPage>
      <SectionTitle tag="h2">Product variants</SectionTitle>
      <StyledFormField
        title="Create new variants"
        required
        subTitle="Add color & size variants to your product."
      >
        <Grid flexDirection="column" gap="2rem">
          <Grid flexDirection="column" alignItems="flex-start">
            <TagsInput
              placeholder={"Add color variants"}
              name={variantsColorsKey}
              onAddTag={(tag) => onAddTagType("color", [tag])}
              onRemoveTag={(tag) => onRemoveTagType("color", tag)}
              transform={capitalize}
              label="Color:"
            />
          </Grid>
          <Grid flexDirection="column" alignItems="flex-start">
            <TagsInput
              placeholder={"Add size variants"}
              name={variantsSizesKey}
              onAddTag={(tag) => onAddTagType("size", [tag])}
              onRemoveTag={(tag) => onRemoveTagType("size", tag)}
              transform={capitalize}
              label="Size:"
            />
          </Grid>
        </Grid>
      </StyledFormField>
      <StyledFormField
        title="Define variants"
        required
        subTitle="Shown below are the variant combinations using the inputs above. Remove a specific combination by selecting the 'Remove button against it."
      >
        <Table>
          <THead>
            <tr>
              <Grid
                data-name
                as="th"
                flexDirection="row"
                justifyContent="flex-start"
                alignItems="flex-start"
              >
                Variant name
              </Grid>
              <th data-price>Price</th>
              <th data-currency>Currency</th>
              <th data-quantity>Quantity</th>
              <th data-action>Action</th>
            </tr>
          </THead>
          <TBody>
            {variants?.map(
              (
                variant: {
                  name: Key | null | undefined;
                },
                idx: number
              ) => {
                return (
                  <tr key={variant.name}>
                    <Grid
                      data-name
                      as="td"
                      flexDirection="row"
                      alignItems="flex-start"
                    >
                      {variant.name}
                    </Grid>
                    <td data-price>
                      <Input
                        name={`${variantsKey}[${idx}].price`}
                        type="number"
                      />
                    </td>
                    <TdFlex data-currency>
                      <Select
                        name={`${variantsKey}[${idx}].currency`}
                        options={OPTIONS_CURRENCIES}
                        classNamePrefix="react-select"
                      />
                    </TdFlex>
                    <td data-quantity>
                      <Input
                        name={`${variantsKey}[${idx}].quantity`}
                        type="number"
                      />
                    </td>
                    <td data-action>
                      <Grid justifyContent="center">
                        <BosonButton
                          variant="secondaryInverted"
                          size="small"
                          onClick={() => {
                            deleteTagsIfNoVariants(
                              variant,
                              variants,
                              fieldColors.value,
                              helpersColors.setValue,
                              fieldSizes.value,
                              helpersSizes.setValue
                            );
                            helpersVariants.setValue([
                              ...variants.filter(
                                (_: never, index: number) => index !== idx
                              )
                            ]);
                          }}
                        >
                          Remove
                        </BosonButton>
                      </Grid>
                    </td>
                  </tr>
                );
              }
            )}
          </TBody>
        </Table>
      </StyledFormField>
      {metaVariants.error && typeof metaVariants.error === "string" && (
        <Error display message={metaVariants.error} />
      )}
      <ProductInformationButtonGroup>
        <Button themeVal="primary" type="submit" disabled={nextIsDisabled}>
          Next
        </Button>
      </ProductInformationButtonGroup>
    </ContainerProductPage>
  );
}
