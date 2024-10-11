import type { Episode, Item, Season } from "$lib/interfaces";

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

export function calculateEpisodeProfitLoss(
  episode: Episode,
  locale: string,
  currency: string
) {
  let total = 0;

  episode.items.forEach((item) => {
    total += safeParseFloat(calcluateItemProfitLoss(item));
  });

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(total);
}

export function calculateSeasonTotalProfitLoss(
  season: Season,
  locale: string,
  currency: string
) {
  let total = 0;

  season.episodes.forEach((episode) => {
    total += safeParseFloat(
      calculateEpisodeProfitLoss(episode, locale, currency)
    );
  });

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(total);
}

export function calculateSeasonGoalPercentage(season: Season) {
  let total = 0;

  season.episodes.forEach((episode) => {
    total += safeParseFloat(
      calculateEpisodeProfitLoss(episode, "en-GB", "GBP")
    );
  });

  let percentage = (total / season.goal) * 100;

  return percentage.toFixed(1);
}
