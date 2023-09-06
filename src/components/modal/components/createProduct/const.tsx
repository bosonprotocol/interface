import {
  CirclesThreePlus,
  Megaphone,
  Storefront,
  UserCirclePlus
} from "phosphor-react";
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

import { SellerLandingPageParameters } from "../../../../lib/routing/parameters";
import {
  BosonRoutes,
  SellerCenterRoutes
} from "../../../../lib/routing/routes";
import { colors } from "../../../../lib/styles/colors";
import { To } from "../../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import { getSellerCenterPath } from "../../../seller/paths";

export enum QueryParamStep {
  profile = "profile",
  product = "product",
  tokenproduct = "tokenproduct",
  dcl = "dcl",
  store = "store",
  sl = "sl"
}

export enum VariableStep {
  CreateYourProfile = "CreateYourProfile",
  CreateYourProducts = "CreateYourProducts",
  CreateYourTokenGatedProduct = "CreateYourTokenGatedProduct",
  SetupYourDCLStore = "SetupYourDCLStore",
  SetupYourWeb3Store = "SetupYourWeb3Store",
  AddSalesChannels = "AddSalesChannels"
}

export const queryParamToVariableStep = {
  [QueryParamStep.profile]: VariableStep.CreateYourProfile,
  [QueryParamStep.product]: VariableStep.CreateYourProducts,
  [QueryParamStep.tokenproduct]: VariableStep.CreateYourTokenGatedProduct,
  [QueryParamStep.dcl]: VariableStep.SetupYourDCLStore,
  [QueryParamStep.store]: VariableStep.SetupYourWeb3Store,
  [QueryParamStep.sl]: VariableStep.AddSalesChannels
} as const;

export const variableStepToQueryParam = {
  [VariableStep.CreateYourProfile]: QueryParamStep.profile,
  [VariableStep.CreateYourProducts]: QueryParamStep.product,
  [VariableStep.CreateYourTokenGatedProduct]: QueryParamStep.tokenproduct,
  [VariableStep.SetupYourDCLStore]: QueryParamStep.dcl,
  [VariableStep.SetupYourWeb3Store]: QueryParamStep.store,
  [VariableStep.AddSalesChannels]: QueryParamStep.sl
};

export const variableStepMap = {
  [VariableStep.CreateYourProfile]: {
    key: VariableStep.CreateYourProfile,
    icon: <UserCirclePlus color={colors.secondary} />,
    title: "Create your profile",
    body: "Creating a profile helps establish your branding and Web3 presence in dComemrce",
    to: { pathname: "" }
  },
  [VariableStep.CreateYourTokenGatedProduct]: {
    key: VariableStep.CreateYourTokenGatedProduct,
    icon: <CirclesThreePlus color={colors.secondary} />,
    title: "Setup a token-gated offer",
    body: "Create a physical or phygital product, enriching it with details, such as images and videos",
    to: {
      pathname: SellerCenterRoutes.CreateProduct,
      search: [[SellerLandingPageParameters.sltokenGated, "1"]]
    }
  },
  [VariableStep.SetupYourDCLStore]: {
    key: VariableStep.SetupYourDCLStore,
    icon: <Megaphone color={colors.secondary} />,
    title: "Setup your DCL store",
    body: "Configure your metaverse store on your own land in DCL or on Boson Boulevard.",
    to: { pathname: SellerCenterRoutes.DCL }
  },
  [VariableStep.SetupYourWeb3Store]: {
    key: VariableStep.SetupYourWeb3Store,
    icon: <Storefront color={colors.secondary} />,
    title: "Setup your Web3 store",
    body: "Build and customize your own bespoke decentralized commerce storefront",
    to: { pathname: BosonRoutes.CreateStorefront }
  },
  [VariableStep.AddSalesChannels]: {
    key: VariableStep.AddSalesChannels,
    icon: <Megaphone color={colors.secondary} />,
    title: "Add sales channels",
    body: "Choose one or many channels where your products will be shown, selling everywhere!",
    to: { pathname: getSellerCenterPath("Sales Channels") }
  },
  [VariableStep.CreateYourProducts]: {
    key: VariableStep.CreateYourProducts,
    icon: <CirclesThreePlus color={colors.secondary} />,
    title: "Create your products",
    body: "Create a physical or digi-physical product, enriching it with details, such as images and videos.",
    to: { pathname: SellerCenterRoutes.CreateProduct }
  }
};

export const flowsTitles = {
  "Set-up a decentralized Web3 Commerce store": true,
  "Launch a Metaverse commerce store": true,
  "Enable token-gated dCommerce": true,
  "Create Physicals": true,
  "Create Phygitals": true,
  "Create token-gated offers": true,
  "Sell on NFT Marketplaces": true
} as const;

export const getSlTitle = (searchParams: URLSearchParams): string => {
  const candidateTitle =
    searchParams.get(SellerLandingPageParameters.sltitle) ?? "";
  if (
    candidateTitle &&
    flowsTitles[candidateTitle as keyof typeof flowsTitles]
  ) {
    return candidateTitle;
  }
  return "";
};

export const getVariableStepsFromQueryParams = (
  searchParams: URLSearchParams
): VariableStep[] => {
  const steps = (searchParams.get(SellerLandingPageParameters.slsteps) ?? "")
    .split(",")
    .filter((step): step is QueryParamStep =>
      Object.values(QueryParamStep).includes(step as QueryParamStep)
    )
    .map((qp) => queryParamToVariableStep[qp]);
  return steps;
};

export const getNextStepFromQueryParams = (
  searchParams: URLSearchParams,
  currentStep: QueryParamStep
): { nextStep: QueryParamStep; nextStepInNumber: number } | null => {
  const steps = (searchParams.get(SellerLandingPageParameters.slsteps) ?? "")
    .split(",")
    .filter((step): step is QueryParamStep =>
      Object.values(QueryParamStep).includes(step as QueryParamStep)
    );
  const currentIndexStep = steps.indexOf(currentStep);
  const nextIndex = currentIndexStep + 1;
  if (currentIndexStep === -1 || nextIndex >= steps.length) {
    return null;
  }

  const nextStep = steps[nextIndex];
  return { nextStep, nextStepInNumber: nextIndex };
};

type NextStep = NonNullable<
  ReturnType<typeof getNextStepFromQueryParams>
>["nextStep"];
export const getNextButtonText = (nextStep: NextStep): string => {
  const nextVariableStep = queryParamToVariableStep[nextStep];
  const title = variableStepMap[nextVariableStep].title;
  const titleWithFirstLowerCase = title[0].toLowerCase() + title.substring(1);
  return `Continue to ${titleWithFirstLowerCase}`;
};

export const getNextTo = (
  nextStep: NextStep
): Omit<To, "search"> & { search?: string[][] } => {
  const nextVariableStep = queryParamToVariableStep[nextStep];
  return variableStepMap[nextVariableStep].to;
};

export const useRemoveLandingQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  return useCallback(() => {
    Object.keys(SellerLandingPageParameters).forEach((key) => {
      searchParams.delete(key);
    });
    setSearchParams(searchParams);
  }, [searchParams, setSearchParams]);
};
