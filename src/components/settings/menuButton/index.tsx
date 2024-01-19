import { ReactComponent as Settings } from "assets/svg/settings.svg";
import Grid from "components/ui/Grid";
import Typography from "components/ui/Typography";
import { colors } from "lib/styles/colors";
import validateUserSlippageTolerance, {
  SlippageValidationResult
} from "lib/utils/validateUserSlippageTolerance";
import { useUserSlippageTolerance } from "state/user/hooks";
import { SlippageTolerance } from "state/user/types";
import styled from "styled-components";

const Icon = styled(Settings)`
  height: 24px;
  width: 24px;
  > * {
    fill: ${colors.black};
  }
`;

const Button = styled.button<{ isActive: boolean }>`
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  cursor: pointer;
  outline: none;

  &:not([disabled]):hover {
    opacity: 0.7;
  }

  ${({ isActive }) => isActive && `opacity: 0.7`}
`;

const IconContainer = styled(Grid)`
  padding: 6px 12px;
  border-radius: 16px;
`;

const IconContainerWithSlippage = styled(IconContainer)<{
  displayWarning?: boolean;
}>`
  /* TODO: div {
    color: ${({ theme, displayWarning }) =>
    displayWarning ? theme.accentWarning : colors.lightGrey};
  }

  background-color: ${({ theme, displayWarning }) =>
    displayWarning ? theme.accentWarningSoft : theme.backgroundModule}; */
`;

const ButtonContent = () => {
  const [userSlippageTolerance] = useUserSlippageTolerance();

  if (userSlippageTolerance === SlippageTolerance.Auto) {
    return (
      <IconContainer>
        <Icon />
      </IconContainer>
    );
  }

  const isInvalidSlippage =
    validateUserSlippageTolerance(userSlippageTolerance) !==
    SlippageValidationResult.Valid;

  return (
    <IconContainerWithSlippage
      data-testid="settings-icon-with-slippage"
      gap="sm"
      displayWarning={isInvalidSlippage}
    >
      <Typography>
        <>{userSlippageTolerance.toFixed(2)}% slippage</>
      </Typography>
      <Icon />
    </IconContainerWithSlippage>
  );
};

export default function MenuButton({
  disabled,
  onClick,
  isActive
}: {
  disabled: boolean;
  onClick: () => void;
  isActive: boolean;
}) {
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      isActive={isActive}
      id="open-settings-dialog-button"
      data-testid="open-settings-dialog-button"
      aria-label={`Transaction Settings`}
    >
      <ButtonContent />
    </Button>
  );
}
