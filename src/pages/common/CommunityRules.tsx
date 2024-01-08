/* eslint @typescript-eslint/no-var-requires: off */
import { defaultFontFamily } from "lib/styles/fonts";
import styled from "styled-components";

import Grid from "../../components/ui/Grid";
import Typography from "../../components/ui/Typography";
import { colors } from "../../lib/styles/colors";

const Wrapper = styled(Grid)`
  a {
    color: ${colors.secondary};
    text-decoration: none;
    transition: all 150ms ease-in-out;
    &:hover {
      color: ${colors.black};
      text-decoration: underline;
    }
  }
  em {
    text-decoration: underline;
  }

  ol[type] > li {
    margin: 0.25rem 0;
    > p {
      display: inline;
    }
  }
`;
const List = styled.ol`
  counter-reset: list-item;
  padding-left: 3rem;
  margin-bottom: 4rem;
  position: relative;
  > ol {
    margin-bottom: 0;
    li {
      margin: 0.75rem 0;
    }
  }

  > li {
    display: block;
    :first-child {
      margin-bottom: 2rem;
    }
    :not(:first-child) {
      margin: 2rem 0;
    }
    &:before {
      content: counters(list-item, ".") " ";
      counter-increment: list-item;
      position: absolute;
      margin-top: 0.25rem;
      left: 0;

      min-width: 2rem;
      display: inline-block;
      text-align: right;

      opacity: 0.375;
      font-size: 0.75rem;
      font-weight: 800;
    }
  }
`;

const Title = styled.h1`
  font-family: ${defaultFontFamily};
  display: inline-block;
  text-align: center;

  color: ${colors.secondary};
  margin: 4rem 0 1rem 0;
  font-weight: 800;
`;
const SubTitle = styled.h4`
  font-family: ${defaultFontFamily};
  display: inline-block;
  font-weight: 800;
  margin-bottom: 0.25rem;
`;
const Text = styled.p`
  font-family: ${defaultFontFamily};
  display: inline-block;
  margin: 0;
  + p {
    margin-top: 0.5rem;
  }
`;
const Margin = styled.span`
  width: 100%;
  display: block;
  height: 5rem;
`;
const Break = styled.br`
  width: 100%;
  height: 1rem;
  display: block;
`;
export default function CommunityRules() {
  return (
    <Wrapper flexDirection="column" alignItems="flex-start">
      <Margin />
      <Wrapper flexDirection="column">
        <Title>BOSON DAPP COMMUNITY RULES </Title>

        <Typography color={colors.grey} tag="p" fontWeight="400" margin="0">
          Last updated on 18 August 2023
        </Typography>
      </Wrapper>
      <Margin />
      <Text>
        Boson dApp (<a href="https://bosonapp.io/">https://bosonapp.io/</a>, the
        “dApp”) is the first decentralized marketplace built on Boson Protocol.
        To ensure the integrity of decentralized commerce, the Community Rules
        (the “Rules”) describe activities that are prohibited in connection with
        your use of the dApp.
      </Text>
      <Text>The following activities are prohibited:</Text>
      <List>
        <li>
          <b>Child exploitation:</b>You may not offer goods or services, or post
          or upload Materials that exploit or abuse children, including but not
          limited to images or depictions of child abuse or sexual abuse, or
          that present children in a sexual manner.
        </li>
        <li>
          <b>Harassment, bullying, defamation and threats:</b> You may not offer
          goods or services, or post or upload Materials, that harass, bully,
          defame or threaten a specific individual.
        </li>
        <li>
          <b>Hateful content:</b> You may not use the dApp to promote or condone
          hate or violence against people based on race, ethnicity, color,
          national origin, religion, age, sex, gender, sexual orientation,
          disability, medical condition, veteran status or other forms of
          discriminatory intolerance. You may not use the dApp to promote or
          support organizations, platforms or people that: (i) promote or
          condone such hate; or (ii) threaten or condone violence to further a
          cause.
        </li>
        <li>
          <b>Illegal activities:</b> You may not offer goods or services, or
          post or upload Materials, that contravene or that facilitate or
          promote activities that contravene, the laws of the jurisdictions in
          which you operate and/or do business with.
        </li>
        <li>
          <b>Intellectual property:</b> You may not offer goods or services, or
          post or upload Materials, that infringe on the copyright or trademarks
          of others.
        </li>
        <li>
          <b>Malicious and deceptive practices:</b> You may not use the dApp to
          transmit malware or host phishing pages. You may not perform
          activities or upload or distribute Materials that harm or disrupt the
          operation of the dApp or other Boson infrastructure or others. You may
          not use the dApp for deceptive commercial practices or any other
          illegal or deceptive activities.
        </li>
        <li>
          <b>Personal, confidential, and protected health information:</b> You
          may not post or upload any Materials that contain personally
          identifiable information, sensitive personal information, or
          confidential information, such as credit card numbers, confidential
          national ID numbers, or account passwords unless you have consent from
          the person to whom the information belongs or who is otherwise
          authorized to provide such consent. You may not use the dApp to
          collect, store, or process any protected health information, under any
          applicable health privacy regulation or any other applicable law
          governing the processing, use, or disclosure of protected health
          information.
        </li>
        <li>
          <b>Self-harm:</b> You may not offer goods or services, or post or
          upload Materials, that promote self-harm.
        </li>
        <li>
          <b>Spam:</b> You may not use the Services to transmit unsolicited
          commercial electronic messages or upload spam offers without intention
          to offer any goods and services for sale.
        </li>
        <li>
          <b>Terrorist organizations:</b> You may not offer goods or services,
          or post or upload Materials, that imply or promote support or funding
          of, or membership in, a terrorist organization.
        </li>
      </List>
      <Text>
        If you engage in activities that violate the letter or spirit of the
        Rules, your Account may be suspended or terminated and any violating
        Material removed. Items by any sellers who do not comply with the Rules
        will not be displayed on the dApp's interface.
      </Text>
      <Text>
        Materials and your use of the dApp may be monitored at any time for
        compliance with the Rules and our Terms & Conditions (collectively, the
        <b>“Terms”</b>).
      </Text>
      <Text>
        The Rules may be modified at any time by posting a revised version. By
        continuing to use the dApp or access your Account after a revised
        version of the Rules has been posted, you agree to comply with the
        latest version of the Rules. In the event of a conflict between the
        Rules and the Terms, the Rules will take precedence, but only to the
        extent required to resolve such conflict. Capitalized terms used but not
        defined in the Rules shall have the meanings set forth in the Terms.
      </Text>

      <Text>
        If you feel that a user of the dApp has violated the Rules, please
        contact us at <a href="mailto:info@bosonapp.io">info@bosonapp.io</a>.
      </Text>
      <Break />
      <Text>
        <SubTitle>Definitions:</SubTitle>
      </Text>
      <Text>
        <b>“Materials”</b> means any photo, image, video, graphic, written
        content, audio file, code, information, data or other content uploaded,
        collected, generated, stored, displayed, distributed, transmitted or
        exhibited on or in connection with your Account.
      </Text>
      <Break />
    </Wrapper>
  );
}
