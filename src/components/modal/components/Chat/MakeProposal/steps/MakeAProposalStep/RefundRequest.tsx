import { useFormikContext } from "formik";
import { useEffect } from "react";

import { Input } from "../../../../../../form";
import Grid from "../../../../../../ui/Grid";
import Typography from "../../../../../../ui/Typography";

export default function RefundRequest() {
  const { values, setFieldValue, errors } = useFormikContext<any>();
  useEffect(() => {
    if (!errors["values.refundPercentage"]) {
      setFieldValue("refundAmount", values.refundPercentage, true);
    }
    // if (!errors["values.refundAmount"]) {
    //   setFieldValue("refundPercentage", values.refundAmount, true);
    // }
  }, [values, errors, setFieldValue]);
  return (
    <>
      <Typography fontSize="1.5rem" fontWeight="600">
        Refund request
      </Typography>
      <Typography fontSize="1rem">
        You will keep your purchased product and get a partial refund.
      </Typography>
      <Grid gap="1rem" alignItems="flex-start">
        <Grid flexDirection="column">
          <Typography fontSize="1rem" fontWeight="600">
            In escrow
          </Typography>
          <Typography fontSize="0.75rem" fontWeight="400">
            Item price + seller diposit
          </Typography>
          <Input name="escrow" type="number" />
        </Grid>
        <Grid flexDirection="column">
          <Typography fontSize="1rem" fontWeight="600">
            Requested refund
          </Typography>
          <Typography fontSize="0.75rem" fontWeight="400">
            Request a specific amount as a refund
          </Typography>
          <Input name="refundAmount" type="number" />
        </Grid>
        <Grid flexDirection="column">
          <Typography fontSize="1rem" fontWeight="600">
            Percentage
          </Typography>
          <Typography fontSize="0.75rem" fontWeight="400">
            Edit as %
          </Typography>
          <Input name="refundPercentage" type="number" />
        </Grid>
      </Grid>
    </>
  );
}
