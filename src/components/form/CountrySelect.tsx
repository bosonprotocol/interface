/* eslint @typescript-eslint/no-explicit-any: "off" */
import { useField, useFormikContext } from "formik";
import { GlobeHemisphereWest } from "phosphor-react";
import { forwardRef, useState } from "react";
import type { Country as CountryCode } from "react-phone-number-input";
import PhoneInput from "react-phone-number-input";
import Select, { components } from "react-select";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import Error from "./Error";
import type { InputProps } from "./types";
import { SelectDataProps } from "./types";
const customStyles = {
  control: (provided: any, state: any) => {
    const before = state.selectProps.label
      ? {
          ":before": {
            content: `"${state.selectProps.label}"`,
            fontWeight: "600",
            paddingLeft: "1rem"
          }
        }
      : null;
    return {
      ...provided,
      borderRadius: 0,
      padding: "0.4rem 0.25rem",
      boxShadow: "none",
      ":hover": {
        borderColor: colors.secondary,
        borderWidth: "1px"
      },
      background: colors.lightGrey,
      border: state.isFocused
        ? `1px solid ${colors.secondary}`
        : `1px solid ${colors.border}`,
      ...before
    };
  },
  container: (provided: any, state: any) => ({
    ...provided,
    zIndex: state.isFocused ? zIndex.Select + 1 : zIndex.Select,
    position: "relative",
    width: "100%"
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    cursor: state.isDisabled ? "not-allowed" : "pointer",
    opacity: state.isDisabled ? "0.5" : "1",
    background:
      state.isOptionSelected || state.isSelected || state.isFocused
        ? colors.lightGrey
        : colors.white,
    color:
      state.isOptionSelected || state.isSelected
        ? colors.secondary
        : colors.black
  }),
  indicatorSeparator: () => ({
    display: "none"
  })
};

const ControlGrid = styled.div`
  display: flex;
  width: 100%;
  gap: 0.25rem;
  align-items: center;
  justify-content: space-between;
  .PhoneInputCountryIcon {
    min-width: 40px;
    display: inline;
    height: 27px;
    img {
      max-width: 40px;
    }
  }
`;
const OptionGrid = styled.div`
  display: grid;
  grid-auto-columns: 1fr;
  grid-template-columns: 2em 1fr;
  gap: 1rem;
  align-items: center;
  .PhoneInputCountryIcon img {
    max-width: 30px;
  }
`;

const PhoneWrapper = styled.div`
  width: 100%;
  padding-bottom: 0.5rem;
  input {
    width: 100%;
    padding: 1rem;
    gap: 0.5rem;
    background: ${colors.lightGrey};
    border: 1px solid ${colors.border};
    border-radius: 0;
    outline: none;
    font-family: "Plus Jakarta Sans";
    transition: all 150ms ease-in-out;
  }
`;

type Props = InputProps & {
  countries?: CountryCode[];
};

export function CountrySelect({ name, countries, ...props }: Props) {
  const { status } = useFormikContext();
  const [, meta, helpers] = useField(name);
  const errorText = meta.error || status?.[name];
  const errorMessage = errorText && meta.touched ? errorText : "";
  const displayError =
    typeof errorMessage === typeof "string" && errorMessage !== "";
  const [phone, setPhone] = useState<string | undefined>(undefined);
  const [countryCode, setCountryCode] = useState<CountryCode | undefined>();
  return (
    <>
      <PhoneWrapper>
        <PhoneInput
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          inputComponent={forwardRef((props, ref) => (
            <div></div>
          ))}
          addInternationalOption={false}
          country={countryCode}
          value={phone}
          onChange={(value) => setPhone((value || "").replace(/\+/g, ""))}
          countries={countries}
          countrySelectComponent={({ iconComponent: Icon, ...props }) => (
            <>
              <div>
                <Select
                  {...props}
                  styles={customStyles}
                  name="countrySelect"
                  value={(props?.options || []).find(
                    (o: SelectDataProps) => o.value === countryCode
                  )}
                  onChange={(o: SelectDataProps) => {
                    setCountryCode(o.value as CountryCode);
                    helpers.setValue(o.label);
                  }}
                  components={{
                    Control: (props) => {
                      const country =
                        (props?.getValue()[0] as any)?.value || null;
                      return (
                        <components.Control {...props}>
                          <ControlGrid>
                            {country ? (
                              <Icon country={country as CountryCode} label="" />
                            ) : (
                              <GlobeHemisphereWest />
                            )}
                            {props.children}
                          </ControlGrid>
                        </components.Control>
                      );
                    },
                    Option: (props) => {
                      const country = (props?.data as any)?.value || null;
                      return (
                        <components.Option {...props}>
                          <OptionGrid>
                            {country ? (
                              <Icon
                                country={country as CountryCode}
                                label={props.label}
                              />
                            ) : (
                              <GlobeHemisphereWest />
                            )}
                            {props.label}
                          </OptionGrid>
                        </components.Option>
                      );
                    }
                  }}
                />
              </div>
            </>
          )}
        />
      </PhoneWrapper>
      <Error
        display={!props.hideError && displayError}
        message={errorMessage}
      />
    </>
  );
}
