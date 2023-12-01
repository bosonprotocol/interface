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
    :hover {
      color: ${colors.black};
      text-decoration: underline;
    }
  }
`;
const List = styled.ol`
  counter-reset: item;
  padding-left: 3rem;
  margin-bottom: 4rem;
  position: relative;
  ol {
    margin-bottom: 0;
    li {
      margin: 0.75rem 0;
    }
  }

  li {
    display: block;
    margin: 2rem 0;
    :before {
      content: counters(item, ".") " ";
      counter-increment: item;
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
const TableWrapper = styled.div`
  width: 100%;
  overflow-y: hidden;
  overflow-x: auto;
  margin: 4rem 0;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;

  th,
  td {
    padding: 0.5rem 0.5rem;
    text-align: left;
    transition: all 300ms ease-in-out;
  }

  thead {
    tr {
      th {
        font-weight: 600;
        border-top: 1px solid ${colors.border};
        border-right: 1px solid ${colors.border};
        border-bottom: 4px solid ${colors.border};
        :first-child {
          border-left: 1px solid ${colors.border};
        }
      }
    }
  }

  tbody {
    tr {
      td {
        border-bottom: 1px solid ${colors.border};
        :first-child {
          border-left: 1px solid ${colors.border};
        }
        border-right: 1px solid ${colors.border};
      }
      :nth-child(2n + 2) {
        td {
          background: ${colors.border};
        }
      }
      :hover {
        td {
          background: ${colors.lightGrey};
        }
      }
    }
  }
`;

export default function PrivacyPolicy() {
  return (
    <Wrapper flexDirection="column">
      <Title>PRIVACY POLICY</Title>
      <Typography color={colors.grey} tag="p" fontWeight="400" margin="0">
        Last updated on 18 August 2023
      </Typography>
      <List>
        <li>
          <SubTitle>ABOUT THIS POLICY</SubTitle>
          <List>
            <li>
              <Text>
                We are delighted that you have chosen to use our app or visit
                our website. We take our data protection responsibilities with
                the utmost seriousness.
              </Text>
              <Text>
                This privacy policy (the <b>“Policy”</b>) outlines how we may
                collect, use, store and disclose your personal data when you:
              </Text>
              <List>
                <li>
                  <Text>
                    access or use the Boson dApp, our website&nbsp;
                    <a href="https://www.bosonapp.io" target="_blank">
                      https://www.bosonapp.io
                    </a>
                    , or any other apps, software or services we provide
                    (collectively the <b>Services</b>); and/or
                  </Text>
                </li>
                <li>
                  <Text>
                    provide us with your personal data, regardless of the medium
                    through which such personal data is provided.
                  </Text>
                </li>
              </List>
              <Text>
                This Policy also applies to any individual’s personal data which
                is in our possession or under our control. Please take a moment
                to read about how we collect, use and/or disclose your personal
                data so that you know and understand the purposes for which we
                may collect, use and/or disclose your personal data.
              </Text>
            </li>
            <li>
              <Text>
                The Services are owned and operated by BApplication Limited (a
                company incorporated in the British Virgin Islands, and
                operating at Floor 4, Banco Popular Building, Road Town,
                Tortola, VG1110, British Virgin Islands) and its related
                corporations, business units and affiliates (collectively
                referred to herein as “BApplication”, “us”, “we”, or “our”). We
                are the controller (also known as a data controller) of, and are
                responsible for, your personal information. The term “you”
                refers to the user wishing to access and/or use the Services.
              </Text>
            </li>
            <li>
              <Text>
                We will only use your personal data where you have given us your
                consent or where we have other lawful basis for doing so, and in
                the manner set out in this Privacy Policy.
              </Text>
            </li>
            <li>
              <Text>
                By providing us with personal data, you acknowledge that our
                collection, use, disclosure and processing of personal data will
                be in accordance with this Policy, including, for the avoidance
                of doubt, the cross-jurisdictional transfer of your data. DO NOT
                provide any personal data to us if you do not accept this
                Policy.
              </Text>
            </li>
            <li>
              <Text>
                The Services may contain links to other websites which are not
                owned or maintained by us. This Policy only applies to the
                related websites of BApplication and the Services. These links
                are provided only for your convenience. When visiting these
                third party websites, their privacy policies apply, and you
                should read their privacy policies which will apply to your use
                of such websites.
              </Text>
            </li>
            <li>
              <Text>
                This Policy supplements but does not supersede nor replace any
                other consent which you may have previously provided to us nor
                does it affect any rights that we may have at law in connection
                with the collection, use and/or disclosure of your personal
                data.
              </Text>
            </li>
            <li>
              <Text>
                If you: (i) have queries about our data protection processes and
                practices; (ii) wish to make a request pursuant to paragraph 11
                below; or (iii) or wish to withdraw your consent to our
                collection, use or disclosure of your personal data pursuant to
                paragraph 3.2 below; (iv) contact us on any aspect of this
                Policy or your personal data or (v) to provide any feedback that
                you may have, please submit a written request (with supporting
                documents, (if any) to:
              </Text>
              <Text>
                Email: <a href="mailto:info@bosonapp.io">info@bosonapp.io</a>
              </Text>
              <Text>
                We shall endeavour to respond to you within 30 days of your
                submission. For the avoidance of doubt, this paragraph 1.7 does
                not affect your statutory rights. For example, if the GDPR
                applies to you, you may also have a right to lodge a complaint
                with a European supervisory authority, in particular in the
                Member State in the European Union where you are habitually
                resident, where you work or where an alleged infringement of
                Data Protection law has taken place. We may also require that
                you submit certain forms or provide certain information,
                including verification of your identity, before we are able to
                respond.
              </Text>
            </li>
          </List>
        </li>
        <li>
          <SubTitle>AMENDMENTS TO THIS POLICY</SubTitle>
          <List>
            <li>
              <Text>
                We may from time to time, without notice to you, amend, modify
                and/or update this Policy to ensure that this Policy is
                consistent with our future developments, industry trends and/or
                any changes in legal or regulatory requirements. The updated
                Policy will supersede earlier versions and will apply to
                personal data provided to us previously. Subject to your rights
                at law, the prevailing terms of this Policy shall apply. If we
                make a change that significantly affects your rights or, to the
                extent we are permitted to do so, significantly changes how or
                why we use personal data, we will notify you by way of a
                prominent notice on our website or, if we have your email
                address, by email.
              </Text>
            </li>
          </List>
        </li>
        <li>
          <SubTitle>WHAT PERSONAL DATA WE COLLECT</SubTitle>
          <List>
            <li>
              <Text>
                <b>What is personal data</b>. “Personal data” means data,
                whether true or not, about an individual who can be identified
                (i) from that data, or (ii) from that data and other information
                to which the organisation has or is likely to have access. Some
                examples of personal data that we may collect include:
              </Text>
              <List>
                <li>
                  <Text>
                    personal particulars (e.g. name, email, contact details,
                    residential and/or delivery address, EXIF data and/or
                    personal information in the images, and/or telephone
                    number); and
                  </Text>
                </li>
                <li>
                  <Text>information about your use of the Services.</Text>
                </li>
              </List>
            </li>
            <li>
              <Text>
                <b>Voluntary provision of personal data</b>. We may collect
                personal data (i) that you voluntarily provide to us; or (ii)
                from third parties; or (iii) through your use of our (or our
                services provider’s) digital technologies and services (Please
                see Section 4 How We Collect Personal Data for further details).
                What personal data we collect depends on the purposes for which
                the personal data is collected and what you have chosen to
                provide.
              </Text>
              <Text>
                When our collection is based on consent, you can choose not to
                provide us with personal data. You also have the right to
                withdraw your consent for us to continue collecting, using,
                disclosing and processing your personal data, by contacting us
                in accordance with paragraph 1.7. Please note that if you
                withdraw your consent to any or all use or disclosure of your
                personal data, depending on the nature of your request, we may
                not be in a position to continue to provide our services or
                products to you or administer any contractual relationship in
                place. Such withdrawal may also result in the termination of any
                agreement you may have with us. Our legal rights and remedies
                are expressly reserved in such an event.
              </Text>
            </li>
            <li>
              <Text>
                <b>Accuracy and completeness of personal data.</b> You are
                responsible for ensuring that the personal data you provide to
                us is true, accurate, complete, and not misleading and that such
                personal data is kept up to date. You acknowledge that failure
                on your part to do so may result in our inability to provide you
                with the products and services you have requested. To update
                your personal data, please contact us (please see paragraph 1.6
                above for contact details).
              </Text>
            </li>
            <li>
              <Text>
                <b>Minors.</b> The Services are not intended to be accessed or
                used by children, minors or persons who are not of legal age. If
                you are a parent or guardian and you have reason to believe your
                child or ward has provided us with their personal data without
                your consent, please contact us. If we find that a child’s
                personal data has been collected without his/her parents’ or
                guardian’s prior consent, we will delete relevant data as soon
                as possible.
              </Text>
            </li>
          </List>
        </li>
        <li>
          <SubTitle>HOW WE COLLECT PERSONAL DATA</SubTitle>
          <List>
            <li>
              <Text>
                <b>Personal data you provide.</b> We collect personal data that
                is relevant to our relationship with you. We may collect your
                personal data directly or indirectly through various channels,
                such as when:
              </Text>
              <List>
                <li>
                  <Text>
                    you register an account with us through the Services;
                  </Text>
                </li>
                <li>
                  <Text>you download or use the Services;</Text>
                </li>
                <li>
                  <Text>
                    you download or use any documentation, information or
                    materials comprised within the Services;
                  </Text>
                </li>
                <li>
                  <Text>
                    you authorise us to obtain your personal data from a third
                    party;
                  </Text>
                </li>
                <li>
                  <Text>you enter into agreements with us;</Text>
                </li>
                <li>
                  <Text>
                    you enter into partnerships or other arrangements with us;
                    you transact with us, contact us or request that we contact
                    you through various communication channels, for example,
                    through social media platforms, messenger platforms,
                    face-to-face meetings, telephone calls, emails, fax and
                    letters;
                  </Text>
                </li>
                <li>
                  <Text>
                    you request or agree to be included in an email, marketing
                    or other mailing list;
                  </Text>
                </li>
                <li>
                  <Text>
                    you attend, participate in or register for events, courses,
                    research groups or functions organised by us;
                  </Text>
                </li>
                <li>
                  <Text>
                    we seek information about you and receive your personal data
                    in connection with your relationship with us; and
                  </Text>
                </li>
                <li>
                  <Text>
                    when you submit your personal data to us for any other
                    reason.
                  </Text>
                </li>
              </List>
            </li>
            <li>
              <Text>
                <b>Personal data provided by others.</b> Depending on your
                relationship with us, we may also collect your personal data
                from third party sources, for example, from:
              </Text>
              <List>
                <li>
                  <Text>
                    any third parties whom you have authorised us to obtain your
                    personal data from;
                  </Text>
                </li>
                <li>
                  <Text>
                    entities in which you (or a party connected to you) have an
                    interest;
                  </Text>
                </li>
                <li>
                  <Text>
                    our business partners such as third parties providing
                    services to us;
                  </Text>
                </li>
                <li>
                  <Text>
                    your family members or friends who provide your personal
                    data to us on your behalf; and/or; and
                  </Text>
                </li>
                <li>
                  <Text>public agencies or other public sources.</Text>
                </li>
              </List>
            </li>
          </List>
        </li>
        <li>
          <SubTitle>WHAT WE DO WITH YOUR PERSONAL DATA</SubTitle>
          <List>
            <li>
              <Text>
                <b>What we do.</b> We collect, use, disclose, process or entrust
                the processing of, share and transfer your personal data where:
              </Text>
              <List>
                <li>
                  <Text>you have given us consent;</Text>
                </li>
                <li>
                  <Text>
                    necessary to comply with our legal or regulatory
                    obligations, e.g. responding to valid requests from public
                    authorities;
                  </Text>
                </li>
                <li>
                  <Text>
                    necessary to support our legitimate business interests,
                    provided that this does not override your interests or
                    rights; and
                  </Text>
                </li>
                <li>
                  <Text>
                    necessary to perform a transaction you have entered into
                    with us, or provide a service that you have requested or
                    require from us.
                  </Text>
                </li>
              </List>
            </li>
            <li>
              <Text>
                <b>General purposes. </b>We may collect, use, disclose, process
                or entrust the processing of, share and transfer your personal
                data for purposes connected or relevant to our business, and/or
                to manage your relationship with us. These may include, without
                limitation, the following:
              </Text>
              <List>
                <li>
                  <Text>
                    developing and providing facilities, products or services
                    (whether made available by us or through us) to you,
                    including but not limited to:
                  </Text>
                  <List>
                    <li>
                      <Text>sale of digital tokens or virtual currencies;</Text>
                    </li>
                    <li>
                      <Text>
                        acting as intermediaries through any network or platform
                        developed or managed by us;
                      </Text>
                    </li>
                    <li>
                      <Text>
                        recording and/or encryption on any network or platform
                        developed or managed by us;
                      </Text>
                    </li>
                    <li>
                      <Text>
                        providing various products and/or services (whether
                        digital or not, and whether provided through an external
                        service provider or otherwise);
                      </Text>
                    </li>
                    <li>
                      <Text>
                        providing, managing or accessing digital wallets for
                        holding digital assets;
                      </Text>
                    </li>
                    <li>
                      <Text>
                        making payments to you for participation in any network
                        or platform developed or managed by us (as applicable);
                      </Text>
                    </li>
                    <li>
                      <Text>
                        various products and/or services related to digital
                        assets;
                      </Text>
                    </li>
                    <li>
                      <Text>
                        transactions and clearing or reporting on these
                        transactions;
                      </Text>
                    </li>
                    <li>
                      <Text>
                        analytics for the purposes of developing or improving
                        our products, services, security, and service quality;
                      </Text>
                    </li>
                  </List>
                </li>
                <li>
                  <Text>
                    assessing and processing your applications, instructions,
                    transactions, or requests with us and/or our business
                    partners, or taking steps as may be directed by you;
                  </Text>
                </li>
                <li>
                  <Text>
                    facilitating your use of the Services, including verifying
                    and establishing your identity, and authenticating,
                    operating and maintaining your accounts and/or transaction
                    details;
                  </Text>
                </li>
                <li>
                  <Text>facilitating business asset transactions;</Text>
                </li>
                <li>
                  <Text>
                    communicating with you, and assisting you with your queries,
                    requests, applications, complaints and feedback;
                  </Text>
                </li>
                <li>
                  <Text>
                    administrative purposes, including finance, IT and HR
                    purposes, quality assurance and staff training, and
                    compliance with internal policies and procedures, including
                    audit, accounting, risk management and record keeping;
                  </Text>
                </li>
                <li>
                  <Text>
                    resolving any disputes, addressing or investigating any
                    complaints, claims or disputes or any actual or suspected
                    illegal or unlawful conduct;
                  </Text>
                </li>
                <li>
                  <Text>
                    maintaining legal and regulatory compliance, including (i)
                    verifying your identity in order to comply with all
                    applicable laws (including anti-money laundering and
                    countering the finance of terrorism laws) for the purposes
                    of providing facilities, products or services; and (ii)
                    conducting credit checks, screenings or due diligence checks
                    as may be required under applicable law, regulation or
                    directive;
                  </Text>
                </li>
                <li>
                  <Text>
                    complying with all applicable laws, regulations, rules,
                    directives, orders, instructions and requests from any local
                    or foreign authorities, including regulatory, governmental,
                    tax and law enforcement authorities or other regulatory
                    authorities;
                  </Text>
                </li>
                <li>
                  <Text>
                    carrying out research and statistical analysis, including
                    development of new products and services or evaluation and
                    improvement of our existing products and services;
                  </Text>
                </li>
                <li>
                  <Text>
                    security purposes, e.g. monitoring products and services
                    provided by or made available through us for any fraudulent
                    activities and/or security threats, and/or protecting the
                    Services from unauthorised access and/or usage;
                  </Text>
                </li>
                <li>
                  <Text>
                    complying with obligations and requirements imposed by us
                    from time to time by any credit bureau or credit information
                    sharing services of which we are a member or subscriber;
                  </Text>
                </li>
                <li>
                  <Text>
                    creating and maintaining credit and risk related models;
                  </Text>
                </li>
                <li>
                  <Text>
                    financial reporting, regulatory reporting, management
                    reporting, risk management (including monitoring credit
                    exposures, preventing, detecting and investigating crime,
                    including fraud and any form of financial crime), audit and
                    record keeping purposes;
                  </Text>
                </li>
                <li>
                  <Text>
                    performing data analytics and related technologies on data,
                    to enable us to deliver relevant content and information to
                    you, and to improve our websites and digital platforms;
                  </Text>
                </li>
                <li>
                  <Text>
                    enabling any actual or proposed assignee or transferee,
                    participant or sub-participant of our rights or obligations
                    to evaluate any proposed transaction
                  </Text>
                </li>
                <li>
                  <Text>
                    managing and engaging third parties or data processors that
                    provide services to us, e.g. IT services, technological
                    services, delivery services, and other professional
                    services;
                  </Text>
                </li>
                <li>
                  <Text>
                    seeking professional advice, including legal or tax advice;
                  </Text>
                </li>
                <li>
                  <Text>
                    carrying out our legitimate business interests (listed
                    below);
                  </Text>
                </li>
                <li>
                  <Text>
                    such purposes that may be informed to you when your personal
                    data is collected; and/or
                  </Text>
                </li>
                <li>
                  <Text>
                    any other reasonable purposes related to the aforesaid.
                  </Text>
                </li>
              </List>
              <Text>
                For the avoidance of doubt, we may also use personal data for
                purposes set out in the terms and conditions that govern our
                relationship with you. Where personal data is used for a new
                purpose and where required under applicable law, we shall obtain
                your consent.
              </Text>
            </li>
            <li>
              <Text>
                <b>Legitimate business interests.</b> We may also collect, use,
                disclose, process or entrust the processing of, share and
                transfer your personal data for the following purposes to
                support our legitimate business interests, provided that this
                does not override your interests or rights, which include:
              </Text>
              <List>
                <li>
                  <Text>
                    managing our business and relationship with you, and
                    providing services to our customers;
                  </Text>
                </li>
                <li>
                  <Text>
                    assistance of carrying out corporate restructuring plans;
                  </Text>
                </li>
                <li>
                  <Text>complying with internal policies, and procedures;</Text>
                </li>
                <li>
                  <Text>
                    protecting our rights and interests, and those of our
                    customers;
                  </Text>
                </li>
                <li>
                  <Text>
                    enforcing our terms and conditions, and obligations owed to
                    us, or protecting ourselves from legal liability; and
                  </Text>
                </li>
                <li>
                  <Text>managing our investor and shareholder relations.</Text>
                </li>
              </List>
            </li>
            <li>
              <Text>
                <b>Marketing purposes.</b> In order for us to market products,
                events and services which are of specific interest and relevance
                to you, we may analyse and rely on your personal data provided
                to us, or data collected from your interactions with us.
                However, no marketing, using your personal data in
                non-aggregated and/or identifiable form would be carried out
                unless you have provided us with your consent to use your
                personal data for such marketing purposes. If you do not want us
                to use your personal data for the purposes of marketing you can
                withdraw your consent at any time by contacting us in accordance
                with paragraph 1.7 above.
              </Text>
            </li>
            <li>
              <Text>
                <b>Use permitted under applicable laws.</b> We may also collect,
                use, disclose, process and entrust the processing of, share and
                transfer your personal data for other purposes, without your
                knowledge or consent, where this is required or permitted by
                law. Your personal data may be processed if it is necessary on
                reasonable request by a law enforcement or regulatory authority,
                body or agency or in the defence of a legal claim. We will not
                delete personal data if relevant to an investigation or a
                dispute. It will continue to be stored until those issues are
                fully resolved.
              </Text>
            </li>
            <li>
              <Text>
                <b>Contacting you.</b> When we contact or send you information
                for the above purposes and purposes for which you have
                consented, we may do so by post, email, SMS, telephone or such
                other means provided by you. If you do not wish to receive any
                communication or information from us, or wish to restrict the
                manner by which we may contact or send you information, you may
                contact us in accordance with paragraph 1.7 above.
              </Text>
            </li>
          </List>
        </li>
        <li>
          <SubTitle>USE OF AUTOMATED DATA COLLECTION TECHNOLOGIES</SubTitle>
          <List>
            <li>
              <Text>
                <b>Cookies.</b> In order to improve our products or services, we
                collect data by way of “cookies”. A cookie is a small text file
                placed on your computer or mobile device when you visit a
                website or use an app. Cookies collect information about users
                and their visit to the website or use of the app, such as their
                Internet protocol (IP) address, how they arrived at the website
                (for example, through a search engine or a link from another
                website) and how they navigate within the Website or app.. There
                are three main types of cookies:
              </Text>
              <List>
                <li>
                  <Text>
                    <b>Session cookies:</b> specific to a particular visit and
                    limited to sending session identifiers (random numbers
                    generated by the server) so you do not have to re-enter
                    information when you navigate to a new page or check out.
                    Session cookies are not permanently stored on your device
                    and are deleted when the browser closes;
                  </Text>
                </li>
                <li>
                  <Text>
                    <b>Persistent cookies:</b> record information about your
                    preferences and are stored in your browser cache or mobile
                    device; and
                  </Text>
                </li>
                <li>
                  <Text>
                    <b>Third party cookies:</b> placed by someone other than us
                    which may gather data across multiple websites or sessions.
                  </Text>
                </li>
              </List>
            </li>
            <li>
              <Text>
                <b>How we use cookies.</b> We use cookies for the following
                purposes:
              </Text>
              <List>
                <li>
                  <Text>
                    <b>Strictly necessary:</b> These cookies are essential for
                    you to browse the Services and use its features. The
                    information collected relates to the operation of the
                    Services (e.g. website scripting language and security
                    tokens) and enables us to provide you with the service you
                    have requested.
                  </Text>
                </li>
                <li>
                  <Text>
                    <b>Functionality:</b> These cookies remember the choices you
                    have made, for example the country you visit the Services
                    from, your language and any changes you have made to text
                    size and other parts of the web pages that you can customise
                    to improve your user experience and to make your visits more
                    tailored and enjoyable.
                  </Text>
                </li>
                <li>
                  <Text>
                    <b>Performance/analytics:</b> These cookies collect
                    information on how users use the Services, for example which
                    pages you visit most often, whether you receive any error
                    messages and how you arrived at the Services. Information
                    collected by these cookies is used only to improve your use
                    of the Services. These cookies are sometimes placed by third
                    party providers of web traffic and analysis services.
                  </Text>
                  <List>
                    <li>
                      <Text>
                        We use Google Analytics. For information on how Google
                        processes and collects your information and how you can
                        opt out, please refer to Section 6.5.1.
                      </Text>
                    </li>
                    <li>
                      <Text>
                        We use Google Tag Manager (GTM). GTM is a little snippet
                        of code that helps us track user behavior across our
                        sites and then pushes the data to our Google Analytics
                        account. Then, all the data is perfectly organized and
                        ready for us to assess and review for potential site
                        improvements and remarketing campaigns. We consider
                        Google to be a third party data processor (see section 2
                        below).{" "}
                        <a
                          href="https://support.google.com/tagmanager/answer/6102821?hl=en"
                          target="_blank"
                        >
                          Learn more about Google Tag Manager.
                        </a>
                      </Text>
                    </li>
                  </List>
                </li>
                <li>
                  <Text>
                    <b>Social Media:</b> These cookies allow users to share our
                    website content on social media. These cookies are not
                    within our control. Please refer to the respective privacy
                    policies of the social media providers for how their cookies
                    work.
                  </Text>
                </li>
              </List>
              <Text>
                We may also automatically collect and store certain information
                about your interaction with the Services including IP address,
                browser type, internet service provider, referring/exit pages,
                operating system, date/time stamps and related data.
              </Text>
            </li>
            <li>
              <Text>
                <b>Cookies we use.</b> A list of cookies used in the Services,
                their functionalities and expiry dates are set out in Annex A.
              </Text>
            </li>
            <li>
              <Text>
                <b>Refusing or deleting cookies.</b> Most internet browsers are
                set up by default to accept cookies. However if you want to
                refuse or delete them (or similar technologies) please refer to
                the help and support area on your browser for instructions on
                how to block or delete cookies (for example: Internet Explorer,
                Google Chrome, Mozilla Firefox and Safari). Please note you may
                not be able to take advantage of all the features of the
                Services, including certain personalised features, if you delete
                or refuse cookies.
              </Text>
            </li>
            <li>
              <Text>
                <b>Mobile Opt-out.</b> If you access the Services through mobile
                devices, you can enable a "do not track" feature so as to
                control interest-based advertising on an iOS or Android mobile
                device by selecting the Limit Add Tracking option in the privacy
                section of your Settings on iOS or via advertising preferences
                on Android devices (e.g. in Google Settings). This will not
                prevent the display of advertisements but will mean that they
                will no longer be personalised to your interests.
              </Text>
              <List>
                <li>
                  <Text>
                    To opt out of Google Analytics, visit{" "}
                    <a
                      href="https://tools.google.com/dlpage/gaoptout"
                      target="_blank"
                    >
                      https://tools.google.com/dlpage/gaoptout
                    </a>
                  </Text>
                </li>
                <li>
                  <Text>
                    For more information on managing cookies, please go to{" "}
                    <a href="http://www.allaboutcookies.org/" target="_blank">
                      www.allaboutcookies.org
                    </a>
                  </Text>
                </li>
              </List>
            </li>
            <li>
              <Text>
                <b>If you are a resident in the EU.</b> For more information on
                managing cookies, please visit{" "}
                <a href="http://www.youronlinechoices.eu/" target="_blank">
                  www.youronlinechoices.eu
                </a>{" "}
                which has further information about behavioural advertising and
                online privacy.
              </Text>
            </li>
            <li>
              <Text>
                <b>Changes to our uses of Cookies.</b> If we change anything
                important about this Paragraph 6 on cookies, we will notify you
                through a pop-up on the website for a reasonable length of time
                prior to and following the change.
              </Text>
            </li>
          </List>
        </li>
        <li>
          <SubTitle>DISCLOSURE AND SHARING OF PERSONAL DATA</SubTitle>
          <List>
            <li>
              <Text>
                <b>Disclosure to related parties.</b> Subject to applicable law,
                we may disclose or share your personal data with our related
                parties, in connection with use of the Services, in order to
                provide the Services and for the purposes described in this
                paragraph 7.
              </Text>
            </li>
            <li>
              <Text>
                <b>Your information and the Blockchain.</b>
              </Text>
              <List>
                <li>
                  <Text>
                    Blockchain technology is known as distributed ledger
                    technology (or simply ‘DLT’). Blockchains are decentralized
                    and made up of digitally recorded data in a chain of
                    packages called ‘blocks’. The manner in which these blocks
                    are linked is chronological, meaning that the data is very
                    difficult to alter once recorded. Since the ledger may be
                    distributed all over the world (across several ‘nodes’ which
                    usually replicate the ledger) this means there is no single
                    person making decisions or otherwise administering the
                    system (such as an operator of a cloud computing system),
                    and that there is no centralized place where it is located
                    either.
                  </Text>
                </li>
                <li>
                  <Text>
                    Accordingly, by design, a blockchains records cannot be
                    changed or deleted and is said to be ‘immutable’. This may
                    affect your ability to exercise your rights such as your
                    right to erasure (‘right to be forgotten’), or your rights
                    to object or restrict processing, of your personal data.
                    Data on the blockchain cannot be erased and cannot be
                    changed. Although smart contracts may be used to revoke
                    certain access rights, and some content may be made
                    invisible to others, it is not deleted.
                  </Text>
                </li>
                <li>
                  <Text>
                    In certain circumstances, in order to comply with our
                    contractual obligations to you (such as delivery of tokens)
                    it will be necessary to write certain personal data, such as
                    your wallet address, onto the blockchain; this is done
                    through a smart contract and requires you to execute such
                    transactions using your wallet’s private key.
                  </Text>
                </li>
                <li>
                  <Text>
                    In most cases ultimate decisions to (i) transact on the
                    blockchain using your wallet address, as well as (ii) share
                    the public key relating to your wallet address with anyone
                    (including us) rests with you.
                  </Text>
                </li>
                <li>
                  <Text>
                    <b>
                      IF YOU WANT TO ENSURE YOUR PRIVACY RIGHTS ARE NOT AFFECTED
                      IN ANY WAY, YOU SHOULD NOT TRANSACT ON BLOCKCHAINS AS
                      CERTAIN RIGHTS MAY NOT BE FULLY AVAILABLE OR EXERCISABLE
                      BY YOU OR US DUE TO THE TECHNOLOGICAL INFRASTRUCTURE OF
                      THE BLOCKCHAIN. IN PARTICULAR THE BLOCKCHAIN IS AVAILABLE
                      TO THE PUBLIC AND ANY PERSONAL DATA SHARED ON THE
                      BLOCKCHAIN WILL BECOME PUBLICLY AVAILABLE
                    </b>
                  </Text>
                </li>
              </List>
            </li>
            <li>
              <Text>
                <b>
                  Disclosure to third parties. We may from time to time,
                  disclose your personal data to third parties in connection
                  with purposes described in paragraph 5 above, including
                  without limitation the following circumstances:
                </b>
              </Text>
              <List>
                <li>
                  <Text>
                    disclosing your personal data to third parties who provide
                    services to us (including but not limited to, data providers
                    and technology providers (including services relating to
                    telecommunications, information technology, payment, data
                    processing, storage and archival), and professional services
                    (including our accountants, auditors and lawyers).
                  </Text>
                </li>
                <li>
                  <Text>
                    disclosing your personal data with third party identity
                    verification and transaction monitoring services to assist
                    in the prevention of fraud and other illegal activities and
                    to fulfill our obligations under anti-money laundering and
                    countering the financing of terrorism laws and regulations.
                  </Text>
                </li>
                <li>
                  <Text>
                    disclosing your personal data to third parties who provide
                    web monitoring services
                  </Text>
                </li>
                <li>
                  <Text>
                    disclosing your personal data to third parties in order to
                    fulfil such third party products and/or services as may be
                    requested or directed by you;
                  </Text>
                </li>
                <li>
                  <Text>
                    disclosing your personal data to third parties that we
                    conduct marketing and cross promotions with;
                  </Text>
                </li>
                <li>
                  <Text>
                    disclosing your personal data to regulators, governments,
                    law enforcement agencies, public agencies and/or
                    authorities;
                  </Text>
                </li>
                <li>
                  <Text>
                    if we are discussing selling or transferring part or all of
                    our business – the information may be transferred to
                    prospective purchasers under suitable terms as to
                    confidentiality;
                  </Text>
                </li>
                <li>
                  <Text>
                    if we are reorganised or sold, information may be
                    transferred to a buyer who can continue to provide continued
                    relationship with you; and
                  </Text>
                </li>
                <li>
                  <Text>
                    if we are defending a legal claim your information may be
                    transferred as required in connection with defending such
                    claim.
                  </Text>
                </li>
              </List>
            </li>
            <li>
              <Text>
                <b>Use of Third Party Applications</b>
              </Text>
              <List>
                <li>
                  <Text>
                    <b>Blockchain</b> When using the Boson dApp, your smart
                    contract address, the transactions made with the dApp,
                    addresses of externally owned accounts and token balances
                    will be stored on the Blockchain. See section 7.2 of this
                    Policy.{" "}
                    <b>
                      The information will be displayed permanently and public,
                      this is part of the nature of the blockchain.If you are
                      new to this field, we highly recommend informing yourself
                      about the blockchain technology before using our services.
                    </b>
                  </Text>
                </li>
                <li>
                  <Text>
                    <b>Lens Protocol</b> (
                    <a href="https://lens.xyz/" target="_blank">
                      https://lens.xyz/
                    </a>
                    ) Lens Protocol provides a social graph for web3. Lens is
                    integrated into the Boson dApp to provide user profiles to
                    buyers and sellers. We do not store any data collected by
                    them. Lens’ privacy policy is available at{" "}
                    <a
                      href="https://claim.lens.xyz/pdf_privacy.pdf"
                      target="_blank"
                    >
                      https://claim.lens.xyz/pdf_privacy.pdf
                    </a>
                  </Text>
                </li>
                <li>
                  <Text>
                    <b>XMTP</b> (website link) is a secure messaging protocol
                    and decentralized communication network for web3. XMTP is
                    integrated into the Boson dApp to allow for secure
                    communication between buyer and seller.
                  </Text>
                </li>
                <li>
                  <Text>
                    <b>Sentry</b> (
                    <a href="https://sentry.io/" target="_blank">
                      https://sentry.io/
                    </a>
                    ). Sentry provides real-time error tracking for web and
                    mobile apps. This gives us as developers, the insight needed
                    to reproduce and fix crashes. We do not store any data
                    collected by them. Sentry’s privacy policy is available at{" "}
                    <a href="https://sentry.io/privacy/" target="_blank">
                      https://sentry.io/privacy/
                    </a>
                    .
                  </Text>
                </li>
              </List>
            </li>
            <li>
              <Text>
                When disclosing personal data to third parties, please be
                assured that we will (where appropriate and permissible) enter
                into contracts with third parties to protect your personal data
                in accordance with applicable laws and/or ensure that they only
                process your personal data in accordance with our instructions.
              </Text>
            </li>
            <li>
              <Text>
                For more information about the third parties with whom we share
                your personal data, you may, where appropriate, wish to refer to
                the agreement(s) and/or terms and conditions that govern our
                relationship with you or our customer. You may also contact us
                for more information (please see paragraph 1.6 above).
              </Text>
            </li>
          </List>
        </li>
        <li>
          <SubTitle>TRANSFER OF PERSONAL DATA TO OTHER COUNTRIES</SubTitle>
          <List>
            <li>
              <Text>
                <b>Transfer.</b> We may transfer, store, process and/or deal
                with your personal data to different jurisdictions in connection
                with the purposes described in paragraph 5 above:
              </Text>
              <List>
                <li>
                  <Text>
                    from the jurisdiction where it is collected (or where you
                    are located) to any other jurisdiction that we operate in;
                    and
                  </Text>
                </li>
                <li>
                  <Text>to third parties in other jurisdictions.</Text>
                </li>
              </List>
            </li>
            <li>
              <Text>
                <b>Safeguards.</b> Where we transfer your personal data across
                jurisdictions, we will ensure that your personal data is
                protected in accordance with this policy and applicable laws
                regardless of the jurisdictions they are transferred to, but in
                any event to a level that is no less stringent than the
                jurisdiction from which the personal data is transferred. When
                we transfer your personal data internationally and where
                required by applicable law we put in place appropriate
                safeguards including EU Model Clauses or rely on EU Commission
                adequacy decisions. You may obtain details of these safeguards
                by contacting us.
              </Text>
            </li>
          </List>
        </li>
        <li>
          <SubTitle>PROTECTION OF PERSONAL DATA</SubTitle>
          <List>
            <li>
              <Text>
                <b>Unauthorised access.</b> At each stage of data collection,
                use and disclosure, we have in place physical, electronic,
                administrative and procedural safeguards to protect the personal
                data stored with us. While we take reasonable precautions to
                safeguard your personal data in our possession or under our
                control, you agree not to hold us liable or responsible for any
                loss or damage resulting from unauthorised or unintended access
                that is beyond our control, such as hacking or cybercrimes.
              </Text>
            </li>
            <li>
              <Text>
                <b>Vulnerabilities.</b> We do not make any warranty, guarantee,
                or representation that your use of our systems or applications
                is safe and protected from malware, and other vulnerabilities.
                We also do not guarantee the security of data that you choose to
                send us electronically. Sending such data is entirely at your
                own risk.
              </Text>
            </li>
            <li>
              <Text>
                <b>Anonymised data.</b> In some circumstances we may anonymise
                your personal data so that it can no longer be associated with
                you, in which case we are entitled to retain and use such data
                without restriction.
              </Text>
            </li>
          </List>
        </li>
        <li>
          <SubTitle>RETENTION OF PERSONAL DATA</SubTitle>
          <List>
            <li>
              <Text>
                <b>Period of retention.</b> We will only keep your Information
                for as long as it is necessary for the purposes set out in this
                Policy, unless a longer retention period is required or
                permitted by law (such as tax law, accounting requirements or
                other legal or regulatory requirements).
              </Text>
            </li>
          </List>
        </li>
        <li>
          <SubTitle>YOUR RIGHTS</SubTitle>
          <List>
            <li>
              <Text>
                <b>Rights you may enjoy.</b> Depending on the jurisdiction that
                you are in or where we operate, you may enjoy certain rights
                under applicable law in relation to our collection, use,
                disclosure and processing of your personal data. Such rights may
                include:
              </Text>
              <List>
                <li>
                  <Text>
                    <b>Access:</b> you may ask us if we hold your personal data
                    and, if we are, you can request access to your personal
                    data. This enables you to receive a copy of and information
                    on the personal data we hold about you.
                  </Text>
                </li>
                <li>
                  <Text>
                    <b>Correction:</b> you may request that any incomplete or
                    inaccurate personal data we hold about you is corrected.
                  </Text>
                </li>
                <li>
                  <Text>
                    <b>Erasure:</b> you may ask us to delete or remove personal
                    data that we hold about you in certain circumstances.
                  </Text>
                </li>
                <li>
                  <Text>
                    <b>Restriction:</b> you may withdraw consent for our use of
                    your personal data, or ask us to suspend the processing of
                    certain of your personal data about you, for example if you
                    want us to establish its accuracy.
                  </Text>
                </li>
                <li>
                  <Text>
                    <b>Portability:</b> you may request the transfer of certain
                    of your personal data to another party under certain
                    conditions.
                  </Text>
                </li>
                <li>
                  <Text>
                    <b>Objection:</b> where we are processing your personal data
                    based on a legitimate interest (or those of a third party)
                    you may object to processing on this ground.
                  </Text>
                </li>
              </List>
              <Text>
                If you wish to exercise any of your rights, you may contact us
                in accordance with paragraph 1.7 above. Where permitted by law,
                we may charge you a fee for processing your request. Such a fee
                depends on the nature and complexity of your request.
                Information on the processing fee will be made available to you.
              </Text>
            </li>
            <li>
              <Text>
                <b>Limitations.</b> We may be permitted under applicable laws to
                refuse a request, for example, we may refuse (a) a request for
                erasure where the personal data is required for in connection
                with claims; or (b) an objection request and continue processing
                your personal data based on compelling legitimate grounds for
                the processing.
              </Text>
            </li>
          </List>
        </li>
      </List>
      <Typography color={colors.secondary} tag="h4">
        ANNEX A
      </Typography>
      <Typography color={colors.grey} tag="h6" fontWeight="400" margin="0">
        LIST OF COOKIES USED
      </Typography>
      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Function</th>
              <th>Expiry</th>
              <th>Place By</th>
              <th>Used By</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>_ga</td>
              <td>Analytics</td>
              <td>1 year</td>
              <td>sentry.io</td>
              <td></td>
            </tr>
            <tr>
              <td>_ga</td>
              <td>Analytics</td>
              <td>1 year</td>
              <td>infura.io</td>
              <td></td>
            </tr>
            <tr>
              <td>_ga</td>
              <td>Analytics</td>
              <td>2 years</td>
              <td>fleek.co</td>
              <td></td>
            </tr>
            <tr>
              <td>_uetvid</td>
              <td>Tracking/Marketing</td>
              <td>1 year</td>
              <td>infura.io</td>
              <td></td>
            </tr>
            <tr>
              <td>_uestid</td>
              <td>Tracking/Marketing</td>
              <td>1 month</td>
              <td>infura.io</td>
              <td></td>
            </tr>
            <tr>
              <td>__stripe_mid</td>
              <td>Functional (fraud protection)</td>
              <td>1 year</td>
              <td>infura.io</td>
              <td></td>
            </tr>
            <tr>
              <td>__stripe_mid</td>
              <td>Functional (fraud protection)</td>
              <td>1 year</td>
              <td>sentry.io</td>
              <td></td>
            </tr>
            <tr>
              <td>_gcl_au</td>
              <td>Tracking/Marketing</td>
              <td>1 month</td>
              <td>infura.io</td>
              <td></td>
            </tr>
            <tr>
              <td>_hjSessionUser_*</td>
              <td>Statistics</td>
              <td>1 year</td>
              <td>infura.io</td>
              <td>Hotjar</td>
            </tr>
            <tr>
              <td>__hstc</td>
              <td>Tracking/Marketing</td>
              <td>6 months</td>
              <td>infura.io</td>
              <td>HubSpot</td>
            </tr>
            <tr>
              <td>hubspotutk</td>
              <td>Tracking/Marketing</td>
              <td>6 months</td>
              <td>infura.io</td>
              <td>HubSpot</td>
            </tr>
            <tr>
              <td>HostedServiceExplorerAPI</td>
              <td>Functional</td>
              <td>3 months</td>
              <td>thegraph.com</td>
              <td></td>
            </tr>
            <tr>
              <td>ajs_anonymous_id</td>
              <td>Statistics</td>
              <td>1 year</td>
              <td>thegraph.com</td>
              <td></td>
            </tr>
          </tbody>
        </Table>
      </TableWrapper>
    </Wrapper>
  );
}
