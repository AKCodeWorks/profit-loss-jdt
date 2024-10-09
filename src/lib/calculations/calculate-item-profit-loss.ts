import type { Item } from "$lib/interfaces";

export function safeParseFloat(value: number | undefined | string): number {
  if (value === undefined) return 0;

  let parsedValue: number;

  if (typeof value === "string") {
    try {
      // get rid of currency symbols and string chars if they are there
      const sanitizedValue = value.replace(/[^0-9.-]+/g, "");
      parsedValue = parseFloat(sanitizedValue);
    } catch (e) {
      return 0;
    }
  } else if (typeof value === "number") {
    parsedValue = value;
  } else {
    return 0;
  }

  if (isNaN(parsedValue) || !isFinite(parsedValue)) {
    return 0;
  }

  const formattedValue = parsedValue.toFixed(2);

  return parseFloat(formattedValue);
}

export function calcluateItemProfitLoss(
  item: Item,
  asCurrency: boolean = false,
  locale: string = "en-GB",
  currency: string = "GBP"
): string | number {
  let sellingPrice = safeParseFloat(item.estimatedSellPrice);
  let isEstimated = true;

  if (item.actualSellPrice) {
    sellingPrice = safeParseFloat(item.actualSellPrice);
    isEstimated = false;
  }

  let consumables = safeParseFloat(item.cost);
  let shippingCost = safeParseFloat(item.shippingCost);
  let totalExpense = consumables + shippingCost;

  let result = sellingPrice - totalExpense;

  if (asCurrency) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    }).format(result);
  }

  return result;
}
