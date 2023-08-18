// ESLint reports `fill` is missing, whereas it exists on an SVGProps type
type SVGProps = React.SVGProps<SVGSVGElement> & {
  fill?: string;
  height?: string | number;
  width?: string | number;
  gradientId?: string;
};

export const CheckMarkIcon = (props: SVGProps) => (
  <svg {...props} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16.6693 5.33789L7.5026 14.3175L3.33594 10.2358"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
