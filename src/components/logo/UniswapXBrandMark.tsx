import Typography from "components/ui/Typography";

import UniswapXRouterLabel, {
  UnswapXRouterLabelProps
} from "../routerLabel/UniswapXRouterLabel";

type UniswapXBrandMarkProps = Omit<
  UnswapXRouterLabelProps,
  "children" | "fontWeight"
> & {
  fontWeight?: "bold";
};

export default function UniswapXBrandMark({
  fontWeight,
  ...props
}: UniswapXBrandMarkProps): JSX.Element {
  return (
    <UniswapXRouterLabel {...props}>
      <Typography
        $fontSize="inherit"
        {...(fontWeight === "bold" && {
          fontWeight: "500"
        })}
      >
        <>UniswapX</>
      </Typography>
    </UniswapXRouterLabel>
  );
}
