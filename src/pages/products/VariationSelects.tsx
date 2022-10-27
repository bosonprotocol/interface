import { Form, Formik } from "formik";
import uniqBy from "lodash.uniqby";
import { Dispatch, SetStateAction, useState } from "react";

import SimpleError from "../../components/error/SimpleError";
import { Select } from "../../components/form";
import { SelectDataProps } from "../../components/form/types";
import Grid from "../../components/ui/Grid";
import { isTruthy } from "../../lib/types/helpers";
import { VariantV1, Variation } from "./types";

const getVariationOption = (
  variation: Pick<Variation, "id" | "option"> | undefined
) => {
  if (!variation) {
    return;
  }
  return {
    label: variation.option,
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
  type: Variation["type"],
  selectedOtherType: SelectDataProps<string> | undefined
) => {
  // type = 'Color', variations = Red, Blue
  // selectedOtherType = 'S'
  // return = [{option: Red, type: Color, disabled: false}, {option: Blue, type: Color, disabled: true}]
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
          // const isVariationEnabled = variants.some((variant) =>
          //   existsVariationWithSizeAndColor(variant, {
          //     color:
          //       type === "Size" ? selectedOtherType?.value || "" : variation.id,
          //     size:
          //       type === "Color" ? selectedOtherType?.value || "" : variation.id
          //   })
          // );
          // console.log(
          //   "is there any variant in",
          //   variants,
          //   "with color=",
          //   type === "Size" ? selectedOtherType?.value || "" : variation.id,
          //   "and size=",
          //   type === "Color" ? selectedOtherType?.value || "" : variation.id
          // );

          return getVariationOption({
            ...variation
            // option: `${variation.option} ${
            //   isVariationEnabled ? "" : "(not applicable)"
            // }`,
            // disabled: false //!isVariationEnabled
          });
        })
        .filter(isTruthy)
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
    option.value === "-"
  );
};

interface Props {
  selectedVariant: VariantV1;
  setSelectedVariant: Dispatch<SetStateAction<VariantV1 | undefined>>;
  variants: VariantV1[];
}

export default function VariationSelects({
  selectedVariant,
  setSelectedVariant,
  variants
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
            ? getVariationOption({ id: "-", option: "-" })
            : getVariationOption(
                dropdownVariant.variations.find(
                  (variation) => variation.type === "Color"
                )
              ),
        size:
          showDashInSize || !dropdownVariant
            ? getVariationOption({ id: "-", option: "-" })
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
          setSelectedVariant(selectedVariant as VariantV1);
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

          if (
            !getIsEmptyOption(values.color) &&
            !getIsEmptyOption(values.size)
          ) {
            const color = values.color?.label || "";
            const size = values.size?.label || "";
            setErrorMessage(
              `The variant with color '${color}' and size '${size}' does not exist. Please select another combination.`
            );
          }
        }
      }}
    >
      {({ submitForm, values }) => {
        const { color: selectedColor, size: selectedSize } = values;
        return (
          <Form>
            <Grid gap="2rem" margin="1rem 0 2.5rem 0">
              <Select
                name="color"
                options={getVariationsByType(variants, "Color", selectedSize)}
                placeholder="Color"
                onChange={() => {
                  setLastChangedVariation("color");
                  submitForm();
                }}
              />
              <Select
                name="size"
                options={getVariationsByType(variants, "Size", selectedColor)}
                placeholder="Size"
                onChange={() => {
                  setLastChangedVariation("size");
                  submitForm();
                }}
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
