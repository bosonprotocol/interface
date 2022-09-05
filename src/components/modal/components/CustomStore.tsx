import { CopySimple } from "phosphor-react";
import styled from "styled-components";

import Collapse from "../../../components/collapse/Collapse";
import { colors } from "../../../lib/styles/colors";
import copyToClipboard from "../../../lib/utils/copyToClipboard";
import Button from "../../ui/Button";
import Grid from "../../ui/Grid";
import Typography from "../../ui/Typography";
import { ModalProps } from "../ModalContext";

const CopyIcon = styled(CopySimple)`
  cursor: pointer;
  color: ${colors.secondary};
`;

const Heading = styled(Typography).attrs({
  tag: "p",
  $fontSize: "1rem",
  fontWeight: "600",
  lineHeight: "1.5rem"
})``;

const marginBetweenContainers = `1.875rem`;
const CollapsibleContainer = styled.div`
  margin-top: ${marginBetweenContainers};
  background-color: ${colors.lightGrey};
  padding: 1.5rem;
`;

const Steps = styled.div`
  display: flex;
`;

interface Props {
  ipfsUrl: string;
  hideModal: NonNullable<ModalProps["hideModal"]>;
}
export default function CustomStore({ ipfsUrl = "", hideModal }: Props) {
  return (
    <>
      <Typography
        color={colors.darkGrey}
        fontWeight="600"
        $fontSize="1.25rem"
        lineHeight="1.875rem"
      >
        Congrats for creating your store front.
      </Typography>
      <CollapsibleContainer>
        <Collapse title={<Heading>Custom Store URL</Heading>}>
          <Grid alignItems="center" justifyContent="flex-start" gap="0.5rem">
            <a href={ipfsUrl} target="_blank">
              {ipfsUrl}
            </a>
            <CopyIcon
              size={20}
              onClick={() => copyToClipboard(ipfsUrl).catch(console.error)}
            />
          </Grid>
        </Collapse>
      </CollapsibleContainer>
      <CollapsibleContainer>
        <Collapse title={<Heading>Link to ENS</Heading>}>
          <div>
            <p>
              To improve your users' experience, you can provide them with a
              branded link by hooking up the above redirect link to your ENS
              (sub)domain.
            </p>
            <Steps>
              <ol>
                <li>
                  Navigate to{" "}
                  <a href="https://app.ens.domains/" target="_blank">
                    https://app.ens.domains/
                  </a>{" "}
                  -{">"} My Account{" "}
                </li>
                <li>Select your ENS domain & click "Add/Edit Record" </li>
                <li>
                  Set the "Content" value to "ipfs://
                  {`CID`}"
                  <ol type="a">
                    <li>
                      Where CID is the last part of the above Custom Store URL
                    </li>
                  </ol>
                </li>
                <li>
                  Click "Confirm" and send the transaction using your wallet.
                </li>
                <li>
                  You can then share this ENS domain with your users. (Add a
                  ".link" suffix to the ENS domain. i.e.g. https://ens
                  Domain.eth.link)
                </li>
              </ol>
            </Steps>
          </div>
        </Collapse>
      </CollapsibleContainer>
      <CollapsibleContainer>
        <Heading>Pin IPFS redirect</Heading>
        <div>
          <p>
            To improve your users' experience, you can pin the IPFS file (i.e.
            the above Custom Store URL) to your IPFS node gateway. This enables
            guaranteed and faster loading times.
          </p>
        </div>
      </CollapsibleContainer>
      <Grid margin={`${marginBetweenContainers} 0 0 0`}>
        <Button theme="secondary" type="button" onClick={() => hideModal()}>
          Done
        </Button>
      </Grid>
    </>
  );
}
