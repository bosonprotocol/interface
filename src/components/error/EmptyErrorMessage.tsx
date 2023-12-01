import frame from "assets/frame.png";

import { ErrorMessage, ErrorMessageProps } from "./ErrorMessage";

type EmptyErrorMessageProps = Pick<
  ErrorMessageProps,
  "cta" | "title" | "message"
>;
export function EmptyErrorMessage({
  cta,
  title,
  message,
  ...rest
}: EmptyErrorMessageProps) {
  return (
    <ErrorMessage
      cta={cta}
      message={message}
      title={title}
      img={<img src={frame} alt={title} />}
      {...rest}
    />
  );
}
