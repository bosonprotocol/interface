import styled from "styled-components";

import { colors } from "../../../lib/styles/colors";

const SocialIconContainer = styled.div`
  display: flex;
  svg {
    color: ${colors.secondary};
  }
`;

const SocialIcon = styled.a<{ $isDisabled: boolean }>`
  margin-left: 1.5rem;
  cursor: ${({ $isDisabled }) => ($isDisabled ? "default" : "pointer")};
  pointer-events: ${({ $isDisabled }) => ($isDisabled ? "none" : "auto")};
`;

interface Props {
  icons: {
    id: number;
    icon: JSX.Element;
    isDisabled: boolean;
    href: string;
  }[];
}

function SocialIcons({ icons }: Props) {
  return (
    <SocialIconContainer>
      {icons.map(({ id, icon, isDisabled, href }) => {
        return (
          <SocialIcon key={id} href={href} $isDisabled={isDisabled}>
            {icon}
          </SocialIcon>
        );
      })}
    </SocialIconContainer>
  );
}

export default SocialIcons;
