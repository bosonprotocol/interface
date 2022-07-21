import isArray from "lodash/isArray";
import styled from "styled-components";

import CreateYourProfile from "../../components/product/CreateYourProfile";
import Help from "../../components/product/Help";
// import ProductType from "../../components/product/ProductType";
import { createYourProfileHelp } from "./helpData";

const ProductLayoutContainer = styled.main`
  display: flex;
  justify-content: space-between;
`;

const MockStepper = styled.div`
  width: 100%;
  background: black;
  height: 50px;
`;

const MockStepperButton = styled.button`
  width: 100px;
  background: white;
  height: 50px;
  margin-right: 1rem;
`;

export default function CreateProduct() {
  return (
    <>
      <MockStepper>
        <MockStepperButton>1</MockStepperButton>
        <MockStepperButton>2</MockStepperButton>
        <MockStepperButton>3</MockStepperButton>
        <MockStepperButton>4</MockStepperButton>
      </MockStepper>
      <ProductLayoutContainer>
        <CreateYourProfile />
        {/* <ProductType /> */}
        {isArray(createYourProfileHelp) && (
          <Help data={createYourProfileHelp} />
        )}
      </ProductLayoutContainer>
    </>
  );
}
