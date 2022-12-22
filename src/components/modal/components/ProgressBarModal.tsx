import { colors } from "../../../lib/styles/colors";
import BosonButton from "../../ui/BosonButton";
import Grid from "../../ui/Grid";
import Typography from "../../ui/Typography";

interface Props {
  progress: number;
  text: string;
  onCancel?: () => void;
}

const ProgressBar = ({ progress }: { progress: Props["progress"] }) => {
  const containerStyles = {
    height: 20,
    width: "100%",
    backgroundColor: "#e0e0de",
    borderRadius: 50,
    margin: 50
  };

  const fillerStyles = {
    height: "100%",
    width: `${progress}%`,
    backgroundColor: colors.green,
    borderRadius: "inherit",
    textAlign: "right",
    transition: "width 1s ease-in-out"
  } as const;

  const labelStyles = {
    padding: 5,
    color: "white",
    fontWeight: "bold"
  };

  return (
    <div style={containerStyles}>
      <div style={fillerStyles}>
        <span style={labelStyles}>{`${progress}%`}</span>
      </div>
    </div>
  );
};

export default function ProgressBarModal({ progress, text, onCancel }: Props) {
  return (
    <Grid flexDirection="column" alignItems="center">
      <ProgressBar progress={progress} />
      {text && (
        <Typography
          fontWeight="600"
          $fontSize="1rem"
          lineHeight="150%"
          color={colors.darkGrey}
          margin="0.5rem 0 1.5rem 0"
        >
          {text}
        </Typography>
      )}
      {onCancel && (
        <BosonButton onClick={onCancel} variant="secondaryInverted">
          Cancel
        </BosonButton>
      )}
    </Grid>
  );
}
