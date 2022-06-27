interface ITypography {
  children?: string | React.ReactNode;
  tag?: keyof JSX.IntrinsicElements;
  [x: string]: unknown;
}

const Typography: React.FC<ITypography> = ({
  tag: Wrapper = "div",
  children,
  ...props
}) => {
  return <Wrapper {...props}>{children}</Wrapper>;
};

export default Typography;
