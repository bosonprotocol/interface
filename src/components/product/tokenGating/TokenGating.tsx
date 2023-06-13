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
  grid-template-columns: minmax(8.75rem, max-content) 4fr;
  grid-gap: 1rem;
  width: 100%;
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
        subTitle="Configure your token gated offer using the fields below"
      >
        <>
          <TokengatedInfoWrapper>
            <FormField
              title="Token Type:"
              style={{ margin: "1rem 0 0 0" }}
              required
            >
              <Select name={`${prefix}tokenType`} options={TOKEN_TYPES} />
            </FormField>

            <FormField
              title="Token Contract"
              style={{ margin: "1rem 0 0 0", width: "100%" }}
              required
            >
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
                  title="Token gating ownership requirements:"
                  style={{ margin: "1rem 0 0 0" }}
                  required
                >
                  <Select
                    name={`${prefix}tokenCriteria`}
                    options={TOKEN_CRITERIA}
                  />
                </FormField>
                {tokenGating.tokenCriteria?.value === minBalance ? (
                  <FormField
                    title="Minimum balance:"
                    style={{ margin: "1rem 0 0 0" }}
                    required
                  >
                    <Input name={`${prefix}minBalance`} type="string" />
                  </FormField>
                ) : (
                  <FormField title="Token ID:" style={{ margin: "1rem 0 0 0" }}>
                    <Input name={`${prefix}tokenId`} type="string" />
                  </FormField>
                )}
              </TokengatedInfoWrapper>
            )}

            {tokenGating.tokenType?.value === erc20 && (
              <Grid gap="1rem" alignItems="flex-start">
                <FormField
                  title="Minimum balance:"
                  style={{ margin: "1rem 0 0 0" }}
                  required
                >
                  <Input name={`${prefix}minBalance`} type="string" />
                </FormField>
                {symbol && (
                  <FormField
                    title=""
                    style={{ margin: "1rem 0 0 0", flex: "0" }}
                  >
                    <SymbolInput
                      type="string"
                      name={`${prefix}symbol`}
                      value={symbol}
                      disabled
                      style={{ width: "initial" }}
                    />
                  </FormField>
                )}
              </Grid>
            )}
          </>
          {tokenGating.tokenType?.value === erc1155 ? (
            <>
              <Grid>
                <FormField
                  title="Token ID:"
                  style={{ margin: "1rem 0 0 0" }}
                  required
                >
                  <Input name={`${prefix}tokenId`} type="string" />
                </FormField>
              </Grid>
              <Grid gap="1rem" alignItems="flex-start">
                <FormField
                  title="Minimum balance:"
                  required
                  style={{ margin: "1rem 0 0 0" }}
                >
                  <Input name={`${prefix}minBalance`} type="string" />
                </FormField>

                <FormField
                  title="Maximum commits:"
                  required
                  style={{ margin: "1rem 0 0 0" }}
                >
                  <Input name={`${prefix}maxCommits`} type="string" />
                </FormField>
              </Grid>
            </>
          ) : (
            <Grid>
              <FormField
                title="Maximum commits:"
                style={{ margin: "1rem 0 0 0" }}
                required
              >
                <Input name={`${prefix}maxCommits`} type="string" />
              </FormField>
            </Grid>
          )}

          <Grid>
            <FormField
              title="Token gating description:"
              style={{ margin: "1rem 0 0 0" }}
            >
              <TokengatedTextarea
                name={`${prefix}tokenGatingDesc`}
                placeholder="Token gating description"
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
