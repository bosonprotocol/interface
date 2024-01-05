import React, {
  cloneElement,
  ReactElement,
  ReactNode,
  useMemo,
  useState
} from "react";

import SimpleError from "../../../error/SimpleError";
import Button from "../../../ui/Button";
import Grid from "../../../ui/Grid";
import { useModal } from "../../useModal";

interface ConfirmationModalProps {
  text: ReactNode;
  cta: ReactElement<{
    setError: React.Dispatch<React.SetStateAction<boolean>>;
  }>;
  children?: ReactNode;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  text,
  cta,
  children
}) => {
  const [hasError, setError] = useState<boolean>(false);
  const { hideModal } = useModal();
  const CTA = useMemo(() => {
    return cloneElement(cta, { setError: setError });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Grid flexDirection="column" alignItems="flex-start">
      {text}
      {children}
      {hasError && <SimpleError />}
      <Grid justifyContent="space-between" marginTop="1rem">
        <Button themeVal="blankSecondaryOutline" onClick={() => hideModal()}>
          Cancel
        </Button>
        {CTA}
      </Grid>
    </Grid>
  );
};
