import { safeParseFloat } from "./";

import type { Item } from "$lib/interfaces";

export function calcluateItemProfitLoss(
  item: Item,
  asCurrency: boolean = false,
  locale: string = "en-GB",
  currency: string = "GBP",
  sellersFee: number | string = 0
): string | number {
  let sellingPrice = safeParseFloat(item.estimatedSellPrice);
  let isEstimated = true;
  let sellFee = safeParseFloat(sellersFee);
  if (item.actualSellPrice) {
    sellingPrice = safeParseFloat(item.actualSellPrice);
    isEstimated = false;
    sellFee = 0;
  }

  let consumables = safeParseFloat(item.cost);
  let expenses = safeParseFloat(item.expenses);
  let shippingCost = safeParseFloat(item.shippingCost);
  let totalExpense =
    consumables + shippingCost + expenses + sellingPrice * sellFee;

  let result = sellingPrice - totalExpense;

  if (asCurrency) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    }).format(result);
  }

  return result;
}
