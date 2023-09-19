import { CONFIG } from "lib/config";
import { sanitizeUrl } from "lib/utils/url";
import { MouseEventHandler, ReactNode } from "react";

type FiatLinkProps = {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement> | undefined;
};

export const FiatLink: React.FC<FiatLinkProps> = ({ children, onClick }) => {
  return (
    <a
      href={sanitizeUrl(CONFIG.moonpay.externalLink)}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: "inherit" }}
      onClick={onClick}
    >
      {children}
    </a>
  );
};
