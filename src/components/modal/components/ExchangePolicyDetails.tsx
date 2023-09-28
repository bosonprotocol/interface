import { offers, subgraph } from "@bosonprotocol/react-kit";
import { customisedExchangePolicy } from "lib/constants/policies";
import { getExchangePolicyName } from "lib/utils/policy/getExchangePolicyName";
import {
  CaretDown,
  CaretUp,
  CircleWavyQuestion,
  WarningCircle
} from "phosphor-react";
import { useState } from "react";

import { colors } from "../../../lib/styles/colors";
import ContractualAgreement from "../../contractualAgreement/ContractualAgreement";
import DetailTable from "../../detail/DetailTable";
import License from "../../license/License";
import Grid from "../../ui/Grid";
import Typography from "../../ui/Typography";

interface Props {
  offerId?: string;
  offerData?: subgraph.OfferFieldsFragment;
  exchangePolicyCheckResult?: offers.CheckExchangePolicyResult;
}

export default function ExchangePolicyDetails({
  offerId,
  offerData,
  exchangePolicyCheckResult
}: Props) {
  const isExchangePolicyValid =
    exchangePolicyCheckResult &&
    (exchangePolicyCheckResult.isValid ||
      !exchangePolicyCheckResult.errors.find(
        (error) => error.path === "metadata.exchangePolicy.template"
      ));
  const exchangePolicy = {
    name: exchangePolicyCheckResult?.isValid
      ? getExchangePolicyName(
          (offerData?.metadata as subgraph.ProductV1MetadataEntity)
            ?.exchangePolicy?.label
        )
      : customisedExchangePolicy,
    version: (offerData?.metadata as subgraph.ProductV1MetadataEntity)
      ?.exchangePolicy?.version
      ? "v" +
        (
          offerData?.metadata as subgraph.ProductV1MetadataEntity
        )?.exchangePolicy?.version?.toString()
      : "",
    disputePeriod: offerData?.disputePeriodDuration
      ? parseInt(offerData?.disputePeriodDuration) / (3600 * 24)
      : "unspecified",
    escalationPeriod: offerData?.resolutionPeriodDuration
      ? parseInt(offerData?.resolutionPeriodDuration) / (3600 * 24)
      : "unspecified",
    returnPeriod:
      (offerData?.metadata as subgraph.ProductV1MetadataEntity)?.shipping
        ?.returnPeriodInDays || "unspecified",
    contractualAgreement: {
      title: isExchangePolicyValid ? (
        "Commerce Agreement"
      ) : (
        <>
          <WarningCircle size={20}></WarningCircle>
          <span style={{ margin: "0 0 0 0.2rem" }}>{"Commerce Agreement"}</span>
        </>
      ),
      version: isExchangePolicyValid ? "v1" : "(Non-standard)",
      color: isExchangePolicyValid ? undefined : colors.orange
    },
    rNFTLicense: {
      title: "License Agreement",
      version: "v1"
    }
  };
  const [contractualAgreementVisible, setContractualAgreementVisible] =
    useState(false);
  const [licenseVisible, setLicenseVisible] = useState(false);

  const period = (
    periodValue: string | number,
    path: string,
    exchangePolicyCheckResult?: offers.CheckExchangePolicyResult
  ) => {
    const isValid =
      exchangePolicyCheckResult &&
      (exchangePolicyCheckResult.isValid ||
        !exchangePolicyCheckResult.errors.find((error) => error.path === path));
    return exchangePolicyCheckResult ? (
      isValid ? (
        <Typography tag="p">
          {periodValue}
          {" days"}
        </Typography>
      ) : (
        <Typography tag="p" color={colors.orange}>
          <WarningCircle size={20}></WarningCircle>
          {" " + periodValue + " days"}
        </Typography>
      )
    ) : (
      <Typography tag="p" color="purple">
        <CircleWavyQuestion size={20}></CircleWavyQuestion> Unknown
      </Typography>
    );
  };

  const tableDetails = [
    {
      name: "Policy name",
      info: undefined,
      value: (
        <Typography tag="p">
          {exchangePolicy.name} {exchangePolicy.version}
        </Typography>
      )
    },
    {
      name: "Dispute Period",
      info: undefined,
      value: period(
        exchangePolicy.disputePeriod,
        "disputePeriodDuration",
        exchangePolicyCheckResult
      )
    },
    {
      name: "Escalation Period",
      info: undefined,
      value: period(
        exchangePolicy.escalationPeriod,
        "resolutionPeriodDuration",
        exchangePolicyCheckResult
      )
    },
    {
      name: "Return Period",
      info: undefined,
      value: period(
        exchangePolicy.returnPeriod,
        "metadata.shipping.returnPeriodInDays",
        exchangePolicyCheckResult
      )
    }
  ];

  const contractualAgreementCollapsed = {
    name: "Buyer & Seller Agreement",
    info: (
      <>
        <Typography tag="h6">
          <b>{"Buyer & Seller Agreement"}</b>
        </Typography>
        <Typography tag="p">
          The Contractual Agreement sets out the terms relating to the exchange.
        </Typography>
      </>
    ),
    value: (
      <Grid justifyContent="flex-start" gap="0.5rem">
        <div
          onClick={() => {
            setContractualAgreementVisible(!contractualAgreementVisible);
          }}
          style={{ cursor: "pointer" }}
        >
          <Typography tag="p" color={exchangePolicy.contractualAgreement.color}>
            {exchangePolicy.contractualAgreement.title}{" "}
            {exchangePolicy.contractualAgreement.version}{" "}
          </Typography>
        </div>
        {contractualAgreementVisible ? (
          <CaretUp
            onClick={() => {
              setContractualAgreementVisible(!contractualAgreementVisible);
            }}
            style={{ cursor: "pointer" }}
            size={18}
          />
        ) : (
          <CaretDown
            onClick={() => {
              setContractualAgreementVisible(!contractualAgreementVisible);
            }}
            style={{ cursor: "pointer" }}
            size={18}
          />
        )}
      </Grid>
    )
  };
  const contractualAgreementExpanded = {
    ...contractualAgreementCollapsed,
    nextLine: (
      <ContractualAgreement
        offerId={offerId}
        offerData={offerData}
      ></ContractualAgreement>
    )
  };
  const licenseCollapsed = {
    name: "Redeemable NFT Terms",
    info: (
      <>
        <Typography tag="h6">
          <b>Redeemable NFT Terms</b>
        </Typography>
        <Typography tag="p">
          Terms for the BOSON Redeemable NFT (rNFT)
        </Typography>
      </>
    ),
    value: (
      <Grid justifyContent="flex-start" gap="0.5rem">
        <div
          onClick={() => {
            setLicenseVisible(!licenseVisible);
          }}
          style={{ cursor: "pointer" }}
        >
          <Typography tag="p">
            {exchangePolicy.rNFTLicense.title}{" "}
            {exchangePolicy.rNFTLicense.version}{" "}
          </Typography>
        </div>
        {licenseVisible ? (
          <CaretUp
            onClick={() => {
              setLicenseVisible(!licenseVisible);
            }}
            style={{ cursor: "pointer" }}
            size={18}
          />
        ) : (
          <CaretDown
            onClick={() => {
              setLicenseVisible(!licenseVisible);
            }}
            style={{ cursor: "pointer" }}
            size={18}
          />
        )}
      </Grid>
    )
  };
  const licenseExpanded = {
    ...licenseCollapsed,
    nextLine: <License offerId={offerId} offerData={offerData}></License>
  };
  return (
    <>
      <Grid flexDirection="column" alignItems="flex-start">
        <Typography tag="p">
          Boson Exchange Policies combine protocol variables and the underlying
          contractual agreement of an exchange into a standardized policy,
          ensuring fair terms and protection for both buyer and seller.
        </Typography>
        <DetailTable
          align
          noBorder
          data={[
            ...tableDetails,
            licenseVisible ? licenseExpanded : licenseCollapsed,
            contractualAgreementVisible
              ? contractualAgreementExpanded
              : contractualAgreementCollapsed
          ]}
          inheritColor={false}
        />
      </Grid>
    </>
  );
}
