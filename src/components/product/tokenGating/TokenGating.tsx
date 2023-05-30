import { useState } from "react";
import styled from "styled-components";

import { useCoreSDK } from "../../../lib/utils/useCoreSdk";
import { FormField, Input, Select, Textarea } from "../../form";
import BosonButton from "../../ui/BosonButton";
import Grid from "../../ui/Grid";
import {
  ContainerProductPage,
  ProductButtonGroup,
  SectionTitle
} from "../Product.styles";
import { TOKEN_CRITERIA, TOKEN_TYPES } from "../utils";
import { useCreateForm } from "../utils/useCreateForm";

const ProductInformationButtonGroup = styled(ProductButtonGroup)`
  margin-top: 1.563px;
`;

const TokengatedTextarea = styled(Textarea)`
  padding: 0.5rem;
  min-width: 100%;
  max-width: 100%;
  min-height: 54px;
  max-height: 500px;
`;

const TokengatedInfoWrapper = styled.div`
  display: grid;
  grid-template-columns: minmax(8.75rem, 1fr) 4fr;
  grid-gap: 1rem;
`;

const SymbolInput = styled(Input)`
  width: 20%;
  height: 100%;
  margin-top: 20px;
`;

const prefix = "tokenGating.";

const [{ value: minBalance }] = TOKEN_CRITERIA;
const [{ value: erc20 }, { value: erc721 }, { value: erc1155 }] = TOKEN_TYPES;

export default function TokenGating() {
  const { nextIsDisabled, values, handleBlur } = useCreateForm();
  const { tokenGating } = values;
  const core = useCoreSDK();
  const [symbol, setSymbol] = useState<string | undefined>(undefined);

  return (
    <ContainerProductPage>
      <SectionTitle tag="h2">Token Gating</SectionTitle>

      <FormField
        title="Token gated offer"
        subTitle="Limit the purchase of your item to users holding a specific token."
      >
        <>
          <TokengatedInfoWrapper>
            <FormField title="Token Type:" style={{ margin: "1rem 0 0 0" }}>
              <Select name={`${prefix}tokenType`} options={TOKEN_TYPES} />
            </FormField>

            <FormField title="Token Contract" style={{ margin: "1rem 0 0 0" }}>
              <Input
                name={`${prefix}tokenContract`}
                type="string"
                onBlur={async (e) => {
                  handleBlur(e);
                  const tokenContract = tokenGating.tokenContract;
                  const tokenType = tokenGating.tokenType;
                  if (
                    tokenContract &&
                    tokenContract?.length > 0 &&
                    tokenType?.value === erc20
                  ) {
                    try {
                      const { symbol: symbolLocal } =
                        await core.getExchangeTokenInfo(tokenContract);
                      if (symbolLocal.length > 0) {
                        setSymbol(symbolLocal);
                      } else {
                        setSymbol(undefined);
                      }
                    } catch (error) {
                      setSymbol(undefined);
                    }
                  }
                }}
              />
            </FormField>
          </TokengatedInfoWrapper>

          <>
            {tokenGating.tokenType?.value === erc721 && (
              <TokengatedInfoWrapper>
                <FormField
                  title="Criteria:"
                  style={{ margin: "1rem 0 0 0", flexBasis: "50px" }}
                >
                  <Select
                    name={`${prefix}tokenCriteria`}
                    options={TOKEN_CRITERIA}
                  />
                </FormField>
                {tokenGating.tokenCriteria?.value === minBalance ? (
                  <FormField
                    title="Min Balance:"
                    style={{ margin: "1rem 0 0 0" }}
                  >
                    <Input name={`${prefix}minBalance`} type="string" />
                  </FormField>
                ) : (
                  <FormField title="TokenId:" style={{ margin: "1rem 0 0 0" }}>
                    <Input name={`${prefix}tokenId`} type="string" />
                  </FormField>
                )}
              </TokengatedInfoWrapper>
            )}

            {(tokenGating.tokenType?.value === erc20 ||
              tokenGating.tokenType?.value === erc1155) && (
              <Grid gap="1rem" alignItems="flex-start">
                <FormField
                  title="Min Balance:"
                  style={{ margin: "1rem 0 0 0" }}
                >
                  <Input name={`${prefix}minBalance`} type="string" />
                </FormField>
                {symbol && tokenGating.tokenType?.value === erc20 && (
                  <SymbolInput
                    type="string"
                    name={`${prefix}symbol`}
                    value={symbol}
                    disabled
                  />
                )}
                {tokenGating.tokenType?.value === erc1155 && (
                  <FormField title="TokenId:" style={{ margin: "1rem 0 0 0" }}>
                    <Input name={`${prefix}tokenId`} type="string" />
                  </FormField>
                )}
              </Grid>
            )}
          </>
          <Grid>
            <FormField title="Max commits:" style={{ margin: "1rem 0 0 0" }}>
              <Input name={`${prefix}maxCommits`} type="string" />
            </FormField>
          </Grid>
          <Grid>
            <FormField
              title="Token Gating Description:"
              style={{ margin: "1rem 0 0 0" }}
              tooltip="This offer requires to own at least one NFT of Makersplace collection: https://opensea.io/collection/makersplace"
            >
              <TokengatedTextarea
                name={`${prefix}tokenGatingDesc`}
                placeholder="Token Gating Description"
              />
            </FormField>
          </Grid>
        </>
      </FormField>
      <ProductInformationButtonGroup>
        <BosonButton
          variant="primaryFill"
          type="submit"
          disabled={nextIsDisabled}
        >
          Next
        </BosonButton>
      </ProductInformationButtonGroup>
    </ContainerProductPage>
  );
}
