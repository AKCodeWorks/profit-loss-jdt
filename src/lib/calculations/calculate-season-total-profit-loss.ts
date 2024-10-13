import type { Season } from "../interfaces";
import { safeParseFloat, calculateEpisodeProfitLoss } from "./";

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
