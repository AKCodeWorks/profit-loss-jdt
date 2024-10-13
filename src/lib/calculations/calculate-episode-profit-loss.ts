import type { Episode } from "../interfaces";
import { safeParseFloat, calcluateItemProfitLoss } from "./";

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
