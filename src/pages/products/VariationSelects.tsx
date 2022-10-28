import { Form, Formik } from "formik";
import uniqBy from "lodash.uniqby";
import { Dispatch, SetStateAction, useState } from "react";

import SimpleError from "../../components/error/SimpleError";
import { Select } from "../../components/form";
import { SelectDataProps } from "../../components/form/types";
import Grid from "../../components/ui/Grid";
import { isTruthy } from "../../lib/types/helpers";
import { isNumeric } from "../../lib/utils/number";
import { VariantV1, Variation } from "./types";

const sizes = [
  "xxxxxs",
  "x-x-x-x-x-small",
  "extra extra extra extra extra small",
  "xxxxs",
  "x-x-x-x-small",
  "extra extra extra extra small",
  "xxxs",
  "x-x-x-small",
  "extra extra extra small",
  "xxs",
  "x-x-small",
  "extra extra small",
  "xs",
  "x-small",
  "extra small",
  "s",
  "small",
  "m",
  "medium",
  "l",
  "large",
  "xl",
  "x-large",
  "extra large",
  "xxl",
  "x-x-large",
  "extra extra large",
  "xxxl",
  "x-x-x-large",
  "extra extra extra large",
  "xxxxl",
  "x-x-x-x-large",
  "extra extra extra extra large",
  "xxxxxl",
  "x-x-x-x-x-large",
  "extra extra extra extra extra large"
] as const;

const sizesMapWithWeights = Object.fromEntries(
  Object.entries(Object.values(sizes)).map(([key, value]) => [value, +key])
);

const emptyLabel = "Please select...";

const getVariationOption = (
  variation: Pick<Variation, "id" | "option"> | undefined
) => {
  if (!variation) {
    return;
  }
  return {
    label: variation.option === "-" ? emptyLabel : variation.option,
    value: variation.id
  };
};

const existsVariationWithSizeAndColor = (
  variant: VariantV1,
  { color, size }: { color: string; size: string }
): boolean => {
  const colorVariationMatch = variant.variations.some(
    (variation) => variation.type === "Color" && variation.id === color
  );
  const sizeVariationMatch =
    colorVariationMatch &&
    variant.variations.some(
      (variation) => variation.type === "Size" && variation.id === size
    );
  return !!sizeVariationMatch;
};

const getVariationsByType = (
  variants: VariantV1[] | undefined,
  type: Variation["type"]
) => {
  return variants
    ? uniqBy(
        variants
          .map((variant) =>
            variant.variations.find((variation) => variation.type === type)
          )
          .filter(isTruthy),
        (variation) => variation.id
      )
        .map((variation) => {
          return getVariationOption({
            ...variation
          });
        })
        .filter(isTruthy)
        .sort((a, b) => {
          if (type === "Size") {
            if (a.label === emptyLabel) {
              return -1;
            }
            if (isNumeric(a.label) && isNumeric(b.label)) {
              return parseFloat(a.label) - parseFloat(b.label);
            }
            const aWeight = sizesMapWithWeights[a.label.toLowerCase().trim()];
            const bWeight = sizesMapWithWeights[b.label.toLowerCase().trim()];
            if (aWeight !== undefined && bWeight !== undefined) {
              return aWeight < bWeight ? -1 : 1;
            }
            if (aWeight !== undefined) {
              return -1;
            }
            if (bWeight !== undefined) {
              return 1;
            }
            return a.label.localeCompare(b.label);
          }
          return a.label === emptyLabel ? -1 : a.label.localeCompare(b.label);
        })
    : [];
};

const getIsEmptyOption = (
  option: SelectDataProps<string> | undefined | null
): boolean => {
  return (
    !option ||
    !option.label ||
    !option.value ||
    option.label === "-" ||
    option.value === "-" ||
    option.label === emptyLabel ||
    option.value === emptyLabel
  );
};

interface Props {
  selectedVariant: VariantV1;
  setSelectedVariant?: Dispatch<SetStateAction<VariantV1 | undefined>>;
  variants: VariantV1[];
  disabled?: boolean;
}

export default function VariationSelects({
  selectedVariant,
  setSelectedVariant,
  variants,
  disabled,
  ...rest
}: Props) {
  const [dropdownVariant, setDropdownVariant] = useState<
    Pick<VariantV1, "variations"> | undefined
  >(selectedVariant);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [lastChangedVariation, setLastChangedVariation] = useState<
    "" | "color" | "size"
  >("");
  const showDashInColor = lastChangedVariation === "size" && !!errorMessage;
  const showDashInSize = lastChangedVariation === "color" && !!errorMessage;
  return (
    <Formik
      initialValues={{
        color:
          showDashInColor || !dropdownVariant
            ? getVariationOption({ id: "", option: emptyLabel })
            : getVariationOption(
                dropdownVariant.variations.find(
                  (variation) => variation.type === "Color"
                )
              ),
        size:
          showDashInSize || !dropdownVariant
            ? getVariationOption({ id: "", option: emptyLabel })
            : getVariationOption(
                dropdownVariant.variations.find(
                  (variation) => variation.type === "Size"
                )
              )
      }}
      enableReinitialize
      onSubmit={(values) => {
        const selectedVariant = variants.find((variant) =>
          existsVariationWithSizeAndColor(variant as VariantV1, {
            color: values.color?.value || "",
            size: values.size?.value || ""
          })
        );
        setErrorMessage("");
        if (selectedVariant) {
          setSelectedVariant?.(selectedVariant as VariantV1);
          setDropdownVariant(selectedVariant);
        } else {
          setDropdownVariant({
            variations: [
              {
                id: values.color?.value || "",
                type: "Color",
                option: values.color?.label || ""
              },
              {
                id: values.size?.value || "",
                type: "Size",
                option: values.size?.label || ""
              }
            ]
          });
          const isEmptyColor = getIsEmptyOption(values.color);
          const isEmptySize = getIsEmptyOption(values.size);
          if (!isEmptyColor && !isEmptySize) {
            const color = values.color?.label || "-";
            const size = values.size?.label || "-";
            setErrorMessage(
              `The variant with color '${color}' and size '${size}' does not exist. Please select another combination.`
            );
          } else if (isEmptyColor && isEmptySize) {
            setErrorMessage(
              `This combination does not exist, please select another one.`
            );
          }
        }
      }}
    >
      {({ submitForm }) => {
        return (
          <Form {...rest}>
            <Grid gap="2rem" margin="1rem 0 2.5rem 0">
              <Select
                name="color"
                options={getVariationsByType(variants, "Color")}
                placeholder="Color"
                label="Color:"
                onChange={() => {
                  setLastChangedVariation("color");
                  submitForm();
                }}
                disabled={disabled}
              />
              <Select
                name="size"
                options={getVariationsByType(variants, "Size")}
                placeholder="Size"
                label="Size:"
                onChange={() => {
                  setLastChangedVariation("size");
                  submitForm();
                }}
                disabled={disabled}
              />
            </Grid>
            {errorMessage && (
              <SimpleError style={{ marginBottom: "2.5rem" }}>
                {errorMessage}
              </SimpleError>
            )}
          </Form>
        );
      }}
    </Formik>
  );
}
