import styled from "styled-components";

import Collapse from "../../components/collapse/Collapse";
import { Modal } from "../../components/modal/Modal";
import { colors } from "../../lib/styles/colors";

const ModalContent = styled.div`
  margin: -35px 5% 0 5%;
`;

const CollapseContent = styled.div`
  margin: 0 10%;
`;

const Title = styled.p`
  font-size: 2.3rem;
  text-align: center;
  margin-top: 0;
`;

const UrlContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const CyanLink = styled.a`
  color: ${colors.cyan};
`;

const UrlBox = styled(CyanLink)`
  background-color: ${colors.navy};
  outline: 1px solid grey;
  padding: 10px;
  flex: 1 1;
  border-radius: 10px;
  text-align: center;
  overflow-wrap: anywhere;
`;

const Heading = styled.p`
  all: unset;
  font-size: 1.2rem;
`;

const CollapsibleContainer = styled.div`
  margin-top: 30px;
`;

const Steps = styled.div`
  display: flex;
  justify-content: center;
`;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  ipfsUrl: string;
}

export default function CustomStoreModal({ isOpen, onClose, ipfsUrl }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={() => onClose()}>
      <ModalContent>
        <Title>Congratulations!</Title>
        {ipfsUrl && (
          <UrlContainer>
            <Heading>Custom Store URL</Heading>
            <UrlBox href={ipfsUrl}>{ipfsUrl}</UrlBox>
          </UrlContainer>
        )}
        <CollapsibleContainer>
          <Collapse title={<Heading>Link to ENS</Heading>}>
            <CollapseContent>
              <p>
                To improve your users' experience, you can provide them with a
                branded link by hooking up the above redirect link to your ENS
                (sub)domain.
              </p>
              <Steps>
                <ol>
                  <li>
                    Navigate to{" "}
                    <CyanLink href="https://app.ens.domains/" target="_blank">
                      https://app.ens.domains/
                    </CyanLink>{" "}
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
                    You can then share this ENS domain with your users.
                    <ol type="a">
                      <li>
                        Add a ".link" suffix to the ENS domain
                        <br />
                        i. e.g.{" "}
                        <CyanLink
                          href="https://ensDomain.eth.link"
                          target="_blank"
                        >
                          https://ensDomain.eth.link
                        </CyanLink>
                      </li>
                    </ol>
                  </li>
                </ol>
              </Steps>
            </CollapseContent>
          </Collapse>
        </CollapsibleContainer>
        <CollapsibleContainer>
          <Collapse title={<Heading>Pin IPFS redirect</Heading>}>
            <CollapseContent>
              <p>
                To improve your users' experience, you can pin the IPFS file
                (i.e. the above Custom Store URL) to your IPFS node gateway.
                This enables guaranteed and faster loading times.
              </p>
            </CollapseContent>
          </Collapse>
        </CollapsibleContainer>
      </ModalContent>
    </Modal>
  );
}
