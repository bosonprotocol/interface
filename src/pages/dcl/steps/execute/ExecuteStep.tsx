import { useFormikContext } from "formik";
import React, { useState } from "react";

import { useCurrentSellers } from "../../../../lib/utils/hooks/useCurrentSellers";
import { CongratulationsType } from "../../../create-product/congratulations/Congratulations";
import { CongratulationsPage } from "../../../create-product/congratulations/CongratulationsPage";
import { DCLLayout } from "../../styles";
import { FormType, LocationValues } from "../../validationSchema";
import { BosonLand } from "./BosonLand";
import { OwnLand } from "./OwnLand";

export const ExecuteStep: React.FC = () => {
  const { sellers } = useCurrentSellers();
  const sellerId = sellers[0]?.id;
  const { values } = useFormikContext<FormType>();
  const location = values.location;
  const [isSuccess, setSuccess] = useState<boolean>(false);
  return isSuccess && sellerId ? (
    <CongratulationsPage
      sellerId={sellerId}
      type={CongratulationsType.Boulevard}
    />
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
