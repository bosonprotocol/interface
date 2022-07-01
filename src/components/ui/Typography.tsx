interface ITypography {
  children?: string | React.ReactNode;
  tag?: keyof JSX.IntrinsicElements;
  style?: React.CSSProperties;
  [x: string]: unknown;
}

const Typography: React.FC<ITypography> = ({
  tag: Wrapper = "div",
  children,
  style = {},
  ...props
}) => {
  return (
    <Wrapper style={style} {...props}>
      {children}
    </Wrapper>
  );
};

export default Typography;
