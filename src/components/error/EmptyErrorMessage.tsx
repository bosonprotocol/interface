import frame from "assets/frame.png";

import { ErrorMessage, ErrorMessageProps } from "./ErrorMessage";

type EmptyErrorMessage = Pick<ErrorMessageProps, "cta" | "title" | "message">;
export function EmptyErrorMessage({
  cta,
  title,
  message,
  ...rest
}: EmptyErrorMessage) {
  return (
    <ErrorMessage
      cta={cta}
      message={message}
      title={title}
      img={<img src={frame} alt={`${title} image`} />}
      {...rest}
    />
  );
}
