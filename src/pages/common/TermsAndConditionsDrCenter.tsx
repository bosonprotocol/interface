/* eslint @typescript-eslint/no-var-requires: off */
import { defaultFontFamily } from "lib/styles/fonts";
import styled from "styled-components";

import { LinkWithQuery } from "../../components/customNavigation/LinkWithQuery";
import { Grid } from "../../components/ui/Grid";
import { Typography } from "../../components/ui/Typography";
import { DrCenterRoutes } from "../../lib/routing/drCenterRoutes";
import { colors } from "../../lib/styles/colors";

const Wrapper = styled(Grid)`
  a {
    color: ${colors.violet};
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
    &:first-child {
      margin-bottom: 2rem;
    }
    &:not(:first-child) {
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

  color: ${colors.violet};
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
  display: block;
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
export default function TermsAndConditionsDrCenter() {
  return (
    <Wrapper flexDirection="column">
      <Margin />
      <Text>
        <b>
          THESE TERMS CREATE A BINDING LEGAL CONTRACT BETWEEN YOU AND
          BAPPLICATION LIMITED (“us”, “we”, the “Company”). BY USING OUR
          SERVICES (DEFINED BELOW), YOU AGREE TO BE BOUND BY THESE TERMS. IF YOU
          DO NOT ACCEPT THE TERMS, YOU MUST NOT AND ARE NOT AUTHORIZED TO USE
          ANY OF OUR SERVICES.
        </b>
      </Text>
      <Text>
        <b>
          FOR PERSONS RESIDING IN THE USA: THESE TERMS CONTAIN ADDITIONAL
          PROVISIONS APPLICABLE ONLY TO YOU. THEY CONTAIN AN ARBITRATION
          PROVISION. IF WE CANNOT RESOLVE A DISPUTE AMICABLY, ALL DISPUTES
          ARISING UNDER OR IN CONNECTION WITH THIS AGREEMENT MUST BE SETTLED IN
          BINDING ARBITRATION PER CLAUSE [7.2(d)]. ENTERING INTO THIS AGREEMENT
          CONSTITUTES A WAIVER OF YOUR RIGHT, IF ANY, TO PARTICIPATE IN A CLASS
          ACTION LAWSUIT OR A JURY TRIAL.
        </b>
      </Text>
      <Title>BOSON DISPUTE RESOLUTION CENTER TERMS AND CONDITIONS</Title>
      <Typography color={colors.grey} tag="p" fontWeight="400" margin="0">
        Last updated on 18 August 2023
      </Typography>
      <Margin />
      <Text>
        PLEASE FIND BELOW THE TERMS AND CONDITIONS GOVERNING THE BOSON DISPUTE
        RESOLUTION CENTER (“the <b>DR Center</b>”), INCLUDING:
        <Break />
        <Grid flexDirection="column" gap="0.5rem">
          <div>• ACCESSING OR USING THE BOSON DR CENTER; OR</div>
          <div>
            • BUYING, SELLING OR RECEIVING ANY NFT THAT WAS CREATED ON THE DR
            CENTER; OR
          </div>
          <div>
            • USING, SENDING TOKENS TO, RECEIVING TOKENS FROM, SENDING MESSAGES
            TO OR OTHERWISE TRANSACTING ON THE DR CENTER.
          </div>
        </Grid>
      </Text>
      <Text style={{ marginTop: "2rem" }}>
        These terms and conditions (these <b>“Terms”</b>) have been established
        by BApplication Limited (the “Company”) to govern the DR Center. By
        engaging in or undertaking any of the aforementioned activities, you
        will be deemed to be legally bound by these Terms.
      </Text>
      <Text>
        For any matters which are not expressly governed by these terms, please
        refer to the following, which shall be incorporated by reference into
        these Terms:
      </Text>
      <Text>
        a) The DR Center Privacy Policy:{" "}
        <LinkWithQuery to={DrCenterRoutes.PrivacyPolicy}>
          <>
            {window.location.origin}/#{DrCenterRoutes.PrivacyPolicy}
          </>
        </LinkWithQuery>
      </Text>
      <Text>
        Please contact us at{" "}
        <a href="mailto:info@bosonapp.io">info@bosonapp.io</a> for any questions
        or issues.
      </Text>
      <Break />
      <Typography tag="h3" fontWeight="400" color={colors.violet}>
        AGREEMENT
      </Typography>
      <List>
        <li>
          <SubTitle>Definitions</SubTitle>
          <Break />
          <Text>
            <b>“Boson Protocol”</b> means a smart contract protocol that enables
            the tokenization, transfer and trade of physical products as
            redeemable NFTs.{" "}
          </Text>
          <Text>
            <b>“Boson DR Center” / “the DR Center”</b> means a mutual resolution
            center where users can mutually resolve disputes.{" "}
          </Text>
          <Text>
            <b>“Polygon Blockchain” / “Polygon” </b>means Ethereum Virtual
            Machine compatible validation mechanism.{" "}
          </Text>
          <Text>
            <b>"Intellectual Property Rights”</b> means all patents, copyrights,
            design rights, trade marks, service marks, trade secrets, know-how,
            database rights and other rights in the nature of intellectual
            property rights (whether registered or not) and all applications for
            the same which may now or in the future subsist anywhere in the
            world, including the right to sue for and recover damages for past
            infringements.
          </Text>
          <Text>
            <b>“NFTs”</b> means Ethereum-based tokens complying with the ERC-721
            standard, ERC-1155 standard or other similar “non-fungible” token
            standard.{" "}
          </Text>
          <Text>
            <b>“Services”</b> means access or use of the Boson DR Center, our
            website disputes.bosonprotocol.io, or any other apps, software or
            services we provide (collectively, the Services).
          </Text>
        </li>
        <li>
          <SubTitle>General Terms</SubTitle>
          <Break />
          <Text>
            <b>User Responsible for Accounts / Addresses.</b> You are
            responsible for all matters relating to your accounts (if any) on
            the DR Center, or the blockchain accounts or addresses through which
            they interact with the DR Center, and for ensuring that all uses
            thereof comply fully with these Terms. You are responsible for
            protecting the confidentiality of your login information and
            passwords (if applicable) for the DR Center or the private keys
            controlling the relevant blockchain accounts or addresses through
            which they interact with the platforms.{" "}
          </Text>
          <Text>
            <b>DR Center May Discontinue Activities.</b> The Company shall have
            the right at any time to change or discontinue any or all aspects or
            features of the activities.
          </Text>
          <Text>
            <b>DR Center May Deny Access to or Use of the Activities.</b> The
            Company reserves the right to terminate your access to or use of any
            or all of the activities at any time, with or without notice, for
            violation of these Terms or for any other reason, or based on the
            discretion of the Company. The Company reserves the right at all
            times to disclose any information as it deems necessary to satisfy
            any applicable law, regulation, legal process or governmental
            request, or to edit, refuse to post or to remove any information or
            materials, in whole or in part, in the Company sole discretion. NFTs
            or other materials uploaded to the DR Center and may be subject to
            limitations on usage, reproduction and/or dissemination; you are
            responsible for adhering to such limitations if you acquire an NFT.
            You must always use caution when giving out any personally
            identifiable information through any of the activities on the DR
            Center. The Company does not control or endorse the content,
            messages or information found in any of the activities and the
            Company specifically disclaims any liability with regard to the
            activities and any actions resulting from any of your participation
            in any activities.{" "}
          </Text>
          <Text>
            <b>Monitoring.</b> The Company shall have the right, but not the
            obligation, to monitor the content of the activities, to determine
            compliance with these Terms and any operating rules established by
            the Company and to satisfy any law, regulation or authorized
            government request. The Company shall have the right in its sole
            discretion to edit, refuse to post or remove any material submitted
            to or posted through the DR Center. Without limiting the foregoing,
            the Company shall have the right to remove any material that
            Company, in its sole discretion, finds to be in violation of the
            provisions hereof or otherwise objectionable.
          </Text>
          <Text>
            <b>Copyright Notice.</b> “Boson” and its logos are trademarks of the
            Company or its licensors. All rights are reserved. All other
            trademarks appearing in the DR Center are the property of their
            respective owners.{" "}
          </Text>
          <Text>
            <b>Privacy Policy.</b> To access the DR Center, you must explicitly
            consent to the Company's privacy and data security practices.
          </Text>
        </li>
        <li>
          <SubTitle>The DR Center</SubTitle>
          <Break />
          <Text>
            <b>Nature of DR Center.</b> The DR Center is a public software
            utility that communicates with blockchain, which is accessible
            through any compatible Ethereum “wallet” application.{" "}
          </Text>
          <Text>
            <b>License to Use the DR Center.</b> You, subject to and conditioned
            upon such your acceptance of and adherence to these Terms, are
            hereby granted a nontransferable, non-exclusive, personal, non-sub
            licensable license to use the DR Center for its intended
            purposes.{" "}
          </Text>
          <Text>
            <b>Alterations to DR Center.</b> The Company may from time to time
            alter the DR Center. The Company does not guarantee to provide
            support for such interactions.{" "}
          </Text>
          <Text>
            <b>Content.</b> The Company makes no representations or warranties
            as to the quality, origin, or ownership of any content found in the
            DR Center that is created by you or any third parties. The Company
            shall not be liable for any errors, misrepresentations, or omissions
            in, of, and about, the content, nor for the availability of the
            content that is created by you or any third parties. The Company
            shall not be liable for any losses, injuries, or damages from the
            purchase, inability to purchase, display, or use of content.{" "}
          </Text>
          <Text>
            <b>Claims of Copyright Infringement.</b> The Company will respond to
            notices of alleged copyright infringement under applicable law. If
            you believe that your Intellectual Property Rights have been
            infringed, please notify us immediately. The Company reserves the
            right to terminate the accounts or block usage of the DR Center of
            any party who infringes copyrights.{" "}
          </Text>
        </li>
        <li>
          <SubTitle>Acceptable & Prohibited Use of the DR Center</SubTitle>
          <Break />
          <Text>
            <b>Acceptable Uses.</b> The DR Center and other activities are
            reserved exclusively for lawful consumer entertainment and artistic
            purposes (the <b>“Permitted Uses”</b>).{" "}
          </Text>
          <Text>
            <b>Prohibited Uses.</b> You must not, directly or indirectly:{" "}
            <b>(a)</b> employ any device, scheme or artifice to defraud, or
            otherwise materially mislead, the Company, or any member of the
            Community, including by impersonating or assuming any false
            identity; <b>(b)</b> engage in any act, practice or course of
            business that operates or would operate as a fraud or deceit upon
            the Company, or any member of the Community;
            <b>(c)</b> violate, breach or fail to comply with any applicable
            provision of these Terms or any other terms of service, privacy
            policy or other contract governing the use of any the activities on
            the DR Center or any relevant NFTs; <b>(d)</b> use the DR Center by
            or on behalf of a competitor of the Company or competing platform or
            service for the purpose of interfering with the DR Center to obtain
            a competitive advantage; <b>(e)</b> engage or attempt to engage in
            or assist any hack of or attack on the DR Center, or any member of
            the Community, including any “sybil attack”, “DoS attack” or
            “griefing attack” or theft of NFTs, or funds, or upload files that
            contain viruses, Trojan horses, worms, time bombs, cancelbots,
            corrupted files, or any other similar software or programs that may
            damage the operation of another’s computer or property or interfere
            with the DR Center; <b>(f)</b>
            buy, sell or use any NFTs that infringes or in a manner infringing
            the copyright, trademark, patent, trade secret or other Intellectual
            Property Rights or other proprietary rights of others, or upload, or
            otherwise make available, files that contain images, photographs,
            software or other material protected by intellectual property laws
            (including, copyright or trademark laws) or rights of privacy or
            publicity unless you own or control the rights thereto or have
            received all necessary consent to do the same; <b>(g)</b> commit any
            violation of applicable laws, rules or regulations; <b>(h)</b> use
            the DR Center in connection with surveys, contests, pyramid schemes,
            chain letters, junk email, spamming, or any duplicative or
            unsolicited messages (commercial or otherwise); <b>(i)</b> defame,
            abuse, harass, stalk, threaten or otherwise violate the legal rights
            (such as rights of privacy and publicity) of other; <b>(j)</b>{" "}
            publish, post, distribute or disseminate any profane, obscene,
            pornographic indecent or unlawful content, pictures, topic, name,
            material or information; <b>(k)</b> engage in or knowingly
            facilitate any “front-running,” “wash trading,” “pump and dump
            trading,” “ramping,” “cornering” or fraudulent, deceptive or
            manipulative trading activities; and <b>(l)</b> utilize the DR
            Center to transact in securities, commodities futures, trading of
            commodities on a leveraged, margined or financed basis, binary
            options (including prediction-market transactions), real estate or
            real estate leases, equipment leases, debt financings, equity
            financings or other similar transactions.{" "}
          </Text>
          <Text>
            The foregoing matters are referred to herein as{" "}
            <b>“Prohibited Uses”</b>.{" "}
          </Text>
        </li>
        <li>
          <SubTitle>REPRESENTATIONS AND WARRANTIES</SubTitle>
          <Break />
          <Text>
            You hereby represent and warrant to the Company that the following
            statements and information are accurate and complete at all relevant
            times. In the event that any such statement or information becomes
            untrue to you, you shall immediately divest and cease using all NFTs
            and cease accessing and using the DR Center.{" "}
          </Text>
          <Text>
            <b>Status.</b> If you are an individual, you are of legal age in the
            jurisdiction in which you reside and are of sound mind. If you are a
            business entity, you are duly organized, validly existing and in
            good standing under the laws of the jurisdiction in which it is
            organized, and has all requisite power and authority for a business
            entity of its type to carry on its business as now conducted.{" "}
          </Text>
          <Text>
            <b>Power and Authority.</b> You have all requisite capacity, power
            and authority to accept the terms and conditions of these Terms and
            to carry out and perform its obligations under these Terms. These
            Terms constitute a legal, valid and binding obligation of you
            enforceable against you in accordance with its terms.{" "}
          </Text>
          <Text>
            <b>No Conflict; Compliance with law.</b> You agreeing to these Terms
            and buying, selling, holding, using or receiving NFTs does not
            constitute, and would not reasonably be expected to result in (with
            or without notice, lapse of time, or both) a breach, default,
            contravention or violation of any law applicable to you,, or
            contract or agreement to which you are a party or by which you are
            bound.{" "}
          </Text>
          <Text>
            <b>Absence of Sanctions.</b> You are not, (and, if you are an
            entity, you are not owned or controlled by any other person who is),
            and are not acting on behalf of any other person who is, identified
            on any list of prohibited parties under any law or by any nation or
            government, state or other political subdivision thereof, any entity
            exercising legislative, judicial or administrative functions of or
            pertaining to government such as the lists maintained by the United
            Nations Security Council, the U.S. government (including the U.S.
            Treasury Department’s Specially Designated Nationals list and
            Foreign Sanctions Evaders list), the European Union (EU) or its
            member states, and the government of your home country. You are not,
            (and, if you are an entity, you are not owned or controlled by any
            other person who is), and are not acting on behalf of any other
            person who is, located, ordinarily resident, organized, established,
            or domiciled in Afghanistan, Burundi, Belize, Belarus, Central
            African Republic, Comoros, Côte d'Ivoire, the Crimea region of the
            Ukraine (as defined by the U.S. Government), Cuba, Democratic
            Republic of Congo, Democratic Republic of Timor-Leste, Eritrea,
            Iran, Iraq, Lao People’s Democratic Republic (Laos), Liberia, Libya,
            Lebanon, North Korea, Mauritania, Papua New Guinea, Somalia, Syria,
            Republic of Congo, Sudan (North), Sudan (South), Uzbekistan,
            Turkmenistan, Venezuela, Yemen, and Russian Federation, Zimbabwe or
            any other country or jurisdiction against which the U.S. maintains
            economic sanctions or an arms embargo. The tokens or other funds you
            use to participate in the DR Center or acquire NFTs are not derived
            from, and do not otherwise represent the proceeds of, any activities
            done in violation or contravention of any law.{" "}
          </Text>
          <Text>
            <b>No Claim, Loan, Ownership Interest or Investment Purpose.</b> You
            understand and agree that your purchase, sale, holding, receipt and
            use of NFT and the other usage of the DR Center does not: (a)
            represent or constitute a loan or a contribution of capital to, or
            other investment in the Company or any business or venture; (b)
            provide you with any ownership interest, equity, security, or right
            to or interest in the assets, rights, properties, revenues or
            profits of, or voting rights whatsoever in, the Company or any other
            business or venture; and (c) create or imply or entitle you to the
            benefits of any fiduciary or other agency relationship between the
            Company or any of its directors, officers, employees, agents or
            affiliates, on the on hand, and you, on the other hand. You are not
            entering into these Terms or buying, selling, holding receiving or
            using NFTs for the purpose of making an investment with respect to
            the Company or its securities, but solely wishes to use the DR
            Center for its intended purposes in order to participate in the
            protection and improvement of the use and enjoyment of the DR Center
            for such purposes. You understand and agree that the Company will
            not accept or take custody over any NFTs, cryptocurrencies or other
            assets of yours and has no responsibility or control over the
            foregoing.{" "}
          </Text>
          <Text>
            <b>Non-Reliance.</b> You are knowledgeable, experienced and
            sophisticated in using and evaluating blockchain and related
            technologies and assets, including Polygon Blockchain, NFTs and
            “smart contracts” (bytecode deployed to Polygon Blockchain or
            another blockchain). You have conducted your own thorough
            independent investigation and analysis of the DR Center, NFTs and
            the other matters contemplated by these Terms, and have not relied
            upon any information, statement, omission, representation or
            warranty, express or implied, written or oral, made by or on behalf
            of the Company in connection therewith, except as expressly set
            forth by the Company in these Terms.{" "}
          </Text>
          <Text>
            <b>Taxes.</b> The Company does not, and will not, act as your agent
            of any kind and shall have no control over any transactions
            conducted by you and thus is not responsible for determining the
            taxes that apply to your transactions and shall not act as a
            withholding tax agent in any circumstances whatsoever.
          </Text>
        </li>
        <li>
          <SubTitle>RISKS, DISCLAIMERS AND LIMITATIONS OF LIABILITY. </SubTitle>
          <Break />
          <Text>
            <b>Disclaimer of Representations.</b> The DR Center is being
            provided on an “AS IS” and “AS AVAILABLE” basis. To the fullest
            extent permitted by law, the Company is not making, and hereby
            disclaims, any and all information, statements, omissions,
            representations and warranties, express or implied, written or oral,
            equitable, legal or statutory, in connection with the DR Center and
            the other matters contemplated by these Terms, including any
            representations or warranties of title, non-infringement,
            merchantability, usage, security, uptime, reliability, suitability
            or fitness for any particular purpose, workmanship or technical
            quality of any code or software used in or relating to the DR
            Center. You acknowledge and agree that use of the DR Center is at
            your own risk.{" "}
          </Text>
          <Text>
            <b>Limitation of Liability.</b> The Company’s liability for damages
            to you shall in all cases be limited to, and under no circumstances
            shall exceed, the total aggregate amount of paid or payable by you
            to the Company.
          </Text>
          <Text>
            <b>No Consequential, Incidental or Punitive Damages.</b>{" "}
            Notwithstanding anything to the contrary contained in these Terms,
            the Company shall not be liable to any person, whether in contract,
            tort (including pursuant to any cause of action alleging
            negligence), warranty or otherwise, for special, incidental,
            consequential, indirect, punitive or exemplary damages (including
            but not limited to lost data, lost profits or savings, loss of
            business or other economic loss) arising out of or related to these
            Terms, whether or not the Company has been advised or knew of the
            possibility of such damages, and regardless of the nature of the
            cause of action or theory asserted, the maximum extent permitted by
            law.{" "}
          </Text>
          <Text>
            <b>No Guarantee of Value or Uniqueness NFTs.</b> The Company has no
            responsibility for the NFTs created or traded by you on the DR
            Center. The Company does not investigate and cannot guarantee or
            warrant the level of authenticity, originality, uniqueness,
            marketability, or the legality or value of any NFTs created or
            traded by you on the DR Center.{" "}
          </Text>
          <Text>
            <b>No Professional Advice or Liability.</b> All information provided
            by or on behalf of the Company is for informational purposes only
            and should not be construed as professional, accounting or legal
            advice. You should not take or refrain from taking any action in
            reliance on any information contained in these Terms or provided by
            or on behalf of the Company. Before you make any financial, legal,
            or other decisions involving the DR Center, you should seek
            independent professional advice from persons licensed and qualified
            in the area for which such advice would be appropriate.{" "}
          </Text>
          <Text>
            <b>Limited Survival Period for Claims.</b> Any claim or cause of
            action you may have or acquire in connection with the DR Center or
            any of the other matters contemplated by these Terms shall survive
            for the shorter of, and maybe brought against the Company solely
            prior to (a) the expiration of the statute of limitations applicable
            thereto; and (b) the date that is six months after the date on which
            the facts and circumstances giving rise to such claim or cause of
            action first arose.{" "}
          </Text>
          <Text>
            <b>Third-Party Activities and Content.</b> References, links or
            referrals to or connections with or reliance on third-party
            resources, products, services or content, including smart contracts
            developed or operated by third parties, may be provided to you in
            connection with the DR Center. In addition, third parties may offer
            promotions related to the DR Center. The Company does not endorse or
            assume any responsibility for any activities of or resources,
            products, services, content or promotions owned, controlled,
            operated or sponsored by third parties. If you access any such
            resources, products, services or content or participate in any such
            promotions, you do so solely at your own risk. You hereby expressly
            waive and release the Company from all liability arising from your
            use of any such resources, products, services or content or
            participation in any such promotions. You further acknowledge and
            agree that the Company shall not be responsible or liable, directly
            or indirectly, for any damage or loss caused or alleged to be caused
            by or in connection with use of or reliance on any such resources,
            products, services, content or promotions from third parties.{" "}
          </Text>
          <Text>
            <b>Certain Uses and Risks of Blockchain Technology.</b>
          </Text>
          <List type="a">
            <li>
              <Text>
                <em>Use of Blockchain Technology.</em> The Company utilizes
                experimental cryptographic technologies and blockchain
                technologies, including tokens, cryptocurrencies, stablecoins,
                “smart contracts,” consensus algorithms, voting systems and
                distributed, decentralized or peer-to-peer networks or systems
                for the activities on the DR Center. You acknowledge and agree
                that such technologies are novel, experimental, and speculative,
                and that therefore there is significant uncertainty regarding
                the operation and effects and risks thereof and the application
                of existing law thereto.
              </Text>
            </li>
            <li>
              <Text>
                <em>Certain Risks of Blockchain Technology.</em> The technology
                utilized in DR Center depends on public peer-to-peer networks
                such as Polygon that are not under the control or influence of
                the Company and are subject to many risks and uncertainties.
                Such technologies include the DR Center, which the Company may
                have limited or no ability to change, other than ceasing to
                support certain “smart contracts” and adding support for new
                “smart contracts”. You are solely responsible for the
                safekeeping of the private key associated with the blockchain
                address used to participate in the activities on the DR Center.
                The Company will not be able to restore or issue any refund in
                respect of any NFT due to lost private keys. If you are not able
                to spend or use an NFT due to loss or theft of the corresponding
                private key or otherwise, you will be unable to exercise your
                rights with respect to such NFT.
              </Text>
            </li>
            <li>
              <Text>
                <em>Certain Risks of Smart Contract Technology.</em> NFT and
                other digital assets relevant to the DR Center depend on the DR
                Center System, or other smart contracts deployed to Polygon,
                some of which may be coded or deployed by persons other than the
                Company. Once deployed to Polygon, the code of smart contracts,
                including the DR Center System, cannot be modified. In the event
                that the DR Center System or other smart contracts are adversely
                affected by malfunctions, bugs, defects, malfunctions, hacking,
                theft, attacks, negligent coding or design choices, or changes
                to the protocol rules of Polygon, you may be exposed to a risk
                of total loss and forfeiture of all NFTs and other relevant
                digital assets. The Company assumes no liability or
                responsibility for any of the foregoing matters, except as
                otherwise expressly provided by these Terms or required by
                applicable law.
              </Text>
            </li>
            <li>
              <Text>
                <em>Asset Prices.</em> The fiat-denominated prices and value in
                public markets of assets such as ETH and NFTs have historically
                been subject to dramatic fluctuations and are highly volatile.
                As relatively new products and technologies, blockchain-based
                assets are not widely accepted as a means of payment for goods
                and services. A significant portion of demand for these assets
                is generated by speculators and investors seeking to profit from
                the short- or long-term holding of blockchain assets. The market
                value of any ETH, and NFT may decline below the price for which
                you acquire such asset through the DR Center or on any other
                platform. You acknowledge and agree that the costs and speeds of
                transacting with cryptographic and blockchain-based systems such
                as Polygon are variable and may increase or decrease
                dramatically at any time, resulting in prolonged inability to
                access or use any ETHs, NFTs, or other digital assets associated
                with the DR Center.
              </Text>
            </li>
            <li>
              <Text>
                <em>Regulatory Uncertainty.</em> Blockchain technologies and
                digital assets are subject to many legal and regulatory
                uncertainties, and the DR Center and NFTs could be adversely
                impacted by one or more regulatory or legal inquiries, actions,
                suits, investigations, claims, fines or judgments, which could
                impede or limit the ability of you to continue the use and
                enjoyment of such assets and technologies.
              </Text>
            </li>
            <li>
              <Text>
                <em>Cryptography Risks.</em> Cryptography is a progressing
                field. Advances in code cracking or technical advances such as
                the development of quantum computers may present risks to
                Polygon, the DR Center and NFTs, including the theft, loss or
                inaccessibility thereof.
              </Text>
            </li>
            <li>
              <Text>
                <em>Fork Handling.</em> Polygon, the DR Center System, and the
                NFTs may be subject to “forks.” Forks occur when some or all
                persons running the software clients for a particular blockchain
                system adopt a new client or a new version of an existing client
                that: (i) changes the protocol rules in backwards-compatible or
                backwards-incompatible manner that affects which transactions
                can be added into later blocks, how later blocks are added to
                the blockchain, or other matters relating to the future
                operation of the protocol; or (ii) reorganizes or changes past
                blocks to alter the history of the blockchain. Some forks are
                “contentious” and thus may result in two or more persistent
                alternative versions of the protocol or blockchain, either of
                which may be viewed as or claimed to be the legitimate or
                genuine continuation of the original. The Company may not be
                able to anticipate, control or influence the occurrence or
                outcome of forks, and does not assume any risk, liability or
                obligation in connection therewith. Without limiting the
                generality of the foregoing, the Company does not assume any
                responsibility to notify you of pending, threatened or completed
                forks. The Company will respond to any forks as the Company
                determines in its sole and absolute discretion, and the Company
                shall not have any duty or obligation or liability to you if
                such response (or lack of such response) acts to a user
                detriment. Without limiting the generality of the foregoing, the
                Company’s possible and permissible responses to a fork may
                include: (i) honoring the DR Center System, and NFTs on both
                chains; (ii) honoring the DR Center System and NFTs on only one
                of the chains; (iii) honoring the DR Center System and NFTs in
                different respects or to a different extent on both chains; or
                (iv) any other response or policy or procedure, as determined by
                the Company in its sole and absolute discretion. You assume full
                responsibility to independently remain apprised of and informed
                about possible forks, and to manage your own interests in
                connection therewith.
              </Text>
            </li>
            <li>
              <Text>
                <em>Essential Third-Party Software Dependencies.</em>
              </Text>
              <Text>
                The Company neither owns nor controls MetaMask, Ledger Wallet,
                Google Chrome, the Polygon network, any Web3 Provider or any
                other third party site, product, or service that you might
                access, visit, or use for the purpose of enabling you to use the
                various features of the DR Center. The Company shall not be
                liable for the acts or omissions of any such third parties, nor
                shall the Company be liable for any damage that you may suffer
                as a result of your transactions or any other interaction with
                any such third parties.
              </Text>
              <Text>
                <b>Legal Limitations on Disclaimers.</b> Some jurisdictions do
                not allow the exclusion of certain warranties or the limitation
                or exclusion of certain liabilities and damages. Accordingly,
                some of the disclaimers and limitations set forth in these Terms
                may not apply in full to specific users. The disclaimers and
                limitations of liability provided in these terms shall apply to
                the fullest extent permitted by applicable law.{" "}
              </Text>
              <Text>
                <b>Officers, Directors, Etc</b>. All provisions of these Terms
                which disclaim or limit obligations or liabilities of the
                Company shall also apply, mutatis mutandis, to the officers,
                directors, members, employees, independent contractors, agents,
                stockholders, debtholders and affiliates of the Company.{" "}
              </Text>
              <Text>
                <b>Indemnification.</b> You shall defend, indemnify, compensate,
                reimburse and hold harmless the Company (and each of its
                officers, directors, members, employees, agents and affiliates)
                from any claim, demand, action, damage, loss, cost or expense,
                including without limitation reasonable attorneys’ fees, arising
                out or relating to (a) you misuse of, or conduct in connection
                with, the DR Center operations; (b) your violation of these
                Terms or any other applicable policy or contract of the Company;
                or (c) your violation of any rights of any other person or
                entity.{" "}
              </Text>
            </li>
          </List>
        </li>
        <li>
          <SubTitle>GOVERNING LAW; DISPUTE RESOLUTION.</SubTitle>
          <Break />
          <List>
            <li>
              <Text>
                <b>Governing law.</b> These Terms and any dispute or claim
                arising out of or in connection with it or its subject matter or
                formation (including non-contractual disputes or claims) shall
                be governed by and construed in accordance with the law of
                England and Wales, as to all matters, including matters of
                validity, construction, effect, enforceability, performance and
                remedies. Although the activities on the DR Center may be
                available in other jurisdictions, you hereby acknowledge and
                agree that such availability shall not be deemed to give rise to
                general or specific personal jurisdiction over the Company in
                any forum outside England and Wales.
              </Text>
            </li>
            <li>
              <Text>
                <b>Agreement to Binding, Exclusive Arbitration.</b>
              </Text>
              <ol type="a">
                <li>
                  <Text>
                    We will use our best efforts to resolve through informal,
                    good faith negotiations any dispute, claim or controversy
                    relating to the DR Center and this Agreement or relating to
                    the breach, termination, enforcement, interpretation or
                    validity thereof, including the determination of the scope
                    or applicability of the arbitration agreement in clause
                    7.2(d) (hereinafter “Dispute”). For any claim not relating
                    to or connected to the DR Center, please refer to the
                    relevant mechanisms of the Boson Protocol.
                  </Text>
                </li>
                <li>
                  <Text>
                    If a potential Dispute arises, you must contact us by
                    sending an email to{" "}
                    <a href="mailto:info@bosonapp.io">info@bosonapp.io</a> so
                    that we can attempt to resolve it without resorting to
                    formal dispute resolution.
                  </Text>
                </li>
                <li>
                  <Text>
                    If we are not able to reach an informal resolution within 60
                    days of your email, then you and we may bring proceedings
                    either in binding arbitration, if clause 7.2(d) applies to
                    you, or in the courts of England and Wales, if clause 7.2(d)
                    does not apply to you.
                  </Text>
                </li>
                <li>
                  <Text>
                    IF YOU ARE RESIDING IN THE UNITED STATES OF AMERICA (“USA”),
                    THIS CLAUSE 7.2(d) REQUIRES YOU TO ARBITRATE ALL DISPUTES
                    WITH US AND LIMITS THE MANNER IN WHICH YOU CAN SEEK RELIEF
                    FROM US.
                  </Text>
                  <ol type="i">
                    <li>
                      <Text>
                        Binding arbitration. Any Dispute shall be referred to
                        and finally determined by binding and confidential
                        arbitration in accordance with the JAMS International
                        Arbitration Rules (“JAMS Rules”), hereby incorporated by
                        reference and available from JAMS’ website at{" "}
                        <a href="http://www.jamsadr.com" target="_blank">
                          www.jamsadr.com
                        </a>
                        .
                      </Text>
                    </li>
                    <li>
                      <Text>
                        Federal Arbitration Act. This Agreement affects
                        interstate commerce and the enforceability of this
                        clause 7.2(d) will be both substantively and
                        procedurally governed by and construed and enforced in
                        accordance with the United States Federal Arbitration
                        Act, 9 U.S.C. §1 et seq. ( “FAA”), to the maximum extent
                        permitted by applicable law.
                      </Text>
                    </li>
                    <li>
                      <Text>
                        The Arbitral Process. The arbitral tribunal shall
                        consist of a sole arbitrator. Only as limited by the
                        FAA, this Agreement and the JAMS Rules, the arbitrator,
                        and not any federal, state or local court or agency,
                        shall have exclusive authority to resolve all Disputes
                        and shall be empowered to grant whatever relief would be
                        available in a court under law or in equity. The
                        arbitrator’s award shall be in writing, and binding on
                        the parties and may be entered as a judgment in any
                        court of competent jurisdiction.
                      </Text>
                    </li>
                    <li>
                      <Text>
                        Seat. The seat, or place of, of arbitration will be New
                        York. The language to be used in the arbitration
                        proceedings shall be English. You agree to submit to the
                        personal jurisdiction of any federal or state court in
                        New York County, New York, in order to compel
                        arbitration, to stay proceedings pending arbitration, or
                        to confirm, modify, vacate or enter judgment on the
                        award entered by the arbitrator. This clause 7.2(d)
                        shall not preclude parties from seeking provisional
                        remedies in aid of arbitration from a court of
                        applicable jurisdiction.
                      </Text>
                    </li>
                    <li>
                      <Text>
                        Class Action Waiver. You and we agree that any
                        arbitration shall be conducted in individual capacity
                        only and not as a class action or other representative
                        action, and you and we expressly waive the right to file
                        a class action or seek relief on a class basis.
                      </Text>
                      <Break />
                      <Text style={{ color: colors.red }}>
                        YOU AND WE AGREE THAT EACH MAY BRING CLAIMS AGAINST THE
                        OTHER ONLY IN INDIVIDUAL CAPACITY, AND NOT AS A
                        PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR
                        REPRESENTATIVE PROCEEDING.
                      </Text>
                      <Break />
                      <Text>
                        If any court, arbitrator or arbitral tribunal determines
                        that the class action waiver set forth in this paragraph
                        is void or unenforceable for any reason or that an
                        arbitration can proceed on a class basis, then the
                        arbitration provision set forth above shall be deemed
                        null and void in its entirety and the parties shall be
                        deemed to have NOT agreed to arbitrate disputes{" "}
                      </Text>
                    </li>
                    <li>
                      <Text>
                        Exception: Litigation of IP and Small Claims Court
                        Claims. Notwithstanding the parties’ decision to resolve
                        all disputes through arbitration, either party may bring
                        an action in any applicable court to protect its
                        Intellectual Property Rights. Either party may also seek
                        relief in a small claims court for disputes or claims
                        within the scope of that court’s jurisdiction.
                      </Text>
                    </li>
                    <li>
                      <Text>
                        Right to Opt-out. You have the right to opt-out and not
                        be bound by the arbitration and class action waiver
                        provisions set forth above by sending written notice of
                        your decision to opt-out via email to{" "}
                        <a href="mailto:info@bosonapp.io">info@bosonapp.io</a>.
                        The notice must be sent within 30 days of the last
                        update date of the Terms or your first use of our
                        Services, whichever is later, otherwise you shall be
                        bound to arbitrate disputes in accordance with the terms
                        of those paragraphs. If you opt-out of these arbitration
                        provisions, we also will not be bound by them.
                      </Text>
                    </li>
                    <li>
                      <Text>
                        Changes. We will provide 60-days’ notice of any changes
                        to this clause.
                      </Text>
                    </li>
                    <li>
                      <Text>
                        Changes will become effective on the 60th day, and will
                        apply prospectively only to any claims arising after the
                        60th day.
                      </Text>
                    </li>
                    <li>
                      <Text>
                        Fair Representation. The parties agree that, wherever
                        practicable, they will seek to appoint a fair
                        representation of diverse arbitrators (considering
                        gender, ethnicity and sexual orientation), and will
                        request administering institutions to include a fair
                        representation of diverse candidates on their rosters
                        and list of potential arbitrator appointees.
                      </Text>
                    </li>
                  </ol>
                </li>
                <li>
                  <Text>
                    You and we agree that the Courts of England and Wales shall
                    have exclusive jurisdiction to settle any Dispute that is
                    not subject to arbitration under clause 7.2(d) and that any
                    Dispute must be resolved in accordance with the law of
                    England and Wales without regard to its conflict of law
                    provisions. You and we further agree that any Dispute is
                    personal to you and us and shall be resolved solely through
                    individual action, and will not be brought as a
                    representative action, group litigation order or any other
                    type of class or collective action proceeding.{" "}
                  </Text>
                </li>
              </ol>
            </li>
          </List>
        </li>
        <li>
          <SubTitle>Proprietary Rights</SubTitle>
          <Break />
          <Text>
            All title, ownership and Intellectual Property Rights in and to the
            DR Center are owned by the Company or its licensors. You acknowledge
            and agree that the DR Center contains proprietary and confidential
            information that is protected by applicable intellectual property
            and other laws. The visual interfaces, graphics, art and drawings,
            design, systems, methods, information, computer code, software,
            "look and feel", organization, compilation of the content, code,
            data, and all other elements of the DR Center (collectively, the{" "}
            <b>"Company Materials"</b>) are owned by the Company or its
            licensors, and are protected by copyright, trade dress, patent, and
            trademark laws, international conventions, other relevant
            intellectual property and proprietary rights, and applicable laws.
          </Text>
          <Text>
            Except as expressly set forth herein, your use of the DR Center does
            not grant you ownership of or any other rights with respect to the
            DR Center and/or any Company Materials. The Company reserves all
            rights in and to the DR Center and the Company Materials. For the
            sake of clarity, you understand and agree that any "purchase" of
            NFT, whether via the DR Center or otherwise, does not give you any
            rights in the Company Materials (including, without limitation, the
            Company’s copyright in and to the art and drawings associated with
            the DR Center and content therein) other than those expressly
            contained in these Terms. The software and computer code are
            released under the Apache v2 License (link) which explains the terms
            and conditions for use, reproduction, and distribution of the
            code.{" "}
          </Text>
          <Text>
            All the brands, the relative figurative and/or shape trademarks, all
            illustrations, images and logos displayed on the physical products
            and NFTs, their relevant accessories and/or packaging, all images,
            videos and audio contained in the physical products and NFTs, and
            all Intellectual Property rights contained in or related to the
            foregoing, are and will remain the exclusive property of the Company
            and/or their respective suppliers and/or licensors. The purchase of
            any physical products and/or NFTs shall not in any way constitute a
            transfer or license of any such copyright or Intellectual Property
            Rights contained in the physical products or NFTs.
          </Text>
        </li>
        <li>
          <SubTitle>Miscellaneous</SubTitle>
          <Break />
          <Text></Text>
          <Text>
            <b>Headings.</b> The headings and captions contained in these Terms
            are for convenience of reference only, shall not be deemed to be a
            part of these Terms and shall not be referred to in connection with
            the construction or interpretation of these Terms.{" "}
          </Text>
          <Text>
            <b>Successors and Assigns.</b> These Terms shall inure to the
            benefit of the Company, you, and your respective permitted
            successors, permitted assigns, permitted transferees and permitted
            delegates and shall be binding upon all of the foregoing persons and
            any person who may otherwise succeed to any right, obligation or
            liability under these Terms by operation of law or otherwise. You
            shall not share or provide a copy of, or transfer to, any person any
            [NFT] or the private key associated with any [NFT] without notifying
            such person that such person shall be bound by and become a party to
            these Terms by virtue of thereof (or if the transferor has a
            reasonable belief that the transferee is aware of these Terms). You
            shall not assign any of your rights or delegate any of your
            liabilities or obligations under these Terms to any other person
            without the Company’s advance written consent. The Company may
            freely assign, transfer or delegate its rights, obligations and
            liabilities under these Terms to the maximum extent permitted by
            applicable law.{" "}
          </Text>
          <Text>
            <b>Severability.</b> In the event that any provision of these Terms,
            or the application of any such provision to any person or set of
            circumstances, shall be determined by an arbitrator or court of
            competent jurisdiction to be invalid, unlawful, void or
            unenforceable to any extent: (a) the remainder of these Terms and
            the application of such provision to persons or circumstances other
            than those as to which it is determined to be invalid, unlawful,
            void or unenforceable, shall not be impaired or otherwise affected
            and shall continue to be valid and enforceable to the fullest extent
            permitted by law; and (b) the Company shall have the right to modify
            these Terms so as to effect the original intent of the parties as
            closely as possible in an acceptable manner in order that the
            transactions contemplated hereby be consumed as originally
            contemplated to the fullest extent possible.{" "}
          </Text>
          <Text>
            <b>Force Majeure.</b> The Company shall not incur any liability or
            penalty for not performing any act or fulfilling any duty or
            obligation hereunder or in connection with the matters contemplated
            hereby by reason of any occurrence that is not within its control
            (including any provision of any present or future law or regulation
            or any act of any governmental authority, any act of God or war or
            terrorism, any epidemic or pandemic, or the unavailability,
            disruption or malfunction of the Internet, the World Wide Web or any
            other electronic network, the Polygon network or blockchain or the
            DR Center or any aspect thereof, or any consensus attack, or hack,
            or denial-of-service or other attack on the foregoing or any aspect
            thereof, or on the other software, networks and infrastructure that
            enables the Company to provide the DR Center), it being understood
            that the Company shall use commercially reasonable efforts,
            consistent with accepted practices in the industries in which the
            Company operates, as applicable, to resume performance as soon as
            reasonably practicable under the circumstances.{" "}
          </Text>
          <Text>
            <b>Amendments and Modifications.</b> These Terms may only be
            amended, modified, altered or supplemented by or with the written
            consent of the Company. The Company reserves the right, in its sole
            and absolute discretion, to amend, modify, alter or supplement these
            Terms from time to time. The most current version of these Terms
            will be posted on the Company’s website. Any changes or
            modifications will be effective immediately upon the modified
            Agreement being posted to the Company’s website. You shall be
            responsible for reviewing and becoming familiar with any such
            modifications. You hereby waive any right you may have to receive
            specific notice of such changes or modifications. Use of the DR
            Center by you after any modification of these Terms constitutes your
            acceptance of the modified terms and conditions. If you do not agree
            to any such modifications, you must immediately stop using the DR
            Center.{" "}
          </Text>
          <Text>
            <b>No Implied Waivers.</b> No failure or delay on the part of the
            Company in the exercise of any power, right, privilege or remedy
            under these Terms shall operate as a waiver of such power, right,
            privilege or remedy; and no single or partial exercise of any such
            power, right, privilege or remedy shall preclude any other or
            further exercise thereof or of any other power, right, privilege or
            remedy. The Company shall not be deemed to have waived any claim
            arising out of these Terms, or any power, right, privilege or remedy
            under these Terms, unless the waiver of such claim, power, right,
            privilege or remedy is expressly set forth in a written instrument
            duly executed and delivered on behalf of the Company, and any such
            waiver shall not be applicable or have any effect except in the
            specific instance in which it is given.{" "}
          </Text>
          <Text>
            <b>Entire Agreement.</b> This Agreement constitutes the entire
            agreement between you and us in relation to the Agreement’s subject
            matter. It replaces and extinguishes any and all prior agreements,
            draft agreements, arrangements, warranties, statements, assurances,
            representations and undertakings of any nature made by, or on behalf
            of either of us, whether oral or written, public or private, in
            relation to that subject matter.
          </Text>
          <Text>
            <b>Rules of Interpretation.</b>{" "}
          </Text>
          <ol type="a">
            <li>
              <Text>
                “hereof,” “herein,” “hereunder,” “hereby” and words of similar
                import will, unless otherwise stated, be construed to refer to
                these Terms as a whole and not to any particular provision of
                these Terms;{" "}
              </Text>
            </li>
            <li>
              <Text>
                “include(s)” and “including” shall be construed to be followed
                by the words “without limitation”;
              </Text>
            </li>
            <li>
              <Text>
                “or” shall be construed to be the “inclusive or” rather than
                “exclusive or” unless the context requires otherwise;{" "}
              </Text>
            </li>
            <li>
              <Text>
                any rule of construction to the effect that ambiguities are to
                be resolved against the drafting party shall not be applied in
                the construction or interpretation of these Terms;{" "}
              </Text>
            </li>
            <li>
              <Text>
                section titles, captions and headings are for convenience of
                reference only and have no legal or contractual effect.;{" "}
              </Text>
            </li>
            <li>
              <Text>
                whenever the context requires: the singular number shall include
                the plural, and vice versa; the masculine gender shall include
                the feminine and neuter genders; the feminine gender shall
                include the masculine and neuter genders; and the neuter gender
                shall include the masculine and feminine genders; and{" "}
              </Text>
            </li>
            <li>
              <Text>
                except as otherwise indicated, all references in these Terms to
                “Sections,” “clauses,” etc., are intended to refer to Sections
                of Sections, clauses, etc. of these Terms.
              </Text>
            </li>
          </ol>
        </li>
      </List>
    </Wrapper>
  );
}
