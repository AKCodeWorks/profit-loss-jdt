import { safeParseFloat } from "$lib/calculations";

export function stringToCurrency(
  value: string | number,
  locale: string | undefined,
  currency: string | undefined
) {
  return new Intl.NumberFormat(locale || "en-GB", {
    style: "currency",
    currency: currency || "GBP",
    trailingZeroDisplay: "stripIfInteger",
  }).format(safeParseFloat(value));
}
