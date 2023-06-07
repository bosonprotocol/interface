import { useFormikContext } from "formik";
import React, { useState } from "react";

import { DCLLayout } from "../../styles";
import { FormType, LocationValues } from "../../validationSchema";
import { BosonLand } from "./BosonLand";
import { DCLSuccess } from "./DCLSuccess";
import { OwnLand } from "./OwnLand";

type ExecuteStepProps = {
  handleOnClose: () => void;
};

export const ExecuteStep: React.FC<ExecuteStepProps> = ({ handleOnClose }) => {
  const [isSuccess, setSuccess] = useState<boolean>(false);
  const { values } = useFormikContext<FormType>();
  const location = values.step0.location;
  return isSuccess ? (
    <DCLSuccess handleOnClose={handleOnClose} />
  ) : location === LocationValues.OwnLand ? (
    <OwnLand setSuccess={() => setSuccess(true)} />
  ) : location === LocationValues.BosonLand ? (
    <BosonLand setSuccess={() => setSuccess(true)} />
  ) : (
    <DCLLayout width="auto">
      Unavailable location please go back and select another one...
    </DCLLayout>
  );
};
