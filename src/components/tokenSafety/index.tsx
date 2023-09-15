import { Token } from "@uniswap/sdk-core";
import { CopyButton } from "components/form/Field.styles";
import CurrencyLogo from "components/logo/CurrencyLogo";
import TokenSafetyLabel from "components/tokenSafety/TokenSafetyLabel";
import Button from "components/ui/Button";
import { AutoColumn } from "components/ui/column/index";
import Typography from "components/ui/Typography";
import {
  checkWarning,
  displayWarningLabel,
  getWarningCopy,
  NotFoundWarning,
  TOKEN_SAFETY_ARTICLE,
  Warning
} from "lib/constants/tokenSafety";
import { colors } from "lib/styles/colors";
import copyToClipboard from "lib/utils/copyToClipboard";
import { ExplorerDataType, getExplorerLink } from "lib/utils/getExplorerLink";
import { useToken } from "lib/utils/hooks/Tokens";
import { ArrowSquareOut as LinkIconFeather, Copy } from "phosphor-react";
import { lighten } from "polished";
import { useAddUserToken } from "state/user/hooks";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  flex-flow: column;
  align-items: center;
`;

const Container = styled.div`
  width: 100%;
  padding: 32px 40px;
  display: flex;
  flex-flow: column;
  align-items: center;
`;

const LogoContainer = styled.div`
  display: flex;
  gap: 16px;
`;

const ShortColumn = styled(AutoColumn)`
  margin-top: 10px;
`;

const InfoText = styled(Typography)`
  display: block;
  padding: 0 12px 0 12px;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
`;

const StyledButton = styled(Button)`
  margin-top: 24px;
  width: 100%;
  font-weight: 600;
`;

const StyledCancelButton = styled(Button)`
  margin-top: 16px;
  font-weight: 600;
  font-size: 14px;
`;

const StyledCloseButton = styled(StyledButton)`
  background-color: ${colors.lightGrey};
  /* color: ${({ theme }) => theme.textPrimary}; */

  &:hover {
    background-color: ${colors.lightGrey};
    opacity: 0.6;
    transition: opacity 250ms ease;
  }
`;

const Buttons = ({
  warning,
  onContinue,
  onCancel,
  onBlocked,
  showCancel
}: {
  warning: Warning;
  onContinue?: () => void;
  onCancel: () => void;
  onBlocked?: () => void;
  showCancel?: boolean;
}) => {
  return warning.canProceed ? (
    <>
      <StyledButton onClick={onContinue}>
        {!displayWarningLabel(warning) ? <>Continue</> : <>I understand</>}
      </StyledButton>
      {showCancel && (
        <StyledCancelButton onClick={onCancel} theme="blank">
          Cancel
        </StyledCancelButton>
      )}
    </>
  ) : (
    <StyledCloseButton onClick={onBlocked ?? onCancel}>
      <>Close</>
    </StyledCloseButton>
  );
};

const SafetyLabel = ({ warning }: { warning: Warning }) => {
  return (
    <TokenSafetyLabel level={warning.level} canProceed={warning.canProceed}>
      {warning.message}
    </TokenSafetyLabel>
  );
};

// TODO: Replace color with stylesheet color
const LinkColumn = styled(AutoColumn)`
  width: 100%;
  margin-top: 16px;
  position: relative;
`;

const ExplorerContainer = styled.div`
  width: 100%;
  height: 32px;
  margin-top: 10px;
  font-size: 20px;
  background-color: ${colors.blue};
  color: ${lighten(0.5, colors.blue)};
  border-radius: 8px;
  padding: 2px 12px;
  display: flex;
  align-items: center;
  overflow: hidden;
`;

const ExplorerLinkWrapper = styled.div`
  display: flex;
  overflow: hidden;
  align-items: center;
  cursor: pointer;

  :hover {
    opacity: 0.6;
  }
  :active {
    opacity: 0.4;
  }
`;

const ExplorerLink = styled.div`
  display: block;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const ExplorerLinkIcon = styled(LinkIconFeather)`
  height: 16px;
  width: 18px;
  margin-left: 8px;
`;

const LinkIconWrapper = styled.div`
  justify-content: center;
  display: flex;
`;

function ExternalLinkIcon() {
  return (
    <LinkIconWrapper>
      <ExplorerLinkIcon />
    </LinkIconWrapper>
  );
}

function ExplorerView({ token }: { token: Token }) {
  if (token) {
    const explorerLink = getExplorerLink(
      token?.chainId,
      token?.address,
      ExplorerDataType.TOKEN
    );
    return (
      <ExplorerContainer>
        <ExplorerLinkWrapper
          onClick={() => window.open(explorerLink, "_blank")}
        >
          <ExplorerLink>{explorerLink}</ExplorerLink>
          <ExternalLinkIcon />
        </ExplorerLinkWrapper>
        <CopyButton
          onClick={async () => {
            await copyToClipboard(explorerLink);
          }}
        >
          <Copy size={14} />
        </CopyButton>
      </ExplorerContainer>
    );
  } else {
    return null;
  }
}

const StyledExternalLink = styled.a`
  font-size: unset;
  stroke: currentColor;
  font-weight: 600;
`;

export interface TokenSafetyProps {
  tokenAddress: string | null;
  secondTokenAddress?: string;
  onContinue: () => void;
  onCancel: () => void;
  onBlocked?: () => void;
  showCancel?: boolean;
}

export default function TokenSafety({
  tokenAddress,
  secondTokenAddress,
  onContinue,
  onCancel,
  onBlocked,
  showCancel
}: TokenSafetyProps) {
  const logos = [];
  const urls = [];

  const token1Warning = tokenAddress ? checkWarning(tokenAddress) : null;
  const token1 = useToken(tokenAddress);
  const token2Warning = secondTokenAddress
    ? checkWarning(secondTokenAddress)
    : null;
  const token2 = useToken(secondTokenAddress);

  const token1Unsupported = !token1Warning?.canProceed;
  const token2Unsupported = !token2Warning?.canProceed;

  // Logic for only showing the 'unsupported' warning if one is supported and other isn't
  if (
    token1 &&
    token1Warning &&
    (token1Unsupported || !(token2Warning && token2Unsupported))
  ) {
    logos.push(
      <CurrencyLogo currency={token1} size="48px" key={token1.address} />
    );
    urls.push(<ExplorerView token={token1} />);
  }
  if (
    token2 &&
    token2Warning &&
    (token2Unsupported || !(token1Warning && token1Unsupported))
  ) {
    logos.push(
      <CurrencyLogo currency={token2} size="48px" key={token2.address} />
    );
    urls.push(<ExplorerView token={token2} />);
  }

  const plural = logos.length > 1;
  // Show higher level warning if two are present
  let displayWarning = token1Warning;
  if (
    !token1Warning ||
    (token2Warning && token2Unsupported && !token1Unsupported)
  ) {
    displayWarning = token2Warning;
  }

  // If a warning is acknowledged, import these tokens
  const addToken = useAddUserToken();
  const acknowledge = () => {
    if (token1) {
      addToken(token1);
    }
    if (token2) {
      addToken(token2);
    }
    onContinue();
  };

  const { heading, description } = getWarningCopy(displayWarning, plural);
  const learnMoreUrl = (
    <StyledExternalLink href={TOKEN_SAFETY_ARTICLE}>
      <>Learn more</>
    </StyledExternalLink>
  );

  return displayWarning ? (
    <Wrapper data-testid="TokenSafetyWrapper">
      <Container>
        <AutoColumn>
          <LogoContainer>{logos}</LogoContainer>
        </AutoColumn>
        {displayWarningLabel(displayWarning) && (
          <ShortColumn>
            <SafetyLabel warning={displayWarning} />
          </ShortColumn>
        )}
        <ShortColumn>
          <InfoText>
            {heading} {description} {learnMoreUrl}
          </InfoText>
        </ShortColumn>
        <LinkColumn>{urls}</LinkColumn>
        <Buttons
          warning={displayWarning}
          onContinue={acknowledge}
          onCancel={onCancel}
          onBlocked={onBlocked}
          showCancel={showCancel}
        />
      </Container>
    </Wrapper>
  ) : (
    <Wrapper>
      <Container>
        <ShortColumn>
          <SafetyLabel warning={NotFoundWarning} />
        </ShortColumn>
        <ShortColumn>
          <InfoText>
            {heading} {description} {learnMoreUrl}
          </InfoText>
        </ShortColumn>
        <Buttons
          warning={NotFoundWarning}
          onCancel={onCancel}
          showCancel={true}
        />
      </Container>
    </Wrapper>
  );
}
