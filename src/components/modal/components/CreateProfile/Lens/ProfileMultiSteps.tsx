import MultiSteps from "../../../../step/MultiSteps";
import Grid from "../../../../ui/Grid";

interface Props {
  createOrSelect: "create" | "select" | null;
  createOrViewRoyalties: "create" | "view" | null;
  activeStep: 0 | 1 | 2 | 3;
}

export default function ProfileMultiSteps({
  createOrSelect,
  createOrViewRoyalties,
  activeStep
}: Props) {
  return (
    <Grid justifyContent="space-evently">
      <MultiSteps
        data={[
          { steps: 1, name: "Create or Select Profile" },
          {
            steps: 1,
            name: `${
              createOrSelect === "create"
                ? "Create Profile"
                : createOrSelect === "select"
                ? "View Profile Details"
                : "Create or View Profile"
            }`
          },
          {
            steps: 1,
            name: `${
              createOrViewRoyalties === "create"
                ? "Create Royalties"
                : createOrViewRoyalties === "view"
                ? "View Royalties"
                : "Create or View Royalties"
            }`
          },
          { steps: 1, name: "Confirmation" }
        ]}
        active={activeStep}
      />
    </Grid>
  );
}
