import { CurrencyEth, MagnifyingGlass, Percent } from "phosphor-react";
import React from "react";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import { Input, Select } from "../form";
import { useThisForm } from "../product/utils/useThisForm";
import Typography from "../ui/Typography";

const DocumentsHeader = styled.div`
  margin-bottom: 3.125rem;
`;

const MarginContainer = styled.div`
  margin-bottom: 2rem;
  margin-top: 2rem;
`;

const ColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 25% 50% 20%;
  grid-gap: 0.9375rem;
  input {
    margin-top: 0.625rem;
  }
`;

const SingleColumn = styled.div`
  position: relative;
  &:nth-of-type(1),
  &:nth-of-type(2) {
    input {
      padding-left: 2.1875rem;
    }
  }
  input {
    position: relative;
  }
  .icon-left {
    position: absolute;
    margin-top: 1.6rem;
    left: 0.625rem;
    color: ${colors.darkGrey};
    fill: ${colors.darkGrey};
    font-weight: 400;
  }

  .icon-right {
    position: absolute;
    margin-top: 1.6rem;
    right: 0.625rem;
    color: ${colors.darkGrey};
    fill: ${colors.darkGrey};
    font-weight: 400;
  }
`;

const NextButton = styled.button`
  border: none;
  background: ${colors.lightGrey};
  color: ${colors.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border: none;
  padding: 1rem 2rem 1rem 2rem;
  font-size: 1rem;
  font-family: "Plus Jakarta Sans";
  text-align: left;
  margin-top: 1.5rem;
  font-weight: 600;
  width: min-content;
`;

const FlexContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

const SkipButton = styled.button`
  border: none;
  color: ${colors.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border: none;
  padding: 1rem 2rem 1rem 2rem;
  font-size: 1rem;
  font-family: "Plus Jakarta Sans";
  text-align: left;
  margin-top: 1.5rem;
  font-weight: 600;
  width: min-content;
  background: none;
`;

function MakeProposal({
  setCurrentStep,
  currentStep
}: {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  currentStep: number;
}) {
  const formValues = useThisForm();

  return (
    <div>
      <DocumentsHeader>
        <Typography fontWeight="600" fontSize="2rem">
          Make a proposal
        </Typography>
        <Typography fontSize="1.25rem" color={colors.darkGrey}>
          Here you can make a proposal to the seller on how you would like the
          issue to be resolved. Note that this proposal is binding and if the
          seller agrees to it, the proposal will be implemented automatically.
        </Typography>
      </DocumentsHeader>
      <Typography fontSize="1.5rem" color={colors.black} fontWeight="600">
        Type of proposal
      </Typography>
      <div>&nbsp;</div>
      <Select
        placeholder="Choose the type of proposal"
        name="proposalType"
        options={[
          {
            value: "first",
            label: "Refund"
          }
        ]}
        isClearable
      />
      {formValues.values?.proposalType &&
        formValues.values?.proposalType.value === "first" && (
          <>
            <MarginContainer>
              <Typography
                fontSize="1.5rem"
                color={colors.black}
                fontWeight="600"
                data-refundRequest
              >
                Refund request
              </Typography>
              <Typography fontSize="1rem" color={colors.darkGrey}>
                You will keep your purchased product and get a partial refund.
              </Typography>
            </MarginContainer>
            <ColumnGrid>
              <SingleColumn>
                <Typography
                  fontSize="1rem"
                  color={colors.black}
                  fontWeight="600"
                  data-refundRequest
                >
                  In escrow
                </Typography>
                <Typography
                  fontSize="0.75rem"
                  color={colors.black}
                  fontWeight="400"
                >
                  Item price + seller deposit
                </Typography>
                <Input name="inEscrow" placeholder="(~$1540)" />
                <MagnifyingGlass size={20} className="icon-left" />
              </SingleColumn>
              <SingleColumn>
                <Typography
                  fontSize="1rem"
                  color={colors.black}
                  fontWeight="600"
                >
                  Requested refund
                </Typography>
                <Typography
                  fontSize="0.75rem"
                  color={colors.black}
                  fontWeight="400"
                >
                  Request a specific amount as a refund.
                </Typography>
                <Input name="refundAmount" placeholder="0.26" />
                <MagnifyingGlass size={20} className="icon-left" />
                <CurrencyEth size={20} className="icon-right" />
              </SingleColumn>
              <SingleColumn>
                <Typography
                  fontSize="1rem"
                  color={colors.black}
                  fontWeight="600"
                >
                  Percentage
                </Typography>
                <Typography
                  fontSize="0.75rem"
                  color={colors.black}
                  fontWeight="400"
                >
                  Edit as %
                </Typography>
                <Input name="refundPercent" placeholder="20" />
                <Percent size={20} className="icon-right" weight="regular" />
              </SingleColumn>
            </ColumnGrid>
          </>
        )}
      <FlexContainer>
        <NextButton type="submit">Next</NextButton>
        <SkipButton
          type="button"
          onClick={() => {
            setCurrentStep(currentStep + 1);
          }}
        >
          Skip
        </SkipButton>
      </FlexContainer>
    </div>
  );
}

export default MakeProposal;
