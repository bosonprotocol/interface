import { useFormikContext } from "formik";
import React from "react";

import { DCLLayout } from "../../styles";
import { FormType, LocationValues } from "../../validationSchema";
import { BosonLand } from "./BosonLand";
import { OwnLand } from "./OwnLand";

type ExecuteStepProps = {
  handleOnClose: () => void;
};

export const ExecuteStep: React.FC<ExecuteStepProps> = ({ handleOnClose }) => {
  const { values } = useFormikContext<FormType>();
  const location = values.location;
  return location === LocationValues.OwnLand ? (
    <OwnLand setSuccess={() => handleOnClose()} />
  ) : location === LocationValues.BosonLand ? (
    <BosonLand setSuccess={() => handleOnClose()} />
  ) : (
    <DCLLayout width="auto">
      Unavailable location please go back and select another one...
    </DCLLayout>
  );
};
