import type { Episode } from "../interfaces";
import {
  safeParseFloat,
  calcluateItemProfitLoss,
  calculateEpisodeTimeSpent,
} from "./";

export function calculateEpisodeProfitPerHour(
  episode: Episode,
  locale: string = "en-GB",
  currency: string = "GBP"
) {
  if (!episode?.items?.length) return 0;
  let total = 0;

  episode.items.forEach((item) => {
    total += safeParseFloat(calcluateItemProfitLoss(item));
  });

  let result = total / calculateEpisodeTimeSpent(episode);

  if (isNaN(result)) result = 0;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(result);
}
