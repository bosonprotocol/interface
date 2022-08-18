import { Warning } from "phosphor-react";
import styled from "styled-components";

import Collapse from "../../components/collapse/Collapse";
import { colors } from "../../lib/styles/colors";
import Button from "../ui/Button";
import Typography from "../ui/Typography";
import {
  ContainerProductPage,
  ProductButtonGroup,
  SectionTitle
} from "./Product.styles";

const ConfirmProductDetailsContainer = styled(ContainerProductPage)`
  max-width: 65.588rem;
  margin 0 auto;
  padding-bottom: 10.875rem;
`;

const CollapseContainer = styled.div`
  padding: 1.5rem 2rem;
  background: ${colors.lightGrey};
  &:nth-of-type(2) {
    margin-top: 2rem;
    margin-bottom: 2rem;
  }
  h3 {
    margin: 0;
  }
  button {
    div {
      display: flex;
    }
  }
`;

const ConfirmationAlert = styled.div`
  padding: 1.5rem 1.5rem 1.5rem 1.625rem;
  background: ${colors.black};
  margin-top: 2rem;
  display: flex;
  color: ${colors.white};
`;

const IconWrapper = styled.div`
  width: 3.125rem;
  > svg {
    color: ${colors.green};
  }
`;

const ConfirmationContent = styled.div`
  width: calc(100% - 3.125rem);
  p {
    margin: 0;
    line-height: 1.5rem;
  }
  p:first-child {
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
`;

const ConfirmProductDetailsButtonGroup = styled(ProductButtonGroup)`
  margin: 5rem 0 0 0;
`;

interface Props {
  togglePreview: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ConfirmProductDetails({ togglePreview }: Props) {
  const handleOpenPreview = () => {
    togglePreview(true);
  };
  return (
    <ConfirmProductDetailsContainer>
      <SectionTitle tag="h2">Confirm Product Details</SectionTitle>
      <CollapseContainer>
        <Collapse title={<Typography tag="h3">Profile Info</Typography>}>
          {/* TODO NEED TO BE IMPLEMENTED */}
        </Collapse>
      </CollapseContainer>
      <CollapseContainer>
        <Collapse title={<Typography tag="h3">Product Data</Typography>}>
          {/* TODO NEED TO BE IMPLEMENTED */}
        </Collapse>
      </CollapseContainer>
      <CollapseContainer>
        <Collapse title={<Typography tag="h3">Terms of Sale</Typography>}>
          {/* TODO NEED TO BE IMPLEMENTED */}
        </Collapse>
      </CollapseContainer>
      <ConfirmationAlert>
        <IconWrapper>
          <Warning />
        </IconWrapper>
        <ConfirmationContent>
          <Typography tag="p">
            You wont be able to make changes after confirming
          </Typography>
          <Typography tag="p">
            By selecting confirm, you agree to pay the above fees, accept Boson
            seller agreement and Payments Terms of Use, acknowledge reading the
            User Privacy Notice and assume full responsibility for the item
            offered and the content of your listing.
          </Typography>
        </ConfirmationContent>
      </ConfirmationAlert>
      <ConfirmProductDetailsButtonGroup>
        <Button theme="secondary" type="submit">
          Confirm
        </Button>
        <Button theme="primary" type="button" onClick={handleOpenPreview}>
          Preview product detail page
        </Button>
      </ConfirmProductDetailsButtonGroup>
    </ConfirmProductDetailsContainer>
  );
}
