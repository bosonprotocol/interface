import { useFormikContext } from "formik";
import React, { ReactNode, useEffect } from "react";

import { FormField, Input, Select } from "../../../form";
import { Grid } from "../../../ui/Grid";
import { FormType } from "./form";

type PremintVouchersFormProps = {
  isRangeReserved: boolean;
  availableQuantity: number;
  alreadyMinted?: number;
  children: ReactNode;
  onValidityChanged?: (isValid: boolean) => void;
};

export const PremintVouchersForm: React.FC<PremintVouchersFormProps> = ({
  isRangeReserved,
  alreadyMinted = 0,
  availableQuantity,
  children,
  onValidityChanged
}) => {
  const { values, isValid, errors } = useFormikContext<FormType>();
  useEffect(() => {
    if (onValidityChanged) {
      if (!isValid) {
        console.log("Form errors: ", errors);
      }
      onValidityChanged(isValid);
    }
  }, [isValid, onValidityChanged, errors]);
  return (
    <Grid flexDirection="column" gap="2rem" alignItems="flex-end">
      <FormField
        title="Recipient"
        subTitle="If the voucher shall be minted to the Seller wallet OR the Voucher contract itself. "
      >
        <Select
          name="to"
          options={[
            {
              label: "seller wallet",
              value: "seller"
            },
            {
              label: "voucher contract",
              value: "contract"
            }
          ]}
          disabled={isRangeReserved}
        />
      </FormField>
      <FormField
        title="Range Length"
        subTitle={
          isRangeReserved
            ? `A range of ${values.rangeLength} Vouchers has been reserved.`
            : "The length of the range to reserve (= max number of vouchers that can be minted)."
        }
      >
        {!isRangeReserved && (
          <div>
            <Input
              placeholder="Range length"
              name="rangeLength"
              type="number"
              min={availableQuantity > 0 ? "1" : "0"}
              step="1"
              max={`${availableQuantity}`}
            />
          </div>
        )}
      </FormField>
      <FormField
        title="Nb of Vouchers to Premint"
        subTitle={
          isRangeReserved
            ? `The number of vouchers to premint (already minted: ${alreadyMinted}).`
            : "A vouchers range should be reserved before preminting."
        }
      >
        {isRangeReserved && (
          <div>
            <Input
              placeholder="Nb of Vouchers"
              name="premintQuantity"
              type="number"
              min={values.rangeLength - alreadyMinted > 0 ? "1" : "0"}
              step="1"
              max={values.rangeLength - alreadyMinted}
            />
          </div>
        )}
      </FormField>
      {children}
    </Grid>
  );
};
