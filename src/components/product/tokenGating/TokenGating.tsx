import { useEffect, useState } from "react";
import styled from "styled-components";

import { breakpoint } from "../../../lib/styles/breakpoint";
import { useForm } from "../../../lib/utils/hooks/useForm";
import { useCoreSDK } from "../../../lib/utils/useCoreSdk";
import { FormField, Input, Select } from "../../form";
import BosonButton from "../../ui/BosonButton";
import Grid from "../../ui/Grid";
import { ProductButtonGroup, SectionTitle } from "../Product.styles";
import {
  TOKEN_CRITERIA,
  TOKEN_GATING_PER_OPTIONS,
  TOKEN_TYPES,
  TokenCriteriaTokenRange,
  TokenGatingPerToken
} from "../utils";

const ContainerProductPage = styled.div`
  width: 100%;
  .inputGroup:not(:last-of-type) {
    margin-bottom: 2rem;
  }
  ${breakpoint.m} {
    max-width: 45rem;
  }
`;

const StyledSelect = styled(Select)`
  && {
    height: initial;
  }
`;

const ProductInformationButtonGroup = styled(ProductButtonGroup)`
  margin-top: 1.563px;
`;

const StyledGrid = styled(Grid)`
  > * {
    min-width: fit-content;
  }
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
`;

const prefix = "tokenGating.";

const [{ value: minBalance }] = TOKEN_CRITERIA;
const [{ value: erc20 }, { value: erc721 }, { value: erc1155 }] = TOKEN_TYPES;
// logic extracted from https://miro.com/app/board/uXjVMDNFjuw=/
export default function TokenGating() {
  const { nextIsDisabled, values, handleBlur, setFieldValue } = useForm();
  const { tokenGating } = values;
  const core = useCoreSDK();
  const [symbol, setSymbol] = useState<string | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const tokenContract = tokenGating.tokenContract;
      const tokenType = tokenGating.tokenType;
      if (
        tokenContract &&
        tokenContract?.length > 0 &&
        tokenType?.value === erc20
      ) {
        try {
          const { symbol: symbolLocal } = await core.getExchangeTokenInfo(
            tokenContract
          );
          if (symbolLocal.length > 0) {
            setSymbol(symbolLocal);
          } else {
            setSymbol(undefined);
          }
        } catch (error) {
          setSymbol(undefined);
        }
      }
    })();
  }, [core, tokenGating.tokenContract, tokenGating.tokenType]);

  useEffect(() => {
    if (
      tokenGating.tokenType?.value === erc721 &&
      tokenGating.gatingType?.value === TokenGatingPerToken.value
    ) {
      setFieldValue(`${prefix}tokenCriteria`, TokenCriteriaTokenRange);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenGating.gatingType?.value, setFieldValue]);
  const walletOrToken =
    tokenGating.gatingType?.value === "wallet" ? "wallet" : "token";
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
              title="Token Type"
              subTitle="Choose an option"
              style={{ margin: "1rem 0 0 0" }}
              required
            >
              <Select name={`${prefix}tokenType`} options={TOKEN_TYPES} />
            </FormField>

            <FormField
              title="Token address"
              subTitle={`Enter the ${tokenGating.tokenType?.label}'s contract address`}
              style={{ margin: "1rem 0 0 0", width: "100%" }}
              required
            >
              <Input
                name={`${prefix}tokenContract`}
                type="string"
                onBlur={async (e) => {
                  handleBlur(e);
                }}
              />
            </FormField>
          </TokengatedInfoWrapper>

          <>
            {tokenGating.tokenType?.value === erc20 && (
              <>
                <StyledGrid
                  flex="1"
                  flexWrap="wrap"
                  gap="1rem"
                  alignItems="flex-start"
                >
                  <FormField
                    title="Minimum token balance"
                    subTitle="Specify the minimum token balance a wallet must hold to unlock this gate"
                    style={{ margin: "1rem 0 0 0" }}
                    required
                  >
                    <Input name={`${prefix}minBalance`} type="string" />
                  </FormField>
                  {symbol && (
                    <FormField
                      title="Currency"
                      subTitle="Set from the token address"
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
                </StyledGrid>
                <Grid alignItems="flex-start">
                  <FormField
                    title="Unlocks per wallet"
                    subTitle={`Specify the maximum number of times a wallet can unlock the token gate`}
                    style={{ margin: "1rem 0 0 0" }}
                    required
                  >
                    <Input name={`${prefix}maxCommits`} type="string" />
                  </FormField>
                </Grid>
              </>
            )}

            {tokenGating.tokenType?.value === erc721 && (
              <>
                <StyledGrid
                  flex="1"
                  flexWrap="wrap"
                  gap="1rem"
                  alignItems="flex-start"
                >
                  <FormField
                    title="Token gating type"
                    subTitle="Gate per wallet or per token"
                    style={{ margin: "1rem 0 0 0" }}
                    required
                  >
                    <StyledSelect
                      name={`${prefix}gatingType`}
                      options={TOKEN_GATING_PER_OPTIONS}
                    />
                  </FormField>
                  <FormField
                    title="Token gating ownership requirements"
                    subTitle="Specify a minimum collection balance or target a token range"
                    style={{ margin: "1rem 0 0 0" }}
                    required
                  >
                    <StyledSelect
                      name={`${prefix}tokenCriteria`}
                      options={TOKEN_CRITERIA}
                      disabled={
                        tokenGating.gatingType?.value ===
                        TokenGatingPerToken.value
                      }
                    />
                  </FormField>

                  {tokenGating.tokenCriteria?.value === minBalance ? (
                    <FormField
                      title="Minimum collection balance"
                      subTitle="Specify the minimum number of NFTs  that a wallet must hold"
                      style={{ margin: "1rem 0 0 0" }}
                      required
                    >
                      <Input name={`${prefix}minBalance`} type="string" />
                    </FormField>
                  ) : (
                    <Grid gap="1rem" alignItems="flex-start">
                      <FormField
                        title="Minimum token ID in range"
                        subTitle="Enter the min token ID in the range (it can be the same as the maximum)"
                        style={{ margin: "1rem 0 0 0" }}
                      >
                        <Input name={`${prefix}minTokenId`} type="string" />
                      </FormField>
                      <FormField
                        title="Maximum token ID in range"
                        subTitle="Enter the max token ID in the range (it can be the same as the minimum)"
                        style={{ margin: "1rem 0 0 0" }}
                      >
                        <Input name={`${prefix}maxTokenId`} type="string" />
                      </FormField>
                    </Grid>
                  )}
                </StyledGrid>
                <Grid alignItems="flex-start">
                  <FormField
                    title={`Unlocks per ${walletOrToken}`}
                    subTitle={`Specify the maximum number of times a ${walletOrToken} can unlock the token gate`}
                    required
                    style={{ margin: "1rem 0 0 0" }}
                  >
                    <Input name={`${prefix}maxCommits`} type="string" />
                  </FormField>
                </Grid>
              </>
            )}
          </>
          {tokenGating.tokenType?.value === erc1155 && (
            <>
              <Grid gap="1rem" alignItems="flex-start">
                <FormField
                  title="Minimum token ID in range"
                  subTitle="Enter the min token ID in the range (it can be the same as the maximum)"
                  style={{ margin: "1rem 0 0 0" }}
                >
                  <Input name={`${prefix}minTokenId`} type="string" />
                </FormField>
                <FormField
                  title="Maximum token ID in range"
                  subTitle="Enter the max token ID in the range (it can be the same as the minimum)"
                  style={{ margin: "1rem 0 0 0" }}
                >
                  <Input name={`${prefix}maxTokenId`} type="string" />
                </FormField>
              </Grid>
              <StyledGrid
                flex="1"
                flexWrap="wrap"
                gap="1rem"
                alignItems="flex-start"
              >
                <FormField
                  title="Minimum token balance"
                  subTitle="Specify the minimum token balance a wallet must hold to unlock this gate"
                  required
                  style={{ margin: "1rem 0 0 0" }}
                >
                  <Input name={`${prefix}minBalance`} type="string" />
                </FormField>
                <FormField
                  title="Token gating type"
                  subTitle="Gate per wallet or per token"
                  style={{ margin: "1rem 0 0 0" }}
                  required
                >
                  <StyledSelect
                    name={`${prefix}gatingType`}
                    options={TOKEN_GATING_PER_OPTIONS}
                  />
                </FormField>

                <FormField
                  title={`Unlocks per ${walletOrToken}`}
                  subTitle={`Specify the maximum number of times a ${walletOrToken} can unlock the token gate`}
                  required
                  style={{ margin: "1rem 0 0 0" }}
                >
                  <Input name={`${prefix}maxCommits`} type="string" />
                </FormField>
              </StyledGrid>
            </>
          )}

          {/* 
          // TODO: might come back later
          <Grid>
            <FormField
              title="Token gating description"
              style={{ margin: "1rem 0 0 0" }}
            >
              <TokengatedTextarea
                name={`${prefix}tokenGatingDesc`}
                placeholder="Token gating description"
              />
            </FormField>
          </Grid> */}
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
