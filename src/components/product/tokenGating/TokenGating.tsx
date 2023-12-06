import { Currency } from "@uniswap/sdk-core";
import CurrencySearchModal from "components/searchModal/CurrencySearchModal";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import { breakpoint } from "../../../lib/styles/breakpoint";
import { useForm } from "../../../lib/utils/hooks/useForm";
import { useCoreSDK } from "../../../lib/utils/useCoreSdk";
import { FormField, Input, Select } from "../../form";
import BosonButton from "../../ui/BosonButton";
import Grid from "../../ui/Grid";
import { ProductButtonGroup, SectionTitle } from "../Product.styles";
import { TOKEN_CRITERIA, TOKEN_TYPES } from "../utils";

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

export default function TokenGating() {
  const [modalOpen, setModalOpen] = useState(false);
  const handleDismissSearch = useCallback(() => {
    setModalOpen(false);
  }, [setModalOpen]);
  const handleOnCurrencySelect = useCallback((currency: Currency) => {
    if (currency.isToken) {
      setFieldValue(`${prefix}tokenContract`, currency.address);
    } else {
      setFieldValue(`${prefix}tokenContract`, "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
          const result = await core.getExchangeTokenInfo(tokenContract);
          const { symbol: symbolLocal } = result ?? {};
          if (symbolLocal && symbolLocal.length > 0) {
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
                onClick={
                  tokenGating.tokenType?.value === erc20
                    ? () => {
                        setModalOpen(true);
                      }
                    : undefined
                }
                readOnly={tokenGating.tokenType?.value === erc20}
                isClearable={tokenGating.tokenType?.value === erc20}
              />
            </FormField>
            {tokenGating.tokenType?.value === erc20 && (
              <CurrencySearchModal
                isOpen={modalOpen}
                onDismiss={handleDismissSearch}
                onCurrencySelect={handleOnCurrencySelect}
                selectedCurrency={undefined}
                otherSelectedCurrency={undefined}
                showCommonBases={false}
                showCurrencyAmount={false}
                disableNonToken={true}
              />
            )}
          </TokengatedInfoWrapper>

          <>
            {tokenGating.tokenType?.value === erc721 && (
              <StyledGrid flex="1" flexWrap="wrap" gap="1rem">
                <FormField
                  title="Token gating ownership requirements"
                  subTitle="Target a specific NFT or specify a minimum collection balance"
                  style={{ margin: "1rem 0 0 0" }}
                  required
                >
                  <StyledSelect
                    name={`${prefix}tokenCriteria`}
                    options={TOKEN_CRITERIA}
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
                  <FormField
                    title="Token ID"
                    subTitle="Enter the Token ID for the specific NFT"
                    style={{ margin: "1rem 0 0 0" }}
                  >
                    <Input name={`${prefix}tokenId`} type="string" />
                  </FormField>
                )}
              </StyledGrid>
            )}

            {tokenGating.tokenType?.value === erc20 && (
              <StyledGrid flex="1" flexWrap="wrap" gap="1rem">
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
            )}
          </>
          {tokenGating.tokenType?.value === erc1155 ? (
            <>
              <Grid>
                <FormField
                  title="Token ID"
                  subTitle="Enter the specific Token ID from the ERC1155"
                  style={{ margin: "1rem 0 0 0" }}
                  required
                >
                  <Input name={`${prefix}tokenId`} type="string" />
                </FormField>
              </Grid>
              <StyledGrid flex="1" flexWrap="wrap" gap="1rem">
                <FormField
                  title="Minimum token balance"
                  subTitle="Specify the minimum token balance a wallet must hold to unlock this gate"
                  required
                  style={{ margin: "1rem 0 0 0" }}
                >
                  <Input name={`${prefix}minBalance`} type="string" />
                </FormField>

                <FormField
                  title="Unlocks per wallet"
                  subTitle="Specify the maximum number of times a wallet can unlock the token gate"
                  required
                  style={{ margin: "1rem 0 0 0" }}
                >
                  <Input name={`${prefix}maxCommits`} type="string" />
                </FormField>
              </StyledGrid>
            </>
          ) : (
            <Grid>
              <FormField
                title="Unlocks per wallet"
                subTitle="Specify the maximum number of times a wallet can unlock the token gate"
                style={{ margin: "1rem 0 0 0" }}
                required
              >
                <Input name={`${prefix}maxCommits`} type="string" />
              </FormField>
            </Grid>
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
