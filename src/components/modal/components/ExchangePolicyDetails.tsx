import { subgraph } from "@bosonprotocol/react-kit";
import { CaretDown, CaretUp } from "phosphor-react";
import { useState } from "react";

import { CONFIG } from "../../../lib/config";
import ContractualAgreement from "../../contractualAgreement/ContractualAgreement";
import DetailTable from "../../detail/DetailTable";
import License from "../../license/License";
import Grid from "../../ui/Grid";
import Typography from "../../ui/Typography";

interface Props {
  offerId?: string;
  offerData?: subgraph.OfferFieldsFragment;
}

export default function ExchangePolicyDetails({ offerId, offerData }: Props) {
  const exchangePolicy = {
    name: "Fair Exchange Policy",
    version: "v1.0",
    disputePeriod: 30,
    escalationPeriod: CONFIG.defaultDisputeResolutionPeriodDays,
    contractualAgreement: {
      title: "Commerce Agreement",
      version: "v1"
    },
    rNFTLicense: {
      title: "License Agreement",
      version: "v1"
    }
  };
  const [contractualAgreementVisible, setContractualAgreementVisible] =
    useState(false);
  const [licenseVisible, setLicenseVisible] = useState(false);

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
      value: (
        <Typography tag="p">
          {"Min. "}
          {exchangePolicy.disputePeriod}
          {" days"}
        </Typography>
      )
    },
    {
      name: "Escalation Period",
      info: undefined,
      value: (
        <Typography tag="p">
          {"Min. "}
          {exchangePolicy.escalationPeriod}
          {" days"}
        </Typography>
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
          <Typography tag="p">
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
