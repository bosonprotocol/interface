import { Currency, CurrencyAmount, Price } from "@uniswap/sdk-core";
import { DEFAULT_LOCALE } from "lib/constants/locales";

interface FormatLocaleNumberArgs {
  number: CurrencyAmount<Currency> | Price<Currency, Currency> | number;
  locale: string;
  options?: Intl.NumberFormatOptions;
  sigFigs?: number;
  fixedDecimals?: number;
}

export default function formatLocaleNumber({
  number,
  locale,
  sigFigs,
  fixedDecimals,
  options = {}
}: FormatLocaleNumberArgs): string {
  const localeArg: string[] = [locale, DEFAULT_LOCALE];

  options.minimumFractionDigits =
    options.minimumFractionDigits || fixedDecimals;
  options.maximumFractionDigits =
    options.maximumFractionDigits || fixedDecimals;

  // Fixed decimals should override significant figures.
  options.maximumSignificantDigits =
    options.maximumSignificantDigits || fixedDecimals ? undefined : sigFigs;

  let numberString: number;
  if (typeof number === "number") {
    numberString = fixedDecimals
      ? parseFloat(number.toFixed(fixedDecimals))
      : number;
  } else {
    const baseString = parseFloat(number.toSignificant(sigFigs));
    numberString = fixedDecimals
      ? parseFloat(baseString.toFixed(fixedDecimals))
      : baseString;
  }

  return numberString.toLocaleString(localeArg, options);
}
