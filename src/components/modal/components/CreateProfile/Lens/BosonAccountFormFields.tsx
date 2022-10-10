/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@bosonprotocol/react-kit";
import { useField } from "formik";
import { useEffect } from "react";
import { useAccount } from "wagmi";

import { colors } from "../../../../../lib/styles/colors";
import { useSellers } from "../../../../../lib/utils/hooks/useSellers";
import { FormField, Input } from "../../../../form";
import Tooltip from "../../../../tooltip/Tooltip";
import Grid from "../../../../ui/Grid";
import { useModal } from "../../../useModal";
import ProfileMultiSteps from "./ProfileMultiSteps";

interface Props {
  onBackClick: () => void;
  isExistingProfile: boolean;
  setStepBasedOnIndex: (index: number) => void;
}

export default function BosonAccountFormFields({
  onBackClick,
  setStepBasedOnIndex,
  isExistingProfile
}: Props) {
  const [fieldSecondaryRoyalties, , helpersSecondaryRoyalties] =
    useField("secondaryRoyalties");
  const [fieldAddressForRoyaltyPayment, , helpersAddressForRoyaltyPayment] =
    useField("addressForRoyaltyPayment");
  const { address } = useAccount();
  const { data: admins } = useSellers({
    admin: address
  });
  const { data: clerks } = useSellers({
    clerk: address
  });
  const { data: operator } = useSellers({
    operator: address
  });
  const { data: treasuries } = useSellers({
    treasury: address
  });
  const seller = admins?.[0] || clerks?.[0] || operator?.[0] || treasuries?.[0];
  const royaltyPercentage = "";
  const royaltyAddress = "";
  const alreadyHasRoyaltiesDefined = !!royaltyAddress && !!royaltyPercentage; // TODO: seller.royalties;
  const { updateProps, store } = useModal();
  useEffect(() => {
    updateProps<"CREATE_PROFILE">({
      ...store,
      modalProps: {
        ...store.modalProps,
        headerComponent: (
          <ProfileMultiSteps
            createOrSelect={isExistingProfile ? "select" : "create"}
            activeStep={2}
            createOrViewRoyalties={
              alreadyHasRoyaltiesDefined ? "view" : "create"
            }
            key="BosonAccountFormFields"
            setStepBasedOnIndex={setStepBasedOnIndex}
          />
        )
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (alreadyHasRoyaltiesDefined) {
      helpersSecondaryRoyalties.setValue(royaltyPercentage);
      helpersAddressForRoyaltyPayment.setValue(royaltyAddress);
    }
  }, [
    alreadyHasRoyaltiesDefined,
    helpersAddressForRoyaltyPayment,
    helpersSecondaryRoyalties
  ]);
  return (
    <>
      <FormField
        title="Secondary Royalties"
        subTitle="Boson Protocol implements EIP-2981 which enables secondary royalties across NFT marketplaces."
        required
      >
        <Grid>
          <Grid
            style={{
              background: colors.lightGrey,
              border: `1px solid ${colors.border}`
            }}
            gap="0.5rem"
            justifyContent="space-between"
          >
            <Grid flexDirection="column">
              <Input
                name="secondaryRoyalties"
                placeholder=""
                disabled={alreadyHasRoyaltiesDefined}
                style={{
                  border: "none",
                  textAlign: "right"
                }}
                type="number"
                step="0.01"
              />
            </Grid>
            <div style={{ padding: "1rem" }}>%</div>
          </Grid>
          <Tooltip content="Royalties are limited to 10%" size={16} />
        </Grid>
      </FormField>
      <FormField
        title="Address for Royalty payment"
        subTitle="This address will receive royalty payments"
      >
        <Input
          name="addressForRoyaltyPayment"
          placeholder="f.e. 0x930fn3jr9dnW..."
          disabled={
            !fieldSecondaryRoyalties.value || alreadyHasRoyaltiesDefined
          }
        />
      </FormField>
      <Grid justifyContent="flex-start" gap="2rem">
        <Button variant="accentInverted" type="button" onClick={onBackClick}>
          Back
        </Button>
        <Button
          variant="primaryFill"
          type="submit"
          disabled={
            false
            // TODO: !alreadyHasRoyaltiesDefined &&
            // (!fieldSecondaryRoyalties.value ||
            //   !fieldAddressForRoyaltyPayment.value)
          }
        >
          Next
        </Button>
      </Grid>
    </>
  );
}
