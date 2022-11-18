import * as Tooltip from "@radix-ui/react-tooltip";
import { Copy, CopySimple, Info } from "phosphor-react";
import * as pretty from "pretty";
import { useState } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";

import Collapse from "../../../components/collapse/Collapse";
import { colors } from "../../../lib/styles/colors";
import copyToClipboard from "../../../lib/utils/copyToClipboard";
import { Notify } from "../../detail/Detail.style";
import { CopyButton } from "../../form/Field.styles";
import BosonButton from "../../ui/BosonButton";
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

const StyledTooltip = styled.div`
  background: ${colors.white};
  padding: 1rem;
  border: 1px solid ${colors.darkGrey};
  max-width: 20rem;
`;

const StyledPre = styled.pre`
  word-break: break-word;
  white-space: pre-wrap;
  background-color: #454545;
  color: whitesmoke;
  padding: 0.5rem;
  position: relative;
`;

const StyledCopyButton = styled(CopyButton)`
  position: absolute;
  bottom: 0;
  right: 0.4375rem;
`;

interface Props {
  ipfsUrl: string;
  htmlString: string;
  hideModal: NonNullable<ModalProps["hideModal"]>;
}
export default function CustomStore({
  ipfsUrl = "",
  htmlString = "",
  hideModal
}: Props) {
  const [show, setShow] = useState<boolean>(false);

  const iframeString = htmlString.substring(
    htmlString.indexOf("<iframe"),
    htmlString.indexOf("</body")
  );
  return (
    <>
      <Typography
        color={colors.darkGrey}
        fontWeight="600"
        $fontSize="1.25rem"
        lineHeight="1.875rem"
      >
        Congrats for creating your storefront. See the URL and further options
        below:
      </Typography>
      <CollapsibleContainer>
        <Grid justifyContent="flex-start" gap="0.5rem">
          <Heading>Custom Store URL </Heading>
          <Tooltip.Provider delayDuration={0}>
            <Tooltip.Root>
              <Tooltip.TooltipTrigger asChild>
                <Info size="20" />
              </Tooltip.TooltipTrigger>
              <Tooltip.Content>
                <StyledTooltip>
                  This shows the IPFS CID for your custom storefront website
                  file. The store can be directly accessed using the URL.
                </StyledTooltip>
              </Tooltip.Content>
            </Tooltip.Root>
          </Tooltip.Provider>
        </Grid>

        <Grid alignItems="center" justifyContent="flex-start" gap="0.5rem">
          <a href={ipfsUrl} target="_blank">
            {ipfsUrl}
          </a>
          <CopyIcon
            size={20}
            onClick={async () => {
              try {
                await copyToClipboard(ipfsUrl);
                setShow(true);
                setTimeout(() => {
                  setShow(false);
                }, 3000);
              } catch (error) {
                console.error(error);
              }
            }}
          />
          <Notify $show={show}>
            <Typography tag="p">URL has been copied to clipboard</Typography>
          </Notify>
        </Grid>
      </CollapsibleContainer>
      <CollapsibleContainer>
        <Collapse title={<Heading>Link to ENS</Heading>}>
          <p>
            To improve your users' experience, you can provide them with a
            branded link by hooking up the above redirect link to your ENS
            (sub)domain.
          </p>
          <div>
            <ol style={{ padding: "0 1rem" }}>
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
                    (i.e.
                    {ipfsUrl
                      .toString()
                      .substring(
                        ipfsUrl.toString().indexOf("ipfs/") + 5,
                        ipfsUrl.toString().indexOf("ipfs/") + 9
                      )
                      .concat("...)")}
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
          </div>
        </Collapse>
      </CollapsibleContainer>
      <CollapsibleContainer>
        <Collapse title={<Heading>Integrate iFrame into your website</Heading>}>
          <p>
            To improve your users' experience, your custom storefront can be
            integrated directly into your website using an iframe. The steps to
            do this are described below:
          </p>
          <div>
            <ol style={{ padding: "0 1rem" }}>
              <li>Go to your website code or to your web builder interface</li>
              <li>
                Create a new page (e.g. your-website.com/store) and add the
                following HTML code within the page body (i.e. in the HTML body
                tag)
                <ol type="a" style={{ padding: 0 }}>
                  <StyledPre>
                    <code>{pretty(iframeString)}</code>
                    <StyledCopyButton
                      onClick={() => {
                        try {
                          navigator.clipboard.writeText(iframeString);
                          toast(() => "Text has been copied to clipboard");
                        } catch (error) {
                          console.error(error);
                          return false;
                        }
                      }}
                    >
                      <Copy size={24} color={colors.orange} weight="light" />
                    </StyledCopyButton>
                  </StyledPre>
                </ol>
              </li>
              <li>
                For example, this is what a simple HTML page would look like:
                <ol type="a" style={{ padding: 0 }}>
                  <StyledPre>
                    <code>{pretty(htmlString)}</code>
                  </StyledPre>
                </ol>
              </li>
            </ol>
          </div>
        </Collapse>
      </CollapsibleContainer>
      <Grid margin={`${marginBetweenContainers} 0 0 0`}>
        <BosonButton
          variant="primaryFill"
          type="button"
          onClick={() => hideModal()}
        >
          Done
        </BosonButton>
      </Grid>
    </>
  );
}
