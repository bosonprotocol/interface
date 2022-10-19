/* eslint-disable @typescript-eslint/no-explicit-any */
import { useField } from "formik";
import { useCallback } from "react";
import styled from "styled-components";

import { FormField, Input, Select } from "../form";
import TagsInput from "../form/TagsInput";
import Button from "../ui/Button";
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
`;

const getColorSizeKey = (color: string, size: string) => `${color}_${size}`;

export default function ProductVariants() {
  const { nextIsDisabled } = useCreateForm();
  const [fieldColors] =
    useField<ProductVariantsType["productVariants"]["colors"]>(
      variantsColorsKey
    );
  const [fieldSizes] =
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
        existingVariants.add(getColorSizeKey(variant.color, variant.size));
      }
      const variantsToAdd: ProductVariantsType["productVariants"]["variants"] =
        [];
      const otherTags = type === "color" ? sizes : colors;
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
        <>
          <TagsInput
            placeholder={"Add color variants"}
            name={variantsColorsKey}
            onAddTag={(tag) => onAddTagType("color", tag)}
            onRemoveTag={(tag) => onRemoveTagType("color", tag)}
          />
          <TagsInput
            placeholder={"Add size variants"}
            name={variantsSizesKey}
            onAddTag={(tag) => onAddTagType("size", tag)}
            onRemoveTag={(tag) => onRemoveTagType("size", tag)}
          />
        </>
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
            <th>Variant name</th>
            <th>Currency</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {variants?.map((variant, idx) => {
            return (
              <tr key={variant.name}>
                <td>
                  <Typography justifyContent="center">
                    {variant.name}
                  </Typography>
                </td>
                <td>
                  <Select
                    name={`${variantsKey}[${idx}].currency`}
                    options={OPTIONS_CURRENCIES}
                  />
                </td>
                <td>
                  <Input name={`${variantsKey}[${idx}].price`} type="number" />
                </td>
                <td>
                  <Input
                    name={`${variantsKey}[${idx}].quantity`}
                    type="number"
                  />
                </td>
                <td>
                  <Button
                    theme="orangeInverse"
                    size="small"
                    onClick={() => {
                      helpersVariants.setValue([
                        ...variants.filter((_, index) => index !== idx)
                      ]);
                    }}
                  >
                    Remove
                  </Button>
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
