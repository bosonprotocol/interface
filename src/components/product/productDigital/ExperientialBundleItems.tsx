import { Grid } from "@bosonprotocol/react-kit";
import { FormField, Input } from "components/form";
import React from "react";
import { styled } from "styled-components";

import { Delete } from "./styles";
const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: start;
  gap: 1rem;

  > * {
    flex: 1 1 100%;
    margin: initial;
  }
`;
type ExperientialBundleItemsProps = {
  prefix: string;
  showDeleteButton: boolean;
  bundleItemsError: JSX.Element | null;
  onClickDelete: () => void;
};

export const ExperientialBundleItems: React.FC<
  ExperientialBundleItemsProps
> = ({ prefix, showDeleteButton, bundleItemsError, onClickDelete }) => {
  return (
    <Grid flexDirection="column" marginBottom="4rem">
      <Wrapper>
        <FormField
          title="Experience name"
          required
          subTitle="Use words people would search for when looking for your item."
        >
          <Input
            name={`${prefix}experientialName`}
            placeholder="Experience name"
          />
        </FormField>
        <FormField
          title="Description of experience"
          required
          subTitle="Describe the experience with as much detail as possible."
        >
          <Input
            name={`${prefix}experientialDescription`}
            placeholder="Experience description"
          />
        </FormField>
        <FormField
          title="What will the buyer receive in order to access the experience?"
          required
          subTitle="Describe it as much as possible"
        >
          <Input
            name={`${prefix}experientialWhatWillTheBuyerReceieve`}
            placeholder=""
          />
        </FormField>
        <FormField
          title="How can a buyer claim / attend the experience?"
          required
          subTitle="Describe it as much as possible"
        >
          <Input
            name={`${prefix}experientialHowCanTheBuyerClaimAttendTheExperience`}
            placeholder=""
          />
        </FormField>
        <FormField title="How will the Buyer receive the access pass?">
          <Input
            placeholder=""
            name={`${prefix}experientialHowWillTheBuyerReceiveIt`}
          />
        </FormField>
        <FormField title="When will it be sent to the buyer?">
          <Input
            placeholder=""
            name={`${prefix}experientialWhenWillItBeSentToTheBuyer`}
          />
        </FormField>
        <FormField title="Shipping in days">
          <Input
            placeholder=""
            name={`${prefix}experientialShippingInDays`}
            type="number"
          />
        </FormField>
        {showDeleteButton && (
          <FormField title="Action">
            <Delete
              size={18}
              style={{
                gridColumn: "delete",
                gridRow: "delete"
              }}
              onClick={onClickDelete}
            />
          </FormField>
        )}
      </Wrapper>
      {bundleItemsError}
    </Grid>
  );
};
