/* eslint-disable @typescript-eslint/no-explicit-any */
import { useField } from "formik";
import { useCallback } from "react";
import styled from "styled-components";

import { FormField, Input, Select } from "../form";
import TagsInput from "../form/TagsInput";
import Button from "../ui/Button";
import Grid from "../ui/Grid";
import Typography from "../ui/Typography";
import {
  ContainerProductPage,
  ProductButtonGroup,
  SectionTitle
} from "./Product.styles";
import {
  OPTIONS_CURRENCIES,
  ProductVariants as ProductVariantsType
} from "./utils";
import { useCreateForm } from "./utils/useCreateForm";

const variantsColorsKey = "productVariants.colors";
const variantsSizesKey = "productVariants.sizes";
const variantsKey = `productVariants.variants`;

const ProductInformationButtonGroup = styled(ProductButtonGroup)`
  margin-top: 1.563rem;
`;

const Table = styled.table`
  width: 100%;
  [data-price],
  [data-quantity] {
    width: 80px;
  }
`;
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
const capitalizeAll = (str: string) => str.toUpperCase();
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
      (variant) => variant.color === color
    );
    if (variantsWithSameColor.length <= 1) {
      // 1 because the variantToDelete is still there
      const filtered = colors.filter((item) => item !== color);
      setColors(filtered);
    }
  }
  if (sizes?.length) {
    const variantsWithSameSize = variants.filter(
      (variant) => variant.size === size
    );
    if (variantsWithSameSize.length <= 1) {
      // 1 because the variantToDelete is still there
      const filtered = sizes.filter((item) => item !== size);
      setSizes(filtered);
    }
  }
};

export default function ProductVariants() {
  const { nextIsDisabled } = useCreateForm();
  const [fieldColors, , helpersColors] =
    useField<ProductVariantsType["productVariants"]["colors"]>(
      variantsColorsKey
    );
  helpersColors.setValue;
  const [fieldSizes, , helpersSizes] =
    useField<ProductVariantsType["productVariants"]["sizes"]>(variantsSizesKey);
  const [fieldVariants, , helpersVariants] =
    useField<ProductVariantsType["productVariants"]["variants"]>(variantsKey);
  const variants = fieldVariants.value;
  const onAddTagType = useCallback(
    (type: "color" | "size", tag: string) => {
      const existingVariants = new Set<string>();
      const variants = fieldVariants?.value || [];
      const colors = (fieldColors?.value || []).filter(
        (value) => !!value
      ) as string[];
      const sizes = (fieldSizes?.value || []).filter(
        (value) => !!value
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

      if (!existingVariants.has(getColorSizeKey(tag))) {
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

      for (const otherTag of otherTags) {
        const color = type === "color" ? tag : otherTag;
        const size = type !== "color" ? tag : otherTag;
        if (!existingVariants.has(getColorSizeKey(color, size))) {
          variantsToAdd.push({
            color,
            size,
            name: `${color} / ${size}`,
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
      const hasVariantsToAdd = !!variantsToAdd.length;
      if (hasVariantsToAdd) {
        helpersVariants.setValue([...variants, ...variantsToAdd], true);
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

      const variantsToKeep = variants.filter((variant) => {
        return variant[type] !== tag;
      });
      helpersVariants.setValue([...variantsToKeep]);
    },
    [fieldVariants?.value, helpersVariants]
  );
  return (
    <ContainerProductPage>
      <SectionTitle tag="h2">Product Variants</SectionTitle>
      <FormField
        title="Create new variants"
        required
        subTitle="Add color & size variants to your product."
      >
        <Grid flexDirection="column" gap="2rem">
          <Grid flexDirection="column" alignItems="flex-start">
            <TagsInput
              placeholder={"Add color variants"}
              name={variantsColorsKey}
              onAddTag={(tag) => onAddTagType("color", tag)}
              onRemoveTag={(tag) => onRemoveTagType("color", tag)}
              transform={capitalize}
              label="Color:"
            />
          </Grid>
          <Grid flexDirection="column" alignItems="flex-start">
            <TagsInput
              placeholder={"Add size variants"}
              name={variantsSizesKey}
              onAddTag={(tag) => onAddTagType("size", tag)}
              onRemoveTag={(tag) => onRemoveTagType("size", tag)}
              transform={capitalizeAll}
              label="Size:"
            />
          </Grid>
        </Grid>
      </FormField>
      <SectionTitle tag="h2">Define Variants</SectionTitle>
      <SectionTitle tag="p">
        The table below shows each possible variant combination given the inputs
        above. You can remove a combination by selecting the rightmost button on
        the relevant row.
      </SectionTitle>
      <Table>
        <thead>
          <tr>
            <th data-name>Variant name</th>
            <th data-price>Price</th>
            <th data-currency>Currency</th>
            <th data-quantity>Quantity</th>
            <th data-action>Action</th>
          </tr>
        </thead>
        <tbody>
          {variants?.map((variant, idx) => {
            return (
              <tr key={variant.name}>
                <td data-name>
                  <Typography justifyContent="center">
                    {variant.name}
                  </Typography>
                </td>
                <td data-price>
                  <Input name={`${variantsKey}[${idx}].price`} type="number" />
                </td>
                <td data-currency>
                  <Select
                    name={`${variantsKey}[${idx}].currency`}
                    options={OPTIONS_CURRENCIES}
                  />
                </td>
                <td data-quantity>
                  <Input
                    name={`${variantsKey}[${idx}].quantity`}
                    type="number"
                  />
                </td>
                <td data-action>
                  <Grid justifyContent="center">
                    <Button
                      theme="orangeInverse"
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
                          ...variants.filter((_, index) => index !== idx)
                        ]);
                      }}
                    >
                      Remove
                    </Button>
                  </Grid>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <ProductInformationButtonGroup>
        <Button theme="primary" type="submit" disabled={nextIsDisabled}>
          Next
        </Button>
      </ProductInformationButtonGroup>
    </ContainerProductPage>
  );
}
