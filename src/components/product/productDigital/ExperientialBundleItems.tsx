import { Grid } from "@bosonprotocol/react-kit";
import { FormField, Input } from "components/form";
import React from "react";
import { styled } from "styled-components";

import { experientialInfo } from "../utils";
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
          title={experientialInfo["experientialName"].displayKey}
          required
          subTitle="Use words people would search for when looking for your item."
        >
          <Input
            name={`${prefix}${experientialInfo["experientialName"].key}`}
            placeholder="Experience name"
          />
        </FormField>
        <FormField
          title={experientialInfo["experientialDescription"].displayKey}
          required
          subTitle="Describe the experience with as much detail as possible."
        >
          <Input
            name={`${prefix}${experientialInfo["experientialDescription"].key}`}
            placeholder="Experience description"
          />
        </FormField>
        <FormField
          title={
            experientialInfo["experientialWhatWillTheBuyerReceieve"].displayKey
          }
          required
          subTitle="Describe it as much as possible"
        >
          <Input
            name={`${prefix}${experientialInfo["experientialWhatWillTheBuyerReceieve"].key}`}
            placeholder=""
          />
        </FormField>
        <FormField
          title={
            experientialInfo[
              "experientialHowCanTheBuyerClaimAttendTheExperience"
            ].displayKey
          }
          required
          subTitle="Describe it as much as possible"
        >
          <Input
            name={`${prefix}${experientialInfo["experientialHowCanTheBuyerClaimAttendTheExperience"].key}`}
            placeholder=""
          />
        </FormField>
        <FormField
          title={
            experientialInfo["experientialHowWillTheBuyerReceiveIt"].displayKey
          }
          required
        >
          <Input
            placeholder=""
            name={`${prefix}${experientialInfo["experientialHowWillTheBuyerReceiveIt"].key}`}
          />
        </FormField>
        <FormField
          title={
            experientialInfo["experientialWhenWillItBeSentToTheBuyer"]
              .displayKey
          }
          required
        >
          <Input
            placeholder=""
            name={`${prefix}${experientialInfo["experientialWhenWillItBeSentToTheBuyer"].key}`}
          />
        </FormField>
        <FormField
          title={experientialInfo["experientialShippingInDays"].displayKey}
          required
        >
          <Input
            placeholder=""
            name={`${prefix}${experientialInfo["experientialShippingInDays"].key}`}
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
