import { useFormikContext } from "formik";
import React, { useState } from "react";

import { DCLLayout } from "../../styles";
import { BosonLand } from "./BosonLand";
import { DCLSuccess } from "./DCLSuccess";
import { OwnLand } from "./OwnLand";

type ExecuteStepProps = {
  handleOnClose: () => void;
};

export const ExecuteStep: React.FC<ExecuteStepProps> = ({ handleOnClose }) => {
  const [isSuccess, setSuccess] = useState<boolean>(false);
  const { values } = useFormikContext<any>();
  const location = values.step1.location;
  return isSuccess ? (
    <DCLSuccess handleOnClose={handleOnClose} />
  ) : location === "own-land" ? (
    <OwnLand setSuccess={() => setSuccess(true)} />
  ) : location === "boson-land" ? (
    <BosonLand setSuccess={() => setSuccess(true)} />
  ) : (
    <DCLLayout width="auto">
      Unavailable location please go back and select another one...
    </DCLLayout>
  );
};
