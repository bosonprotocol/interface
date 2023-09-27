import { subgraph } from "@bosonprotocol/react-kit";
import { useConfigContext } from "components/config/ConfigContext";
import { isTruthy } from "lib/types/helpers";
import useProductByUuid, {
  ReturnUseProductByUuid
} from "lib/utils/hooks/product/useProductByUuid";
import uniqBy from "lodash.uniqby";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import {
  SellerHubQueryParameters,
  SellerLandingPageParameters
} from "../../../lib/routing/parameters";
import {
  clearLocalStorage,
  getItemFromStorage,
  removeItemInStorage,
  saveItemInStorage
} from "../../../lib/utils/hooks/useLocalStorage";
import { getOptionsCurrencies, ProductTypeValues, TypeKeys } from "./const";
import { initialValues as baseValues } from "./initialValues";
import type { CreateProductForm } from "./types";

const MAIN_KEY = "create-product";
export function useInitialValues() {
  const { config } = useConfigContext();
  const [searchParams] = useSearchParams();
  const isTokenGated = searchParams.get(
    SellerLandingPageParameters.sltokenGated
  );
  const fromProductUuid = searchParams.get(
    SellerHubQueryParameters.fromProductUuid
  );
  const cloneBaseValues = useMemo(
    () =>
      structuredClone({
        ...baseValues,
        coreTermsOfSale: {
          ...baseValues.coreTermsOfSale,
          currency: getOptionsCurrencies(config.envConfig)[0]
        }
      }),
    [config.envConfig]
  );
  const initialValues = useMemo(
    () => getItemFromStorage<CreateProductForm | null>(MAIN_KEY, null),
    []
  );

  const { data: product } = useProductByUuid(fromProductUuid, {
    enabled: !!fromProductUuid
  });

  const valuesFromExistingProduct: CreateProductForm | null | undefined =
    useMemo(() => {
      return loadExistingProduct<typeof cloneBaseValues>(
        product,
        cloneBaseValues
      );
    }, [product, cloneBaseValues]);

  const cloneInitialValues = useMemo(
    () =>
      initialValues
        ? structuredClone(initialValues)
        : ({} as Partial<NonNullable<typeof initialValues>>),
    [initialValues]
  );

  if (isTokenGated) {
    if (cloneBaseValues.productType) {
      cloneBaseValues.productType.tokenGatedOffer = "true";
    }
    if (cloneInitialValues.productType) {
      cloneInitialValues.productType.tokenGatedOffer = "true";
    }
  }

  return {
    shouldDisplayModal: cloneInitialValues !== null,
    base: cloneBaseValues,
    draft: cloneInitialValues,
    fromProductUuid: valuesFromExistingProduct,
    remove: removeItemInStorage,
    save: saveItemInStorage,
    clear: clearLocalStorage,
    key: MAIN_KEY
  };
}
function loadExistingProduct<T extends CreateProductForm>(
  productWithVariants: ReturnUseProductByUuid,
  cloneBaseValues: T
): CreateProductForm | undefined | null {
  if (!productWithVariants) {
    return;
  }

  const { product, variants = [] } = productWithVariants;
  const [firstOfferAndVariations] = variants;
  const { offer: firstOffer } = firstOfferAndVariations;
  return {
    ...cloneBaseValues,
    productType: {
      ...cloneBaseValues.productType,
      productType: product.details_offerCategory.toLowerCase(),
      productVariant:
        variants.length > 1
          ? ProductTypeValues.differentVariants
          : ProductTypeValues.oneItemType,
      tokenGatedOffer: firstOffer.condition ? "true" : "false"
    },
    productInformation: {
      ...cloneBaseValues.productInformation,
      productTitle: product.title,
      description: product.description,
      category: product.details_category,
      tags: product.details_tags ?? [],
      attributes: (
        firstOffer.metadata as subgraph.ProductV1MetadataEntity
      ).attributes?.map((attribute) => ({
        name: attribute.traitType,
        value: attribute.value ?? ""
      })),
      sku: product.identification_sKU,
      id: product.identification_productId,
      idType: product.identification_productIdType,
      brandName: product.productionInformation_brandName,
      manufacture: product.productionInformation_manufacturer,
      manufactureModelName:
        product.productionInformation_manufacturerPartNumber,
      partNumber: product.productionInformation_modelNumber,
      materials: product.productionInformation_materials
    },
    productVariants: {
      ...cloneBaseValues.productVariants,
      colors:
        uniqBy(
          variants
            .flatMap((variant) =>
              variant.variations
                .filter((variation) => variation.type === TypeKeys.Color)
                .map((variation) => variation.option)
                .filter((option) => option && option !== "-")
            )
            .filter(isTruthy),
          (string) => string
        ) ?? [],
      sizes:
        uniqBy(
          variants
            .flatMap((variant) =>
              variant.variations
                .filter((variation) => variation.type === TypeKeys.Size)
                .map((variation) => variation.option)
                .filter((option) => option && option !== "-")
            )
            .filter(isTruthy),
          (string) => string
        ) ?? [],
      variants
    },
    productVariantsImages: [
      ...(cloneBaseValues.productVariantsImages ?? []),

      variants.map((variant) => {
        return {
          productAnimation: {},
          productImages: {
            thumbnail: {
              src: variant.offer.metadata?.image
            },
            secondary: {},
            everyAngle: {},
            details: {},
            inUse: {},
            styledScene: {},
            sizeAndScale: {},
            more: {}
          }
        };
      })
    ]
  };
}
