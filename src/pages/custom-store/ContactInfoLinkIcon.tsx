import { At, MapPin, Phone } from "phosphor-react";

export type ContactInfoLinkIconValues = "phone" | "email" | "address";

interface Props {
  icon: ContactInfoLinkIconValues | undefined | null;
  size?: number;
}

export function ContactInfoLinkIcon({ icon, size }: Props) {
  switch (icon) {
    case "phone":
      return <Phone size={size} />;
    case "email":
      return <At size={size} />;
    case "address":
      return <MapPin size={size} />;
    default:
      return null;
  }
}
