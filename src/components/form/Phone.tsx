/* eslint @typescript-eslint/no-explicit-any: "off" */
import { useField, useFormikContext } from "formik";
import { GlobeHemisphereWest } from "phosphor-react";
import { useCallback, useEffect, useState } from "react";
import type { Country as CountryCode } from "react-phone-number-input";
import PhoneInput, {
  formatPhoneNumberIntl,
  getCountryCallingCode,
  isSupportedCountry,
  isValidPhoneNumber,
  parsePhoneNumber
} from "react-phone-number-input";
import Select, { components } from "react-select";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import Error from "./Error";
import { FieldInput } from "./Field.styles";
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

export const ControlGrid = styled.div`
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
export const OptionGrid = styled.div`
  display: grid;
  grid-auto-columns: 1fr;
  grid-template-columns: 2em 1fr;
  gap: 0.5rem;
  .PhoneInputCountryIcon img {
    max-width: 30px;
  }
`;

export const PhoneWrapper = styled.div`
  width: 100%;
  padding-bottom: 0.5rem;
  .PhoneInput {
    width: 100%;
    display: grid;
    grid-auto-columns: 1fr;
    grid-template-columns: 14em 1fr;
    gap: 0.5rem;
    align-items: center;
  }
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

const handleCountry = () => {
  const countryCode = (navigator?.language || "")?.toUpperCase() as CountryCode;
  if (isSupportedCountry(countryCode as CountryCode)) return countryCode;
  return "ZW" as CountryCode;
};

export default function Phone({ name, ...props }: InputProps) {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [phone, setPhone] = useState<string | undefined>(undefined);
  const [countryCode, setCountryCode] = useState<CountryCode>(handleCountry());

  const { status } = useFormikContext();
  const [field, meta, helpers] = useField(name);
  const errorText = meta.error || status?.[name];
  const errorMessage = errorText && meta.touched ? errorText : "";
  const displayError =
    typeof errorMessage === typeof "string" && errorMessage !== "";

  const handlePhoneChange = useCallback(
    (value: string) => {
      const callingCode = countryCode
        ? getCountryCallingCode(countryCode as CountryCode)
        : false;
      const newValue = formatPhoneNumberIntl(
        `${callingCode ? `+${callingCode}` : ""}${value}`
      );

      if (!isValidPhoneNumber(newValue)) {
        if (!meta.touched) {
          helpers.setTouched(true);
        }
        helpers.setError(
          newValue === ""
            ? "Phone number is required"
            : "Wrong phone number format"
        );
      }
      helpers.setValue(newValue);
    },
    [helpers, countryCode, meta.touched]
  );

  useEffect(() => {
    if (phone !== undefined) {
      handlePhoneChange(phone);
    }
  }, [countryCode, phone]); // eslint-disable-line

  useEffect(() => {
    if (!initialized && field.value) {
      const parsed = parsePhoneNumber(field.value);
      setInitialized(true);
      setPhone(parsed?.nationalNumber || "");
      if (parsed?.country) {
        setCountryCode(parsed?.country as CountryCode);
      }
    }
  }, [field.value, initialized]); // eslint-disable-line

  return (
    <>
      <PhoneWrapper>
        <PhoneInput
          country={countryCode}
          value={phone}
          onChange={(value) => setPhone((value || "").replace(/\+/g, ""))}
          countrySelectComponent={({ iconComponent: Icon, ...props }) => (
            <>
              <div>
                <Select
                  {...props}
                  styles={customStyles}
                  name="phoneCountry"
                  value={(props?.options || []).find(
                    (o: SelectDataProps) => o.value === countryCode
                  )}
                  onChange={(o: SelectDataProps) =>
                    setCountryCode(o.value as CountryCode)
                  }
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
      <FieldInput
        type="hidden"
        error={errorMessage}
        disabled
        {...field}
        {...props}
      />
      <Error
        display={!props.hideError && displayError}
        message={errorMessage}
      />
    </>
  );
}
