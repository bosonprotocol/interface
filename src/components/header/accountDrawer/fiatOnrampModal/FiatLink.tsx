import { CONFIG } from "lib/config";
import { sanitizeUrl } from "lib/utils/url";
import { ReactNode } from "react";

type FiatLinkProps = {
  children: ReactNode;
};

export const FiatLink: React.FC<FiatLinkProps> = ({ children }) => {
  return (
    <a
      href={sanitizeUrl(CONFIG.moonpay.externalLink)}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: "inherit" }}
    >
      {children}
    </a>
  );
};
