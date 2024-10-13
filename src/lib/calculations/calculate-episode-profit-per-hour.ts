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

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(total / calculateEpisodeTimeSpent(episode));
}
